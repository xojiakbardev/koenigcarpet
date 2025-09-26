import requests
import json

# Data.json ni o'qiymiz
with open("data.json", "r", encoding="utf-8") as f:
    local_data = json.load(f)

# API base URL
BASE_API = "https://www.bmhome.com.tr/api/product/GetProductList"
FILTER_JSON = {
    "CategoryIdList": [2],
    "BrandIdList": [],
    "SupplierIdList": [],
    "TagIdList": [],
    "TagId": -1,
    "FilterObject": [],
    "MinStockAmount": -1,
    "IsShowcaseProduct": -1,
    "IsOpportunityProduct": -1,
    "FastShipping": -1,
    "IsNewProduct": -1,
    "IsDiscountedProduct": -1,
    "IsShippingFree": -1,
    "IsProductCombine": -1,
    "MinPrice": 0,
    "MaxPrice": 0,
    "Point": -1,
    "SearchKeyword": "",
    "StrProductIds": "",
    "IsSimilarProduct": False,
    "RelatedProductId": 0,
    "ProductKeyword": "",
    "PageContentId": 0,
    "StrProductIDNotEqual": "",
    "IsVariantList": -1,
    "IsVideoProduct": -1,
    "ShowBlokVideo": -1,
    "VideoSetting": {"ShowProductVideo": -1, "AutoPlayVideo": -1},
    "ShowList": 1,
    "VisibleImageCount": 0,
    "ShowCounterProduct": -1,
    "ImageSliderActive": True,
    "ProductListPageId": 0,
    "ShowGiftHintActive": False,
    "IsInStock": False,
    "IsPriceRequest": True,
    "IsProductListPage": True,
    "NonStockShowEnd": 1,
}
PAGE_ITEM_COUNT = 0  # API ga ko'ra hammasi olinsin
page_number = 1
all_products = []

while True:
    paging_json = {"PageItemCount": PAGE_ITEM_COUNT, "PageNumber": page_number, "OrderBy": "URUNADI", "OrderDirection": "ASC"}
    
    params = {
        "c": "enusd1000",
        "FilterJson": json.dumps(FILTER_JSON),
        "PagingJson": json.dumps(paging_json),
        "CreateFilter": False,
        "TransitionOrder": 0,
        "PageType": 1,
        "PageId": 2
    }

    res = requests.get(BASE_API, params=params)
    res.raise_for_status()
    data = res.json()
    print(f"Page {page_number} fetched.", len(all_products))
    
    products = data.get("products", [])
    if not products:
        break  # mahsulot qolmadi, loop tugadi

    all_products.extend(products)
    page_number += 1

print(f"Total products fetched: {len(all_products)}")

# local_data bilan solishtirib price ni yangilash
local_products_by_id = {str(p["id"]): p for p in local_data}

for product in all_products:
    pid = str(product.get("id"))
    if pid in local_products_by_id:
        local_product = local_products_by_id[pid]
        new_price = float(product.get("price", local_product.get("price", 0)))
        if float(local_product.get("price", 0)) != new_price:
            local_product["productPriceOriginal"] = new_price
            local_product["price"] = new_price

# Yangilangan data.json ni saqlash
with open("data_updated.json", "w", encoding="utf-8") as f:
    json.dump(local_data, f, ensure_ascii=False, indent=2)

print("data_updated.json faylga saqlandi.")
