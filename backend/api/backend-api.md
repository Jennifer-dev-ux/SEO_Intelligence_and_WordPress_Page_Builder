# Backend API (Sprint 1)

Base URL: `http://localhost/api`  
(Production URL will be updated later)

---

## Authentication

All requests must include:

- `Content-Type: application/json`
- `x-api-key: YOUR_SECRET_KEY`

---

## POST `/competitors_add.php`

Used by: **n8n automation**  
Purpose: Store competitor info + new SEO metrics for a specific date.

### Request Body (JSON)

```json
{
  "name": "Competitor A",
  "domain": "example.com",
  "metrics": {
    "date": "2025-12-03",
    "numPagesWithTargetKeyword": 4,
    "avgTitleLength": 45.2,
    "percentPagesWithH1Keyword": 60.0,
    "totalBacklinks": 200,
    "referringDomains": 180,
    "avgPositionForMainKeywords": 12.3,
    "totalClicks": 160,
    "totalImpressions": 3870
  }
}
