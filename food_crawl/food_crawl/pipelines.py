# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import json
import datetime
class FoodCrawlPipeline:
    def __init__(self):
        self.items_batch = []  # 한 배치에 포함될 item들을 저장하는 리스트
        self.batch_size = 50  # 한 번에 저장할 item의 개수

    def process_item(self, item, spider):
        # item을 배치에 추가
        self.items_batch.append(item)

        # 배치 크기가 batch_size에 도달하면 파일에 저장
        if len(self.items_batch) >= self.batch_size:
            self.save_batch_to_file()
        
        return item

    def save_batch_to_file(self):
        # 'batch_{timestamp}.json' 형식으로 파일 저장
        
        current_time = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"food_batch_{current_time}.json"
        with open(filename, 'w') as f:
            json.dump(self.items_batch, f, indent=4)
        
        # 배치 처리 후 리스트 초기화
        self.items_batch = []

    def close_spider(self, spider):
        # 크롤링이 끝난 후 남은 item들을 처리 (배치 크기가 맞지 않으면 남은 항목들을 저장)
        if self.items_batch:
            self.save_batch_to_file()

