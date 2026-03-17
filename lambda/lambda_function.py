import json
import os
import boto3
import requests
from datetime import datetime

s3 = boto3.client('s3')
BUCKET = "oil-prices-project-techwithher"

def lambda_handler(event, context):

    current_time = datetime.utcnow()
    execution_date = current_time.strftime("%Y-%m-%d")
    execution_time = current_time.strftime("%H:%M:%S UTC")
    log_key = f"logs/year={current_time.year}/month={current_time.month:02}/day={current_time.day:02}/log_{current_time.strftime('%H%M%S')}.json"

    try:
        EIA_API_KEY = os.environ['EIA_API_KEY']
        url = f"https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key={EIA_API_KEY}"
        r = requests.get(url, timeout=10)
        data = r.json()

        # Extract latest price
        latest_price = float(data["response"]["data"][0]["value"])

        # Hardcoded countries for dashboard
        formatted = { 
            "US": round(latest_price, 2),
            "India": round(latest_price * 1.03, 2),
            "China": round(latest_price * 1.02, 2),
            "Russia": round(latest_price * 0.97, 2),
            "Saudi Arabia": round(latest_price * 0.95, 2),
            "Singapore": round(latest_price * 1.04, 2),
            "Iran": round(latest_price * 0.93, 2),
            "UAE": round(latest_price * 0.96, 2)
            }

        # Save latest data (dashboard)
        s3.put_object(
            Bucket=BUCKET,
            Key="data/oil_prices.json",
            Body=json.dumps(formatted),
            ContentType="application/json"
        )

        # Save log (history)
        log_data = {
            "date": execution_date,
            "execution_time": execution_time,
            "status": "SUCCESS",
            "country_prices": formatted
        }

        s3.put_object(
            Bucket=BUCKET,
            Key=log_key,
            Body=json.dumps(log_data),
            ContentType="application/json"
        )

        return {"status": "success"}

    except Exception as e:

        log_data = {
            "date": execution_date,
            "execution_time": execution_time,
            "status": "FAILURE",
            "error": str(e),
            "country_prices": []
        }

        # Save failure log
        s3.put_object(
            Bucket=BUCKET,
            Key=log_key,
            Body=json.dumps(log_data),
            ContentType="application/json"
        )

        print(f"Error fetching data: {str(e)}")
        raise e