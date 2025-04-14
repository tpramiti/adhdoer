# ADHDoer 🧠

ADHDoer is a minimal, no-fluff Obsidian plugin that integrates OpenAI's API into your daily notes.  
Designed to help users — especially those with ADHD — get clear, concise answers without switching tabs or copy-pasting.

---

## ✨ Features

- ✅ Send selected text to OpenAI directly from your note
- 🧠 Built-in "Assistant" designed to help you stay focused
- 🎛️ Adjustable response creativity (temperature setting)
- 💡 No distractions, just a tiny AI helping hand

---

## 🚀 How to Use

1. Install the plugin in Obsidian
2. Go to **Settings → ADHDoer**
3. Paste your OpenAI API key
4. Adjust the **Response Creativity (temperature)** slider
5. Select some text in your note → Run `Ask Assistant (ADHDoer)` from the command palette
6. ✨ Get a helpful response inserted below the selection!

---

## 💻 Installation (Manual)

Copy these two files into your vault's plugin folder:
.vault/.obsidian/plugins/adhdoer/ ├── main.js ├── manifest.json 


Or clone this repo directly inside that folder.

---

## 🧪 Development Setup

```bash
npm install
npm run dev


To create a production build:

npm run build -- production

