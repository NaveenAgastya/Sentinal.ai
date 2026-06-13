from fastapi import FastAPI
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

@app.get("/users")
def get_users():

    access_df = pd.read_csv("data_access_logs.csv")

    profile_df = pd.read_csv("user_profiles.csv")

    return calculate_user_risks(
        access_df,
        profile_df
    )

@app.get("/incidents")
def get_incidents():

    access_df = pd.read_csv("data_access_logs.csv")

    incidents = []

    count = 1

    for _, row in access_df.iterrows():

        if (
            row["action"] == "export_data"
            and row["resource_sensitivity"] == "high"
        ):
            incidents.append({
                "id": f"INC-{count}",
                "time": row["timestamp"],
                "type": "Sensitive Data Export",
                "severity": "critical",
                "user": row["username"],
                "source": row["resource"],
                "description":
                    f"Exported sensitive data from {row['resource']}",
                "status": "open"
            })
            count += 1

        elif row["time_classification"] in [
            "night",
            "weekend",
            "unusual_hours"
        ]:
            incidents.append({
                "id": f"INC-{count}",
                "time": row["timestamp"],
                "type": "Anomalous Access",
                "severity": "high",
                "user": row["username"],
                "source": row["resource"],
                "description":
                    f"Access during {row['time_classification']}",
                "status": "investigating"
            })
            count += 1

    return incidents

@app.get("/user/{user_id}")
def get_user_details(user_id: str):

    access_df = pd.read_csv("data_access_logs.csv")
    profile_df = pd.read_csv("user_profiles.csv")

    user_logs = access_df[
        access_df["user_id"] == user_id
    ]

    profile = profile_df[
        profile_df["user_id"] == user_id
    ]

    if len(profile) == 0:
        return {"error": "User not found"}

    profile = profile.iloc[0]

    risk_factors = []

    if (user_logs["resource_sensitivity"] == "high").any():
        risk_factors.append(
            "Accessed high sensitivity resources"
        )

    if (
        user_logs["time_classification"]
        .isin(["night","weekend","unusual_hours"])
        .any()
    ):
        risk_factors.append(
            "Access during unusual hours"
        )

    if (
        user_logs["action"] == "export_data"
    ).any():
        risk_factors.append(
            "Data export activity detected"
        )

    if (
        user_logs["action"] == "admin_operation"
    ).any():
        risk_factors.append(
            "Administrative operations performed"
        )

    return {
        "user_id": user_id,
        "username": profile["username"],
        "department": profile["department"],
        "riskFactors": risk_factors,
        "activityCount": len(user_logs)
    }