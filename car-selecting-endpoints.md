# Car Selecting Endpoints

This document defines the API endpoints for selecting a car in the app using the **lazy-loading (Option 3)** pattern.  
The goal is to keep the surface minimal and payloads small while allowing users to drill down step by step: **Make → Model → Badge → YearRange**.

---

## Base Route

/cars

The same endpoint is used for all levels of selection, controlled by query parameters.

---

## 1. Get All Makes

**Request**
GET /cars

**Response**

```json
[
  { "id": "mk1", "name": "BMW", "slug": "bmw" },
  { "id": "mk2", "name": "Audi", "slug": "audi" },
  { "id": "mk3", "name": "Mercedes", "slug": "mercedes" }
]

2. Get Models for a Make
Request

GET /cars?makeId=mk1
Response
[
  { "id": "mdl1", "name": "3 Series", "slug": "3-series" },
  { "id": "mdl2", "name": "5 Series", "slug": "5-series" }
]
3. Get Badges for a Model
Request

bash
Copy code
GET /cars?modelId=mdl1
Response

json
[
  { "id": "bdg1", "name": "320i", "slug": "320i" },
  { "id": "bdg2", "name": "330i", "slug": "330i" }
]
4. Get Year Ranges for a Badge
Request

GET /cars?badgeId=bdg1
Response

json
[
  { "id": "yr1", "startYear": 2013, "endYear": 2018, "chassis": "F30", url:"" },
  { "id": "yr2", "startYear": 2019, "endYear": null, "chassis": "G20", url:"" }
]
```
