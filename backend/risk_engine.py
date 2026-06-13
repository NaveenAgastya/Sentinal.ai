import pandas as pd

def calculate_user_risks(access_df, profile_df):

    risk_scores = {}

    for _, row in access_df.iterrows():

        user = row["user_id"]

        score = 0

        if row["resource_sensitivity"] == "high":
            score += 25

        if row["time_classification"] in [
            "night",
            "weekend",
            "unusual_hours"
        ]:
            score += 20

        if row["action"] == "export_data":
            score += 30

        if row["action"] == "admin_operation":
            score += 20

        if row["status"] == "failure":
            score += 15

        risk_scores[user] = risk_scores.get(user, 0) + score

    results = []

    for _, profile in profile_df.iterrows():

        uid = profile["user_id"]

        score = risk_scores.get(uid, 0)

        if profile["days_inactive"] > 45:
            score += 25

        if profile["privilege_level"] in [
            "power-user",
            "service-account"
        ]:
            score += 15

        score = min(score, 100)

        if score >= 80:
            level = "critical"
        elif score >= 60:
            level = "high"
        elif score >= 40:
            level = "medium"
        else:
            level = "low"

        results.append({
            "id": uid,
            "name": profile["username"],
            "email": profile["email"],
            "department": profile["department"],
            "riskScore": score,
            "riskLevel": level,
            "alerts": round(score / 10),
            "lastActivity": "Recently",
            "location": "Unknown",
            "device": "Corporate Device",
            "status": "active"
        })

    return sorted(
        results,
        key=lambda x: x["riskScore"],
        reverse=True
    )