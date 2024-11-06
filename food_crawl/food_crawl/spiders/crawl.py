import scrapy
import pandas as pd
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from multiprocessing import Process
from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess

class ExampleSpider(scrapy.Spider):
    name = 'food_crawl'
    def start_requests(self):
        df = pd.read_csv("11.csv")
        urls = []
        for index, row in df.iterrows():
            name = row['name'].replace(" ", "-")
            id = row['id']
            url = f"https://www.food.com/recipe/{name}-{id}"

            # 각 URL에 대응되는 meta 정보를 설정
            meta_info = {'index': index, 'name': name, 'id': id}
            
            # URL과 meta 정보를 함께 append
            urls.append((url, meta_info))

        # urls 리스트에 있는 URL들과 meta 정보를 동시에 요청
        for url, meta_info in urls:
            yield scrapy.Request(url=url, callback=self.parse, meta=meta_info)
            
    def parse(self, response):
        index = response.meta['index']
        name = response.meta['name']
        id = response.meta['id']
        script_tag = response.xpath("//script[@type='application/ld+json']/text()").get()
        if script_tag:
            json_data = json.loads(script_tag)
            dietary_fiber = json_data.get('nutrition', {}).get('fiberContent')
            ingredient = json_data.get('recipeIngredient', [])

            # Convert ingredients to string
            ingredients_str = ', '.join(ingredient)

            # Store the results in a dictionary

            serving_size = self.get_serving_size(response.url)
            # Save the data to a file or process as needed
            item = {
                'index': index,
                'name': name,  # name included to help with dynamic filename creation
                'recipeIngredient': ingredients_str,
                'fiber': dietary_fiber,
                'serving_size': serving_size
            }
            filename = f"food_{name}_{id}.json"

            # Store the results to a file or return the item (to be handled by pipeline)
            item['filename'] = filename  # Add filename to the item to be used in pipeline
            yield item
        else:
            self.logger.warning(f'No JSON data found for URL: {response.url}')

    def get_serving_size(self, url):
        # Selenium WebDriver 설정
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')        # Head-less 설정
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        driver = webdriver.Chrome(options=options)

        try:
            driver.get(url)

            # Wait for the "Nutrition Information" button to be clickable
            nutrition_button = WebDriverWait(driver, 1000).until(
                EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Nutrition information")]'))
            )

            # Click the "Nutrition information" button
            nutrition_button.click()

            nutrition_modal = WebDriverWait(driver, 1000).until(
                EC.visibility_of_element_located((By.XPATH, '//div[@class="modal svelte-1biiku8"]'))
            )

            serving_size_element = WebDriverWait(nutrition_modal, 2000).until(
                EC.presence_of_element_located((By.XPATH, './/p[text()=" "]'))
            )

            # Extract the entire text content of the serving size element
            serving_size_text = serving_size_element.text
            serving_size_t, serving_size_value = serving_size_text.split(":")
            return serving_size_value.strip()  # 리턴할 때 공백 제거

        except Exception as e:
            self.logger.error(f"Error while fetching serving size: {e}")
            return ""  # 에러 발생 시 빈 문자열 반환
        finally:
            driver.quit()
