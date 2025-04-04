# aws-api2; an AI API

Sample-Call:

```JSON
{
    "note": "Supermarkt", 
    "categories": [
        "PERSONAL",
        "LAUNDRY",
        "SNACK",
        "EAT_OUTSIDE",
        "FOOD_STUFFS",
        "SANITARY",
        "CAKE_COFFEE"
        ]
}
```

Result:
```{"category":"FOOD_STUFFS"}```

```JSON
{
    "feelings": [ "tired", "enganged", "WANT TO DO SPORT"],
    "activities": ["CLEANUP", "TAIJI", "WALK", "WATCH A MOVIE"],
    "constraints": [
        "CLEANUP not Friday",
        "TAIJI not Friday",
        "RELAX",
        "WATCH A MOVIE not TOO LATE",
        "MUST DO SPORT LATE"
    ]            
}
```

Result:

```JSON
{"response":{"activity":{"name":"XYZ"}}}
```
