# 📊 Google Sheets Integration Guide for Over The Top Solar (Awadh Enterprises)

Follow these simple 3 steps to connect your website enquiry popup directly to your Google Sheet using your Awadh Google ID.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) using your Awadh Google account. If you want a Google Form too, create it at [Google Forms](https://forms.new), open its **Responses** tab, and link it to a new or existing spreadsheet.
2. Name the spreadsheet: **Awadh Solar - Customer Enquiries**.
3. Popup enquiries are saved in a separate **Enquiries** tab in that spreadsheet. The script creates the tab and its header row automatically.

| A | B | C | D | E | F | G | H | I |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lead ID** | **Received at** | **Name** | **Phone** | **Requirement** | **Monthly bill** | **City / locality** | **Consent** | **Source** |

---

### Step 2: Add Google Apps Script
1. In your Google Sheet, click **Extensions** (एक्सटेंशन) → **Apps Script**.
2. Delete any existing code in the editor, and paste this exact script:
3. In **Project Settings** → **Script Properties**, add `ENQUIRY_TOKEN` with a private random value of at least 24 characters. Enter the same value in the Admin Panel.

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty("ENQUIRY_TOKEN");
    if (!token || token.length < 24 || data.token !== token) throw new Error("Unauthorized");
    if (!data.consent || !/^[6-9][0-9]{9}$/.test(data.phone || "")) throw new Error("Invalid input");
    var sheet = doc.getSheetByName("Enquiries") || doc.insertSheet("Enquiries");
    if (!sheet.getLastRow()) sheet.appendRow(["Lead ID", "Received at", "Name", "Phone", "Requirement", "Monthly bill", "City / locality", "Consent", "Source"]);

    // Format IST Date & Time
    var formattedDate = Utilities.formatDate(
      new Date(),
      "Asia/Kolkata",
      "dd/MM/yyyy hh:mm:ss a"
    );

    // Append new row to Google Sheet
    var safe = value => "'" + String(value || "").slice(0, 200);
    sheet.appendRow([data.leadId || "", formattedDate, safe(data.name), safe(data.phone), safe(data.requirement), safe(data.billRange), safe(data.locality), "Yes", "Website popup"]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, message: "Lead saved successfully" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
```

---

### Step 3: Deploy as Web App & Get URL
1. Click the blue **Deploy** (डिप्लॉय) button on the top right → **New deployment** (नया डिप्लॉयमेंट).
2. Click the gear icon ⚙️ next to "Select type" and select **Web app**.
3. Set the following options:
   - **Description**: `Awadh Solar Enquiry Webhook`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` (महत्वपूर्ण: इसे Anyone रखें ताकि वेबसाइट बिना लॉगिन डेटा भेज सके)
4. Click **Deploy**. (Grant permissions if prompted by Google).
5. Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 4: Save the connection in the Admin Panel
Add this line to your `.env.local` file:
```env
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
GOOGLE_SHEETS_WEBHOOK_TOKEN="the-same-random-secret"
```
Or paste the deployed URL and the same secret into your website's Admin Panel under **Enquiries / पूछताछ**, then press **Save integration**. The secret must also be set as `ENQUIRY_TOKEN` in the Apps Script project's Script Properties.

*Note: Even before you set up Google Sheets, every lead is automatically backed up safely on the server in `data/leads.json` and customer gets an instant 1-click WhatsApp confirmation!*

