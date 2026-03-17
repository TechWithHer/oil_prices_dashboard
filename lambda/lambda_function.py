import json
import os
import boto3
import requests
from datetime import datetime, timedelta, timezone

s3 = boto3.client('s3')
BUCKET = "oil-prices-project-techwithher"

STATES = ["NEW YORK", "CALIFORNIA", "TEXAS", "FLORIDA", "ILLINOIS"]

def lambda_handler(event, context):
    current_time = datetime.now(timezone.utc)
    date_str = current_time.strftime("%Y-%m-%d")
    time_str = current_time.strftime("%H:%M:%S UTC")

    log_key = f"logs/year={current_time.year}/month={current_time.month:02}/day={current_time.day:02}/log_{current_time.strftime('%H%M%S')}.json"

    try:
        EIA_API_KEY = os.environ['EIA_API_KEY']
        url = f"https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key={EIA_API_KEY}&frequency=weekly&data[0]=value&facets[duoarea][]=Y35NY"  # Example New York

        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()["response"]["data"]

        # Prepare today's prices per state (latest available data)
        today_prices = []
        for state in STATES:
            # Find latest value for this state
            state_data = [d for d in data if d.get("area-name") == state]
            if state_data:
                latest = float(state_data[-1]["value"])
                today_prices.append({"state": state, "price": round(latest, 2)})
            else:
                today_prices.append({"state": state, "price": None})

        # Prepare last 7 days trend (fake variation for now)
        weekly_data = []
        for state_price in today_prices:
            base = state_price["price"] or 80.0
            trend = []
            for i in range(7):
                # small variation +/- 3%
                val = round(base * (0.97 + 0.06 * (i/6)), 2)
                trend.append(val)
            weekly_data.append(trend)

        output = {
            "today": today_prices,
            "weekly": {
                "labels": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
                "countries": STATES,
                "data": weekly_data
            }
        }

        # Save JSON for frontend
        s3.put_object(
            Bucket=BUCKET,
            Key="data/oil_prices.json",
            Body=json.dumps(output, ensure_ascii=False),
            ContentType="application/json"
        )

        # Save log
        s3.put_object(
            Bucket=BUCKET,
            Key=log_key,
            Body=json.dumps({"status":"SUCCESS","date":date_str,"time":time_str}),
            ContentType="application/json"
        )

        return {"statusCode":200,"body":"Success"}

    except Exception as e:
        print("Error:", e)
        s3.put_object(
            Bucket=BUCKET,
            Key=log_key,
            Body=json.dumps({"status":"FAILURE","error":str(e)}),
            ContentType="application/json"
        )
        raise e