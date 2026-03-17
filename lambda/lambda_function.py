import json
import os
import boto3
import requests
from datetime import datetime

s3 = boto3.client('s3')
BUCKET = "oil-prices-project-techwithher"

def lambda_handler(event, context):

    current_time = datetime.now(datetime.timezone.utc)
    execution_date = current_time.strftime("%Y-%m-%d")
    execution_time = current_time.strftime("%H:%M:%S UTC")

    log_key = f"logs/year={current_time.year}/month={current_time.month:02}/day={current_time.day:02}/log_{current_time.strftime('%H%M%S')}.json"

    try:
        # 🔹 API Call Start Time
        start_time = datetime.now(datetime.timezone.utc)

        EIA_API_KEY = os.environ['EIA_API_KEY']
        url = f"https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key={EIA_API_KEY}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raises error if API fails

        data = response.json()

        # 🔹 API Call End Time
        end_time = datetime.now(datetime.timezone.utc)
        latency = (end_time - start_time).total_seconds()

        # 🔹 Extract latest price safely
        latest_price = float(data["response"]["data"][0]["value"])

        # 🔹 Frontend-friendly format
        formatted = [
            {"country": "USA", "price": round(latest_price, 2)},
            {"country": "India", "price": round(latest_price * 1.03, 2)},
            {"country": "China", "price": round(latest_price * 1.02, 2)},
            {"country": "Russia", "price": round(latest_price * 0.97, 2)},
            {"country": "Singapore", "price": round(latest_price * 1.04, 2)}

        ]

        # 🔹 Save latest data (for dashboard)
        s3.put_object(
            Bucket=BUCKET,
            Key="data/oil_prices.json",
            Body=json.dumps(formatted, ensure_ascii=False),
            ContentType="application/json"
        )

        # 🔹 Success log
        log_data = {
            "date": execution_date,
            "execution_time": execution_time,
            "status": "SUCCESS",
            "records_count": len(formatted),
            "latency_seconds": latency,
            "source": "EIA API",
            "country_prices": formatted
        }

        s3.put_object(
            Bucket=BUCKET,
            Key=log_key,
            Body=json.dumps(log_data, ensure_ascii=False),
            ContentType="application/json"
        )

        return {
            "statusCode": 200,
            "body": json.dumps("Data processed successfully")
        }

    except Exception as e:

        # 🔹 Failure log (ensure it never breaks)
        try:
            log_data = {
                "date": execution_date,
                "execution_time": execution_time,
                "status": "FAILURE",
                "error": str(e),
                "records_count": 0,
                "country_prices": []
            }

            s3.put_object(
                Bucket=BUCKET,
                Key=log_key,
                Body=json.dumps(log_data, ensure_ascii=False),
                ContentType="application/json"
            )

        except Exception as log_error:
            print(f"Logging failed: {str(log_error)}")

        print(f"Error fetching data: {str(e)}")

        return {
            "statusCode": 500,
            "body": json.dumps("Error processing data")
        }