# TEAM-DIAMONDS
# 🌾 CropWise — Smart Mandi Profit Advisor

### *Sell Smarter. Earn Better.*

**CropWise** is an AgriTech web application designed to help farmers choose the most profitable mandi for selling their grain. Instead of selecting a mandi only based on the highest quoted price, CropWise compares the **expected net return** after considering selling costs and deductions.

---

## 🎯 Problem Statement

### P22 — Limited Visibility Into Profitable Grain Market Choices

Farmers often assume that the mandi offering the highest quoted price will provide the highest income. However, the actual earning can be affected by several additional costs and risks, such as:

* 🚚 Transportation
* 📦 Loading
* 🧾 Commission
* 🛣️ Toll
* ⏳ Waiting time
* 💧 Moisture deductions
* ⚠️ Rejection risk

Therefore, the mandi with the highest displayed price may not always provide the highest actual return.

---

## 💡 Our Solution

**CropWise** helps farmers make better mandi-selection decisions by comparing different market options based on their **estimated net return**.

The farmer provides:

* 🌾 Crop
* ⚖️ Quantity
* ⭐ Crop Grade
* 📍 Location

CropWise then compares available mandi options, calculates the associated costs and deductions, and recommends the mandi with the **best estimated net return**.

### 💰 Core Calculation

**Gross Sale Value − Selling Costs/Deductions = Estimated Net Return**

---

## 🔄 How CropWise Works

```text
👨‍🌾 Farmer
     ↓
Enter Crop Details
     ↓
Enter Quantity & Grade
     ↓
Select Location
     ↓
Compare Nearby Mandis
     ↓
Calculate Costs & Deductions
     ↓
Calculate Net Return
     ↓
🏆 Recommend Best Mandi
```

---

## 🚀 Key Features

### 🌾 1. Crop & Quantity Input

Allows farmers to enter the crop they want to sell and its quantity.

### 🏪 2. Mandi Comparison

Compares multiple mandi options based on available market information.

### 💰 3. Net Return Calculation

Calculates the expected earning after considering relevant selling costs and deductions.

### 📊 4. Cost Breakdown

Shows the costs involved so farmers can understand why one mandi may be more profitable than another.

### ⚠️ 5. Risk Awareness

Considers factors such as waiting time and potential rejection or deductions.

### 🏆 6. Smart Recommendation

Highlights the mandi with the highest estimated net return.

---

## 🏗️ System Architecture

```text
                 👨‍🌾 FARMER
                      │
                      ▼
             ┌──────────────────┐
             │    CropWise UI   │
             │  HTML + CSS      │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ JavaScript Logic │
             │                  │
             │ • Calculations   │
             │ • Comparison     │
             │ • Recommendation │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │    Mandi Data    │
             │                  │
             │ • Prices         │
             │ • Costs          │
             │ • Market Factors │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Results Dashboard│
             │                  │
             │ • Net Return     │
             │ • Cost Breakdown │
             │ • Best Mandi     │
             └──────────────────┘
```

---

## 🗄️ Data Schema

### MARKET

```text
market_id
market_name
location
distance
```

### CROP_PRICE

```text
price_id
market_id
crop
grade
price_per_quintal
```

### MARKET_COST

```text
cost_id
market_id
transport
loading
toll
commission
moisture_deduction
waiting_risk
rejection_risk
```

### Relationship

```text
MARKET
   │
   ├──── CROP_PRICE
   │
   └──── MARKET_COST
```

For the initial prototype, CropWise uses a structured demo dataset. The data model is designed so it can later be connected to a database and live mandi APIs.

---

## 🛠️ Technology Stack

**Frontend**

* HTML
* CSS
* JavaScript

**Data**

* Structured Demo Dataset

**Future**

* Database
* Live Mandi/API Integration

---

## ✨ Innovation

Traditional approach:

> **“Which mandi has the highest price?”**

CropWise approach:

> **“Which mandi gives me the highest expected net return?”**

The key difference is that CropWise focuses on the **actual expected earning after costs and deductions**, rather than looking only at the quoted selling price.

---

## 🎯 Goal

The goal of CropWise is to reduce information gaps and help farmers make more informed market decisions.

By comparing expected net returns, CropWise aims to help farmers:

* Make better mandi choices
* Avoid unnecessary travel
* Understand selling costs
* Improve price realization
* Choose markets based on expected profitability

---

## 🔮 Future Scope

* 📡 Live mandi price APIs
* 📊 Real-time market arrival data
* 🌾 Support for more crop grades
* 📈 Historical price trends
* 🚚 Farmer-specific transport estimation
* ⚠️ Improved risk prediction
* ☁️ Database and cloud backend
* 🌐 Multilingual interface
* 🤖 AI-based advisory

---

## 🏆 Project Pitch

> **“CropWise helps farmers choose where to sell by comparing expected net returns across mandis instead of simply choosing the mandi with the highest quoted price.”**

---

## 👥 Team

**Team Members:**

* Member 1
* Member 2
* Member 3
* Member 4

---

### 📌 Hackathon

**Kalpvruksh 2.0 Mini Hackathon 2026**
**Problem P22 — Limited Visibility Into Profitable Grain Market Choices**
