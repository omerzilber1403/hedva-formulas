# 🧮 Hedva Formulas - Calculus 2 Study App

> Interactive flashcard and quiz application for mastering Calculus 2 formulas with beautiful LaTeX rendering.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/hedva-formulas/deploys)

## ✨ Features

- 📚 **60+ Calculus 2 Formulas** - Comprehensive collection covering integration, series, vectors, and more
- 🎴 **Interactive Flashcards** - Learn with beautifully rendered LaTeX formulas
- 📝 **Quiz Mode** - Test your knowledge with randomized questions
- 📊 **Progress Tracking** - Monitor your performance with live statistics  
- ☁️ **Cloud Sync** - Save your progress across devices with Netlify Blobs  
  → **[Test Cloud Sync](CLOUD_SYNC_TEST.md)** - Verify cross-device login works
- 🏆 **High Score System** - Compete with friends and track personal bests
- 🎯 **Status Markers** - Mark formulas as Red/Yellow/Green for focused study
- � **Chapter Filtering** - Filter formulas by topic/chapter for focused study
- 📱 **PWA Support** - Install as standalone app on iOS/Android
- 💾 **Offline Mode** - Works without internet connection after first load
- 🌐 **Hebrew + Math** - RTL Hebrew interface with LTR mathematical notation
- ⚡ **Zero Build Required** - Pure client-side React with CDN imports

## 📱 Install as Mobile App

This app is a **Progressive Web App (PWA)** - you can install it on your phone like a native app!

**📖 [Full Installation Guide →](INSTALL_GUIDE.md)**

### Quick Install:
- **iPhone**: Safari → Share button ⎙ → "Add to Home Screen"
- **Android**: Chrome → Menu ⋮ → "Install app"
- **Desktop**: Click the install icon in the address bar

**Benefits**: Faster loading, offline access, full-screen experience

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/omerzilber1403/hedva-formulas.git
   cd hedva-formulas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run with Netlify Dev** (for full backend support)
   ```bash
   netlify dev
   ```
   App will open at `http://localhost:8888`

4. **Or use simple HTTP server** (no cloud sync)
   ```bash
   npx http-server -p 8888
   ```

### Deploy to Netlify

#### Option 1: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Configure:
   - **Build command**: (leave empty)
   - **Publish directory**: `.`
6. Click "Deploy site"

#### Option 2: Netlify CLI

```bash
netlify deploy --prod
```

## 📂 Project Structure

```
hedva-formulas/
├── calculus/
│   ├── index.html          # Main Calculus 2 app
│   └── quiz_data.js        # 60+ formulas database
├── netlify/
│   └── functions/
│       └── users.mjs       # User authentication & data sync API
├── api/
│   └── users.mjs           # Backend API (copy of netlify/functions)
├── index_portal.html       # Landing page
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🎮 How to Use

### Study Modes

1. **📇 Flashcard Mode** (Default)
   - Click cards to flip and reveal formulas
   - Mark understanding: ❌ Red | 🟡 Yellow | ✅ Green
   - Swipe or use arrow keys to navigate

2. **📝 Quiz Mode**
   - Answer multiple-choice questions
   - Get instant feedback on your answers
   - Track your score and high score

3. **📋 List Mode**
   - View all formulas at once
   - Perfect for quick reference
   - Searchable and filterable by status

### User System

- **First-time users**: Enter name + 4-digit PIN to register
- **Returning users**: Login with your name + PIN
- **Cloud sync**: Progress automatically saves to Netlify Blobs
- **Privacy**: PINs stored in plain text (upgrade to bcrypt for production!)

## 🛠️ Tech Stack

- **Frontend**: Pure React 18 (CDN)
- **Styling**: Tailwind CSS
- **Math Rendering**: KaTeX 0.16.9
- **Backend**: Netlify Functions (Edge)
- **Database**: Netlify Blobs (Key-Value Store)
- **Hosting**: Netlify
- **Language**: JavaScript (ES6 Modules)

## 🔐 Security Notes

⚠️ **Current PIN storage is in plain text!**

For production use, consider:
- Implementing bcrypt password hashing
- Adding Google OAuth
- Using environment variables for secrets
- Rate limiting on authentication endpoints

## 📊 Quiz Data Format

Formulas are stored in `calculus/quiz_data.js`:

```javascript
{
    id: 1,
    topic: "אינטגרל מסויים",
    question: "נוסחת אינטגרל מסויים",
    correctAnswer: "\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)",
    options: [
        "\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)",
        // ... 3 more options
    ]
}
```

## 🤝 Contributing

Feel free to:
- Add more formulas
- Improve the UI/UX
- Fix bugs
- Add new features (e.g., spaced repetition, study streaks)

## 📄 License

MIT License - Feel free to use for your own studies!

## 🎓 For Students

Perfect for:
- Exam preparation
- Quick formula lookup during homework
- Spaced repetition learning
- Group study sessions

Good luck with your Calculus 2 exams! 🚀

---

**Built with ❤️ for Hedva's Calculus 2 Class**

*Deployed on Netlify • Powered by React & KaTeX*
