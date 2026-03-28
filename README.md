### 📦 OfflineTools-MELI (in development)  
Logistics tools hub for operational support.

---

### 01. Route Auditing

Operational support tool developed to assist in the balancing/audit process and cart checking, especially in situations involving system issues, counting discrepancies, or errors when drivers submit package counts.

The main goal is to ensure that the route is properly audited, allowing the operator to perform the verification quickly and efficiently through an intelligent checklist logic.

## Features

- **Real-Time Checklist:** The list of expected IDs is displayed on screen and automatically checked off as scans occur.  
- **Smart Validation (Regex):** Automatically filters label scans (11 digits), treating out-of-pattern codes (such as 44-digit DANFEs) as "Invalid".  
- **Color-Coded Visual Feedback:**  
  - ⚪ **Gray:** Item waiting to be scanned.  
  - 🟢 **Green:** Item successfully verified.  
  - 🟠 **Orange:** "Extra" item (11-digit ID not present in the base list).  
  - 🔴 **Red:** "Invalid" item (label out of pattern or scan error).  
- **Duplicate Handling:** Removes repeated IDs from the database and alerts the user if the same package is scanned more than once.  
- **CSV Export:** Generates a complete report containing verified, missing, and exception items.  
- **Offline Mode:** Runs entirely in the browser, with no need for a database or internet connection after the initial load.


### 2. Label Generator 

Module for local generation of package labels, designed for situations where reprinting through *Logistics* is unavailable (file missing) or for creating *Dummy Boxes*.

## Features

* **Input:** Fields for destination facility, origin facility, cluster, promise, and Seller/Buyer information.
* **Barcode and QR Code Generation:** Local processing using lightweight libraries (JsBarcode and QRCode.js).



---

## Technologies Used

- **HTML5 & CSS3:** Responsive interface following the "Mercado Livre" visual identity.  
- **JavaScript (Vanilla):** Data processing logic, DOM manipulation, and Regex.  
- **Git & GitHub:** Version control and deployment.  

---

##  How to Use

1. Access the tool (locally or via [GitHub Pages](https://thluq.github.io/OfflineTools-MELI/))  
2. Paste the list of package IDs you want to audit into the configuration field  
3. Click **"Start Audit"**  
4. Scan the items — the list will update automatically  
5. When finished, click the three dots (⋮) and select **"Download Results (CSV)"**  

---

##  Developer

**Thiago Lucas Nunes Gonçalves**(SSP20)  
*Computer Engineering Student*  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/thiago-lucas-nunes-goncalves)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/thluq)

---
---

##  Disclaimer

This tool is an independent local automation project and **does not constitute an official system or product**.  

All rights related to logos, trademarks, and the names *"Mercado Livre"* and *"Mercado Envios"* belong exclusively to **Ebazar.com.br LTDA**.  

The use of this visual identity is solely intended to facilitate operational familiarity for collaborators, with no intention of misuse, commercialization, or violation of intellectual property.
