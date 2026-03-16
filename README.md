# 🌍 Global Oil Price Monitoring Dashboard

A cloud-native data pipeline and dashboard that automatically fetches daily oil price data for selected countries, stores historical logs in Amazon S3, and visualizes trends through a static website.

This project demonstrates a **real-world DevOps workflow** combining automation, cloud infrastructure, CI/CD, and data analytics.

---

# 🚀 Project Overview

The goal of this project is to build a **fully automated data pipeline and visualization system** that:

* Extracts daily oil prices from an external API
* Stores the data in **structured logs**
* Maintains historical records for trend analysis
* Hosts a static dashboard displaying current data
* Automates deployment using CI/CD

The system leverages serverless architecture and cloud storage to create a **lightweight yet production-style data pipeline**.

---

# 🎯 Problem Statement

Many dashboards only display **current data snapshots** and do not maintain historical records.

This project solves that by:

* Capturing **daily oil prices**
* Maintaining **structured logs**
* Allowing **future analytics and trend visualization**

---

# 🧠 Why This Project?

This project demonstrates practical DevOps and Cloud Engineering skills including:

* Infrastructure automation
* Serverless data pipelines
* Cloud storage architecture
* Continuous deployment
* Data logging and analytics

It simulates how **real production monitoring systems** collect, store, and analyze external data.

---

# ⚙️ Tech Stack

| Category               | Technology         |
| ---------------------- | ------------------ |
| Cloud Platform         | AWS                |
| Static Website Hosting | Amazon S3          |
| Serverless Compute     | AWS Lambda         |
| Scheduler              | Amazon EventBridge |
| Data Storage           | Amazon S3          |
| Query Engine           | Amazon Athena      |
| CI/CD                  | GitHub Actions     |
| Visualization          | Chart.js           |
| Language               | JavaScript, Python |
| Data Format            | JSON               |

---

# 🏗 Architecture

```
                +---------------------+
                |   GitHub Repository |
                +----------+----------+
                           |
                           | Push Code
                           v
                +---------------------+
                |   GitHub Actions    |
                |  CI/CD Pipeline     |
                +----------+----------+
                           |
                           v
                +---------------------+
                |      S3 Bucket      |
                | Static Website Host |
                +----------+----------+
                           |
                           v
                +---------------------+
                |  Dashboard Website  |
                |  (HTML + Chart.js)  |
                +----------+----------+

Daily Data Pipeline
-------------------

 EventBridge Scheduler
          |
          v
      AWS Lambda
          |
          v
 Fetch Oil Price API
          |
          v
 Save Logs to S3
```

---

# 📊 Dashboard Features

The web dashboard displays:

### 1️⃣ Current Oil Prices

Shows the latest oil prices for monitored countries:

* United States
* China
* India
* Russia
* Saudi Arabia

### 2️⃣ Data Visualization

Charts are rendered using **Chart.js** to visualize oil prices.

### 3️⃣ Image Rotation

Oil industry images rotate periodically to improve UI.

### 4️⃣ Automatic Updates

Prices refresh automatically when the Lambda pipeline updates the data.

---

# 📂 Repository Structure

```
oil-price-dashboard
│
├── index.html
├── script.js
├── style.css
│
├── images
│   ├── oil1.jpg
│   ├── oil2.jpg
│   ├── oil3.jpg
│   └── oil4.jpg
│
├── data
│   └── oil_prices.json
│
├── lambda
│   └── oil_price_fetcher.py
│
└── .github
    └── workflows
        └── deploy.yml
```

---

# 📦 S3 Bucket Structure

```
S3 Bucket
│
├── index.html
├── script.js
├── style.css
│
├── images
│
└── data
    ├── latest
    │   └── oil_prices.json
    │
    └── history
        ├── oil_prices_2026-03-15.json
        ├── oil_prices_2026-03-16.json
        └── oil_prices_2026-03-17.json
```

---

# 🔁 Data Pipeline Workflow

### Step 1 — Scheduled Trigger

Amazon EventBridge runs a scheduled job every **24 hours**.

```
EventBridge → Lambda
```

---

### Step 2 — Data Extraction

AWS Lambda:

* Calls an external oil price API
* Extracts country price data

---

### Step 3 — Data Logging

Lambda generates structured logs containing:

```
timestamp
execution_status
country_prices
```

Example:

```json
{
 "timestamp": "2026-03-15T10:00:00Z",
 "status": "success",
 "prices": {
   "USA": 82.5,
   "China": 83.4,
   "India": 84.1,
   "Russia": 80.9,
   "Saudi Arabia": 78.3
 }
}
```

---

### Step 4 — Store in S3

Lambda writes data to:

```
Latest snapshot:
data/latest/oil_prices.json
```

and

```
Historical records:
data/history/oil_prices_YYYY-MM-DD.json
```

---

# 📈 Querying Historical Data

Data stored in S3 can be analyzed using **Amazon Athena**.

Example queries:

### Oil price trend

```
SELECT date, prices.USA
FROM oil_price_logs
ORDER BY date;
```

### Execution failures

```
SELECT *
FROM oil_price_logs
WHERE status = 'failed';
```

This allows the project to scale into a **lightweight analytics platform**.

---

# 🔄 CI/CD Pipeline

GitHub Actions automatically deploys the site when code changes.

Pipeline flow:

```
Developer Push Code
       |
       v
GitHub Actions Workflow
       |
       v
Sync files to S3
```

Deployment command executed:

```
aws s3 sync . s3://oil-price-dashboard
```

This ensures the website is **always up to date**.

---

# 📊 Example Dashboard Output

The dashboard will display:

```
Global Oil Price Dashboard

[ rotating oil industry images ]

Bar Chart:
USA          82.5
India        84.1
China        83.4
Russia       80.9
Saudi Arabia 78.3
```

---

# 🔐 Security Considerations

To protect the infrastructure:

* API keys stored in **AWS Secrets Manager / Lambda environment variables**
* GitHub credentials stored in **GitHub Secrets**
* IAM roles restrict Lambda permissions

---

# 📌 Future Improvements

Potential enhancements include:

* Historical price trend graphs
* CloudWatch monitoring alerts
* Slack notifications on extraction failures
* Infrastructure as Code (Terraform)
* Data lake partitioning for Athena
* Automated dashboard refresh

---

# 🎓 Learning Outcomes

This project demonstrates hands-on experience with:

* Serverless architecture
* Data pipelines
* CI/CD automation
* Cloud storage architecture
* Data analytics integration
* Cloud-native monitoring systems

---

# 👩‍💻 Author

Built as a **DevOps / Cloud Engineering portfolio project** to demonstrate real-world cloud architecture and automation workflows.

---