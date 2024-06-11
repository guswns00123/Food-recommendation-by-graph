import ast
import pandas as pd
import pandas as pd
from datetime import datetime

# Load the CSV file into a DataFrame
df = pd.read_csv('/content/sample.csv')
df['cuisine'] = ''

# ingredient 수식어 cleaning 과정
words_to_keep = ['sugar','onion','beef', 'pork','sausage', 'chicken','black pepper','butter','zucchini','flour','salt','oats','bacon','red pepper','water','shrimp','cereal','yeast','paprika','tortillas','cabbage','potatoes']
removed_word = ['dried','roasted','prepared','diced','unsweetened','fresh','extra-large','extra','boneless','large','shredded','whole','refrigerated','nonstick','pure','granulated','ground','warm','icing','light','sharp','extra-sharp','soft','crushed','with ','mixed','frozen','canned','smoked','mini','low-fat','low sodium','toasted','sliced']

def keep_specific_words(item):
    for word in words_to_keep:
        if word in item:
            return word
    return item

def remove_specific_words(item, words_to_remove):
    words = item.split()
    cleaned_words = [word for word in words if word not in words_to_remove]
    cleaned_item = ' '.join(cleaned_words)
    return cleaned_item


for index, row in df.iterrows():
    ingredient = row['ingredients']
    ingredient_list = ast.literal_eval(ingredient)
    ingredient_list = [keep_specific_words(item) for item in ingredient_list]
    ingredient_list = [remove_specific_words(item, removed_word) for item in ingredient_list]
    ingredient_list = [item for item in ingredient_list if item != '']
    ingredient_list = list(dict.fromkeys(ingredient_list))
    df.at[index, 'ingredients'] = ingredient_list

# cuisine 타입 cleaning 하기
keep_word = ['south-west-pacific','north-american','asian','african','european','midwestern','middle-eastern','korean','southwestern-united-states', 'japanese','chinese','thai','indian','spanish','italian','mexican','american','french','vietnamese','turkish','greek','german','filipino','lebanese','moroccan','brazilian','russian','egyptian','ethiopian','peruvian','nepalese','iranian-persian','indonesian','malaysian','dutch','portuguese','belgian','australian','new zealand','chilean']
# 'korean', 'japanese','chinese','thai','indian','spanish','italian','mexican','american','french','vietnamese','turkish','greek','german','filipino'
def keep_specific_words(item):
    for word in keep_word:
        if word in item:
            return word

for index, row in df.iterrows():
  recipe_type = row['tags']
  recipe_type = ast.literal_eval(recipe_type)
  recipe_type = [keep_specific_words(item) for item in recipe_type]
  filtered_list = [item for item in recipe_type if item is not None]
  filtered_list = list(dict.fromkeys(filtered_list))
  df.at[index, 'cuisine'] = filtered_list
  print(df.at[index,'cuisine'])


# 평균 user rating 구하기
df2 = pd.read_csv('/content/RAW_interactions.csv')

average_ratings = df2.groupby('recipe_id')['rating'].mean().reset_index()
average_ratings.rename(columns={'rating': 'avg_rating'}, inplace=True)

merged_df = pd.merge(df, average_ratings, left_on='id', right_on='recipe_id', how='left')
merged_df.drop(columns=['recipe_id'], inplace=True)
merged_df.to_csv('Final_data.csv', index=False)