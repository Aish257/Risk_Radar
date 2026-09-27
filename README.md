# 🚨 RiskRadar

### AI-Based Hazard Red-Zone Identification & Relocation Decision-Support Platform

RiskRadar is a **GIS + Explainable AI-based disaster management platform** that helps authorities identify vulnerable areas, understand disaster risk, evaluate safe relocation sites, verify critical areas through field officers, and support relocation decisions.

For the MVP, we focus on **three highly vulnerable states — Kerala, Uttarakhand and Odisha**, with the architecture designed for future expansion to more vulnerable regions.

---

## 🎯 Problem

Disaster management requires authorities to combine **hazard information, GIS data, population vulnerability, field observations and relocation capacity** to make timely decisions.

RiskRadar brings these processes together in one connected platform.

---

## 💡 Key Features

* 🗺️ **GIS Risk Mapping** — Visualize critical zones, vulnerable habitations and hazard layers.
* 🤖 **Explainable AI** — Understand why an area is classified as high or critical risk.
* 🏘️ **Habitation Ranking** — Prioritize vulnerable areas based on risk and vulnerability.
* 🏕️ **Safe Site Assessment** — Evaluate potential relocation sites and their capacity.
* 🚚 **Relocation Planning** — Match vulnerable populations with feasible safe sites.
* 🔬 **Scenario Analysis** — Simulate extreme conditions and understand possible impacts.
* 👷 **Field Verification** — Connect authorities with field officers for GPS, photos and ground observations.
* 🔄 **Simulated Live Updates** — Demonstrates how changing hazard conditions can update risk information.
* 📊 **Reports** — Generate structured risk, relocation and field-verification reports.

---

# 🎬 MVP Demonstration Flow

```text
Sign Up / Sign In
        │
        ▼
Role-Based Authentication
        │
        ├──────────────────────────────────────────────────────────────┐
        │                                                              │
        ▼                                                              ▼
   👤 AUTHORITY                                                  👷 FIELD OFFICER
        │                                                              │
        ▼                                                              ▼
    Dashboard                                                    My Assignments
        │                                                              │
        ▼                                                              ▼
     GIS Map                                                       Take Action
        │                                                              │
        ▼                                                              ▼
Habitation Ranking                                                In Progress
        │                                                              │
        ▼                                                              ▼
 Explainable AI                                            GPS + Photo + Observation
        │                                                              │
        ▼                                                              │
   Safe Sites                                                        │
        │                                                              │
        ▼                                                              │
Relocation Planning                                                  │
        │                                                              │
        ▼                                                              │
 Scenario Analysis                                                    │
        │                                                              │
        ▼                                                              │
 Create Field Task ──────────────────────────────────────────────────►│
                                                                       │
                                                                       ▼
                                                              Field Verification
                                                                       │
                                                                       ▼
                                                               Submit Evidence
                                                                       │
                                                                       │
        ◄──────────────────────────────────────────────────────────────┘
        │
        ▼
 Authority Review
        │
        ▼
 Risk Reassessment
        │
        ▼
 Final Authority Decision
        │
        ▼
      Reports

---

## 🖥️ MVP Screens

### 🔐 Authentication

<!-- Add authentication screenshot here -->

<br>

### 📊 Authority Dashboard

<!-- Add dashboard screenshot here -->

<br>

### 🗺️ GIS Risk Map

<!-- Add risk map screenshot here -->

<br>

### 🏘️ Habitation Ranking

<!-- Add habitation ranking screenshot here -->

<br>

### 🏕️ Safe Sites & Carrying Capacity

<!-- Add safe sites screenshot here -->

<br>

### 🚚 Relocation Planning

<!-- Add relocation planning screenshot here -->

<br>

### 🔬 Scenario Analysis

<!-- Add scenario analysis screenshot here -->

<br>

### 👷 Field Verification

<!-- Add field verification screenshot here -->

---

## 👥 User Roles

### Authority

* Monitor disaster risk
* View GIS and risk information
* Prioritize vulnerable habitations
* Evaluate safe sites
* Plan relocation
* Run scenarios
* Assign field verification
* Review field evidence
* Generate reports

### Field Officer

* View assigned tasks
* Take action on field assignments
* Capture GPS and photographs
* Submit observations and evidence
* Track submitted verification reports

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS

**GIS:** Leaflet, React-Leaflet, CARTO, OpenStreetMap

**Backend:** Supabase

**Database:** PostgreSQL

**Authentication:** Supabase Auth

**Storage & Realtime:** Supabase Storage + Realtime

**Deployment:** Vercel

---

## 🔐 Data & MVP Status

* Current MVP covers **Kerala, Uttarakhand and Odisha**.
* Hazard updates are **simulated for demonstration**.
* The architecture is designed to integrate authoritative real-time data sources in the future.
* Demo/simulated information is clearly distinguished from official data.
* Supabase RLS is used for role-based access.

---

## 🚀 Future Scope

* Expand to more vulnerable states and regions.
* Integrate authoritative real-time hazard data.
* Add advanced ML and satellite-based risk analysis.
* Improve automated alerts and route optimization.
* Support large-scale disaster-management deployment.

---

## 🏆 Core Idea

> **Detect Risk → Explain Risk → Prioritize Vulnerable Areas → Identify Safe Sites → Plan Relocation → Verify on Ground → Reassess → Support Authority Decision**

### RiskRadar

**From Risk Detection to Safer Relocation Decisions.**
