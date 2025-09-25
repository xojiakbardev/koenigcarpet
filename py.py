from pathlib import Path
import json

translations = {
    "It is a flat woven rug.": {
        "ru": "Это плоско-тканый ковер.",
        "tr": "Düz dokuma bir halıdır."
    },
    "Produced with hand craftsmanship on special looms.": {
        "ru": "Изготовлен вручную на специальных ткацких станках.",
        "tr": "Özel tezgahlarda el işçiliği ile üretilmiştir."
    },
    "Thickness is 7 mm.": {
        "ru": "Толщина составляет 7 мм.",
        "tr": "Kalınlığı 7 mm'dir."
    },
    "Made of acrylic, cotton, and viscose materials.": {
        "ru": "Изготовлен из акрила, хлопка и вискозы.",
        "tr": "Akrilik, pamuk ve viskoz malzemelerden üretilmiştir."
    },
    "Suitable for use throughout the year.": {
        "ru": "Подходит для использования в течение всего года.",
        "tr": "Tüm yıl boyunca kullanıma uygundur."
    }
}

def fix_translations(product):
    for lang in ["ru", "tr"]:
        if "features" in product and lang in product["features"]:
            section = product["features"][lang]
            if "technical_info" in section:
                fixed_info = []
                for item in section["technical_info"]:
                    if item in translations:
                        fixed_info.append(translations[item][lang])
                    else:
                        fixed_info.append(item)
                section["technical_info"] = fixed_info
    return product

with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

fixed_data = [fix_translations(p) for p in data]

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(fixed_data, f, ensure_ascii=False, indent=2)

