from flask import Flask, request, jsonify
from pymongo import MongoClient
import pandas as pd
import certifi
import os
from cerebras.cloud.sdk import Cerebras
from datetime import datetime

# Setup
app = Flask(__name__)
client = Cerebras()

MONGO_URI = os.environ.get("MONGO_URI")
mongo = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = mongo["burnout_detector"]
assignments_col = db["assignments"]

def get_date_range(view_type, date_str):
    date = pd.to_datetime(date_str, utc=True)
    if view_type == "Day":
        return date, date
    elif view_type == "Week":
        start = date - pd.Timedelta(days=date.weekday())
        return start, start + pd.Timedelta(days=6)
    else:  # Month
        start = pd.to_datetime(f"{date.year}-{date.month:02d}-01", utc=True)
        end = start + pd.offsets.MonthEnd(1)
        return start, end

@app.route("/api/burnout-analysis", methods=["POST"])
def analyze():
    data = request.get_json()
    email = data["email"]
    view = data["view"]
    date = data["date"]

    start, end = get_date_range(view, date)

    df = pd.DataFrame(list(assignments_col.find({
        "user_email": email,
        "due_at": {"$gte": start, "$lte": end}
    })))

    if df.empty:
        return jsonify({
            "burnout": 10,
            "stressLevel": "Low",
            "aiSummary": "No upcoming workload found.",
            "weeklyStressMap": {}
        })

    df['due_at'] = pd.to_datetime(df['due_at'], utc=True)
    summary_df = df[['due_at', 'course_name', 'title', 'points']].fillna(0)
    summary_df['due_at'] = summary_df['due_at'].dt.strftime('%Y-%m-%d %H:%M')

    table = "| Due Date | Course | Title | Points |\n|----------|--------|-------|--------|\n"
    for _, row in summary_df.iterrows():
        table += f"| {row['due_at']} | {row['course_name']} | {row['title']} | {int(row['points'])} |\n"

    burnout_data = {
        "start": start.strftime('%Y-%m-%d'),
        "end": end.strftime('%Y-%m-%d'),
        "num_assignments": df.shape[0],
        "num_quizzes": df[df['title'].str.contains("quiz|exam", case=False, na=False)].shape[0],
        "total_points": int(df['points'].sum()),
        "overlap_days": df['due_at'].dt.date.value_counts()[lambda x: x > 1].index.astype(str).tolist()
    }

    prompt = f"""
You're my AI wellness assistant.

Workload for {view} ({burnout_data['start']} to {burnout_data['end']}):
- Assignments: {burnout_data['num_assignments']}
- Quizzes/Exams: {burnout_data['num_quizzes']}
- Points: {burnout_data['total_points']}
- Overlap Days: {', '.join(burnout_data['overlap_days']) or 'None'}

{table}

Please give:
1. Burnout risk (0-100%)
2. 3 stress factors
3. 3 time management tips
4. 3 daily wellness tips
5. Most stressful day

Be supportive and speak as "you".
"""

    res = client.chat.completions.create(
        model="llama-4-scout-17b-16e-instruct",
        messages=[{"role": "user", "content": prompt}]
    )

    reply = res.choices[0].message.content
    percent_match = reply.lower().split('%')[0].split()[-1]
    burnout = int(percent_match) if percent_match.isdigit() else 64
    stressLevel = "High" if burnout > 75 else "Moderate" if burnout > 50 else "Low"

    weekday_map = {}
    for _, row in df.iterrows():
        d = pd.to_datetime(row['due_at']).weekday()
        day_key = ['M', 'T', 'W', 'T2', 'F', 'S', 'S'][d]
        weekday_map[day_key] = (
            "bg-red-500" if stressLevel == "High" else
            "bg-orange-400" if stressLevel == "Moderate" else
            "bg-green-500"
        )

    return jsonify({
        "burnout": burnout,
        "stressLevel": stressLevel,
        "aiSummary": reply,
        "weeklyStressMap": weekday_map
    })

if __name__ == "__main__":
    app.run(debug=True)
