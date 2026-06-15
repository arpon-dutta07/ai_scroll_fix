# 🔧 AI Scroll Fix — All Platforms

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-v1.2.0-red?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-rose?style=for-the-badge)](LICENSE)
[![Built with React](https://img.shields.io/badge/Built_with-React_19-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite Build](https://img.shields.io/badge/Vite-Built-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

A lightweight, high-performance browser extension (Manifest V3) that stops disorienting scroll jumps on popular AI chat interfaces (ChatGPT, Claude, Gemini, DeepSeek, and more). It dynamically locks the browser viewport scroll-anchor during real-time streaming answers and injects an interactive, beautiful floating navigation hub to jump between chat turns seamlessly.

The repository also includes a stunning, interactive landing page simulator built with React 19, Framer Motion, and custom Bento UI controls.

---

## 🌟 The Problem & The Solution

When LLM interfaces stream responses, they render paragraphs, code snippets, and lists dynamically. These layout shifts constantly change the document height, causing the browser to either fight your manual scrolling or force-scroll you to the bottom. 

**AI Scroll Fix** injects a highly optimized MutationObserver scroll-controller into the chat windows:
1. **Dynamic Viewport Lock:** Anchors scroll positions when you want to read, preventing automatic jumps during streaming.
2. **Floating Chat Navigator:** Injects a modern floating index panel displaying all chat turns. Click any marker to scroll instantly to that prompt, with a clean visual glow highlight.
3. **Zero Runtime Overhead:** Written in pure, optimized vanilla JS with zero external dependencies to keep memory footprint close to absolute zero.

---

## 🚀 Key Features

*   **Universal Compatibility:** Automatically adapts class selectors for major LLMs including ChatGPT, Claude, Gemini, DeepSeek, Perplexity, Copilot, and You.com.
*   **Sticky Floating Navigator:** A non-obtrusive hub displaying the count of chat turns. Hover or click to reveal an interactive prompt checklist.
*   **Privacy First:** Operates strictly on client-side layout structures. It **never** reads, saves, or uploads your prompts or data.
*   **Developer Sandbox Page:** A premium, fully responsive showcase website featuring glassmorphic components, 3D tilt effects, and real-time interactive mock chat simulators.

---

## 📂 Project Structure

```bash
ai-scroll-fix/
├── ai-scroll-fix/             # 🔧 Extension Codebase (Manifest V3)
│   ├── AGENTS.md              # Guidelines for Agent collaboration
│   ├── manifest.json          # Extension permissions and background rules
│   ├── content.js             # Core script injected into AI chat tabs
│   ├── popup.html             # Extension popup UI structure
│   ├── popup.js               # Statistics and settings storage logic
│   └── icon*.png              # Extension branding icons
└── webpage/                   # 🌐 Interactive Landing Page (React + Vite)
    ├── src/
    │   ├── App.jsx            # Main React codebase & mock simulator logic
    │   ├── App.css            # Stylesheets, bento grids, and layout rules
    │   └── index.css          # Global typography & root rules
    ├── index.html
    └── package.json
```

---

## 🛠️ Extension Installation & Setup

To load this extension locally in developer mode:

1.  Open your browser and navigate to the Extensions management page:
    *   **Chrome / Brave:** `chrome://extensions/`
    *   **Edge:** `edge://extensions/`
2.  Enable **Developer Mode** using the toggle switch in the top right corner.
3.  Click the **Load unpacked** button in the top left.
4.  Select the `ai-scroll-fix/ai-scroll-fix` subdirectory of this repository.
5.  Open any supported AI chat site (e.g. [Claude AI](https://claude.ai) or [ChatGPT](https://chatgpt.com)) and prompt! The navigator will appear at the bottom right.

---

## 🌐 Landing Page Local Development

The landing page features a live mockup browser containing an interactive clone of the Scroll Fix extension navigator.

### Commands

Inside the `webpage` folder:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Compile optimized production build
npm run build

# Preview build locally
npm run preview
```

---

## 🛡️ Under the Hood: How it Works

The extension injects `content.js` at `document_idle`. It performs the following steps:
1.  **Platform Detection:** Parses window URLs to load configuration rules (matching wrapper elements and chat list containers).
2.  **Observer Attachment:** Listens to child mutations on the chat element to track new responses.
3.  **UI Injection:** Adds the floating counter button (`#asf-btn`) as a direct child of the host body.
4.  **Target Scroll Anchoring:** When a navigation index is clicked, the script uses smooth programmatic scrolling:
    ```javascript
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ```
    And adds an `.asf-highlighted` glow effect to focus your attention.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to fork, modify, and distribute!
