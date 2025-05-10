import requests
import json

url = "https://restcountries.com/v3.1/all"

response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    countries = []

    for country in data:
        try:
            countries.append({
                "name": country["name"]["common"],
                "flag": country["flags"]["png"],
                "capital": country["capital"][0] if "capital" in country and country["capital"] else "Unknown",
                "languages": list(country["languages"].values()) if "languages" in country else ["Unknown"]
            })
        except:
            continue

    with open("countries.json", "w", encoding="utf-8") as f:
        json.dump(countries, f, ensure_ascii=False, indent=2)
    print("✅ Données des pays enregistrées dans countries.json")
else:
    print("❌ Erreur lors de la récupération des données.")
