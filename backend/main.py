from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from risk_engine import calculate_user_risks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FIXED: Added root route to stop the 404 error at http://127.0.0
@app.get("/")
def home():
    return {"status": "Risk Engine API is running", "docs": "/docs"}

@app.get("/users")
def get_users():
    access_df = pd.read_csv("data_access_logs.csv")
    profile_df = pd.read_csv("user_profiles.csv")
    return calculate_user_risks(access_df, profile_df)

@app.get("/incidents")
def get_incidents():
    access_df = pd.read_csv("data_access_logs.csv")
    incidents = []
    count = 1

    for _, row in access_df.iterrows():
        # FIXED: Safeguard against missing username column by falling back to user_id
        user_identifier = row.get("username", row.get("user_id", "Unknown"))

        if row.get("action") == "export_data" and row.get("resource_sensitivity") == "high":
            incidents.append({
                "id": f"INC-{count}",
                "time": row["timestamp"],
                "type": "Sensitive Data Export",
                "severity": "critical",
                "user": user_identifier,
                "source": row["resource"],
                "description": f"Exported sensitive data from {row['resource']}",
                "status": "open"
            })
            count += 1
        elif row.get("time_classification") in ["night", "weekend", "unusual_hours"]:
            incidents.append({
                "id": f"INC-{count}",
                "time": row["timestamp"],
                "type": "Anomalous Access",
                "severity": "high",
                "user": user_identifier,
                "source": row["resource"],
                "description": f"Access during {row['time_classification']}",
                "status": "investigating"
            })
            count += 1
    return incidents

@app.get("/user/{user_id}")
def get_user_details(user_id: str):
    access_df = pd.read_csv("data_access_logs.csv")
    profile_df = pd.read_csv("user_profiles.csv")

    # FIXED: Convert columns to string to prevent type matching bugs (e.g., str vs int)
    access_df["user_id"] = access_df["user_id"].astype(str)
    profile_df["user_id"] = profile_df["user_id"].astype(str)

    user_logs = access_df[access_df["user_id"] == user_id]
    profile = profile_df[profile_df["user_id"] == user_id]

    if profile.empty:
        raise HTTPException(status_code=404, detail="User profile not found")

    profile_row = profile.iloc[0]
    risk_factors = []

    # FIXED: Process risk factors only if the user has activity logs
    if not user_logs.empty:
        if (user_logs["resource_sensitivity"] == "high").any():
            risk_factors.append("Accessed high sensitivity resources")
        if user_logs["time_classification"].isin(["night", "weekend", "unusual_hours"]).any():
            risk_factors.append("Access during unusual hours")
        if (user_logs["action"] == "export_data").any():
            risk_factors.append("Data export activity detected")
        if (user_logs["action"] == "admin_operation").any():
            risk_factors.append("Administrative operations performed")

    return {
        "user_id": user_id,
        "username": profile_row.get("username", "N/A"),
        "department": profile_row.get("department", "N/A"),
        "riskFactors": risk_factors,
        "activityCount": len(user_logs)
    }
