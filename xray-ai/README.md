# 🫁 X-Ray AI Screening Assistant

> AI-powered chest X-ray disease screening for medical professionals.

## 🚀 Quick Start

### 1. Open the App
Just open `index.html` in your browser — **no build step required**.

> ⚠️ **Use a local web server** (not double-click file://) because the app uses ES Modules.  
> Any of these work:
> - **VS Code**: Install "Live Server" extension → right-click `index.html` → "Open with Live Server"
> - **Python**: `python -m http.server 8080` in the `xray-ai` folder, then open `http://localhost:8080`
> - **Node (if installed)**: `npx serve .`

---

## 🔥 Firebase Setup (Required for Auth, Storage, and History)

The AI simulation works **without Firebase**. You only need Firebase to enable:
- User login / registration
- Saving scan history
- Image storage

### Steps:
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. **Enable Authentication** → Sign-in method → Email/Password → Enable
4. **Enable Firestore Database** → Create in test mode
5. **Enable Storage** → Start in test mode
6. Go to **Project Settings** → Your apps → Web → Add app → Copy config
7. Open `js/firebase-config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                   // ← paste here
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Firestore Indexes (if needed)
If you see an index error in the console, Firestore will provide a link to auto-create the needed index.

---

## 📁 Project Structure

```
xray-ai/
├── index.html              # Landing page
├── css/
│   └── style.css           # Global styles (medical theme)
├── js/
│   ├── firebase-config.js  # ⚠️ Add your Firebase credentials here
│   ├── auth.js             # Auth helpers
│   ├── firestore.js        # Firestore queries
│   ├── storage-helper.js   # Firebase Storage upload
│   ├── ai-simulator.js     # AI prediction engine
│   ├── shell.js            # Sidebar + header renderer
│   └── utils.js            # Toast, session, PDF, risk helpers
└── pages/
    ├── login.html          # Sign in
    ├── register.html       # Register (Doctor / Admin role)
    ├── dashboard.html      # Home dashboard
    ├── upload.html         # X-ray upload + analysis  [Doctor only]
    ├── results.html        # AI analysis results      [Doctor only]
    ├── history.html        # Past scans               [Doctor only]
    └── admin.html          # Admin overview           [Admin only]
```

---

## 🔒 Role-Based Access

| Feature | Doctor | Admin |
|---------|--------|-------|
| Dashboard | ✅ | ✅ |
| Upload X-Ray | ✅ | ❌ |
| AI Analysis Results | ✅ | ❌ |
| Scan History | ✅ | ❌ |
| Admin Panel (all scans) | ❌ | ✅ |

> Admins can see scan metadata (IDs, dates, risk level) but **cannot access individual AI reports or disease predictions**.

---

## 🧠 AI Prediction

The AI simulator generates realistic predictions for **10 chest diseases**:

| Disease | — | Disease |
|---------|---|---------|
| Pneumonia | | Mass |
| Cardiomegaly | | Infiltration |
| Effusion | | Consolidation |
| Atelectasis | | Edema |
| Nodule | | Fibrosis |

To integrate a real external API, replace `simulatePrediction()` in `js/ai-simulator.js` with a `fetch()` call to your model endpoint.

---

## ⚠️ Disclaimer

This application is an AI-powered screening tool intended to **assist**, not replace, qualified medical professionals. Results do not constitute a clinical diagnosis.
