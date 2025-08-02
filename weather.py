from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

API_KEY = "65df346bb44bf710aa8619b35ea72225"
BASE_URL = "https://api.openweathermap.org/data/2.5"

@app.route("/")
def home():
    return render_template("index.html", default_city="Hyderabad")

@app.route("/api/weather")
def get_weather():
    city = request.args.get("city", "Hyderabad")
    
    try:
        current_response = requests.get(
            f"{BASE_URL}/weather",
            params={
                "q": city,
                "appid": API_KEY,
                "units": "metric"
            }
        )
        current_data = current_response.json()

        if current_response.status_code != 200:
            return jsonify({
                "error": current_data.get("message", "City not found"),
                "cod": current_response.status_code
            }), current_response.status_code

        forecast_response = requests.get(
            f"{BASE_URL}/forecast",
            params={
                "q": city,
                "appid": API_KEY,
                "units": "metric",
                "cnt": 40  
            }
        )
        forecast_data = forecast_response.json()

        daily_forecasts = []
        seen_dates = set()
        
        for item in forecast_data.get('list', []):
            date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
            if date not in seen_dates:
                seen_dates.add(date)
                daily_forecasts.append({
                    "date": datetime.fromtimestamp(item['dt']).strftime('%a, %b %d'),
                    "temp": round(item['main']['temp']),
                    "temp_min": round(item['main']['temp_min']),
                    "temp_max": round(item['main']['temp_max']),
                    "icon": item['weather'][0]['icon'],
                    "description": item['weather'][0]['description'].capitalize()
                })
                if len(daily_forecasts) == 5:  
                    break

        return jsonify({
            "current": {
                "city": current_data["name"],
                "country": current_data["sys"]["country"],
                "temperature": round(current_data["main"]["temp"]),
                "feels_like": round(current_data["main"]["feels_like"]),
                "humidity": current_data["main"]["humidity"],
                "pressure": current_data["main"]["pressure"],
                "wind_speed": current_data["wind"]["speed"],
                "description": current_data["weather"][0]["description"].capitalize(),
                "icon": current_data["weather"][0]["icon"],
                "sunrise": datetime.fromtimestamp(current_data["sys"]["sunrise"]).strftime('%H:%M'),
                "sunset": datetime.fromtimestamp(current_data["sys"]["sunset"]).strftime('%H:%M'),
                "date": datetime.fromtimestamp(current_data["dt"]).strftime('%A, %B %d, %Y')
            },
            "forecast": daily_forecasts
        })

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
