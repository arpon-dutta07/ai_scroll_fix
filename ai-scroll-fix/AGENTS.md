# Repository Guidelines

## Project Overview
**AI Chat Navigator** is a Chrome/Web Extension that adds a floating navigator to AI chat platforms (ChatGPT, Claude, Gemini, Perplexity, etc.) for quick navigation between conversation turns.

## Project Structure & Module Organization
The project is a standard Web Extension (Manifest V3) with a flat structure:
- **`.\manifest.json`**: Extension configuration, permissions, and script declarations.
- **`.\content.js`**: Core logic injected into AI chat pages. Handles platform detection, DOM observation for new messages, and injection of the navigation UI.
- **`.\popup.html` & `.\popup.js`**: UI and logic for the extension's browser action popup, primarily displaying usage statistics.

## Build, Test, and Development Commands
This project does not use a build system or package manager.
- **Development**: Load the repository folder as an "unpacked extension" in Chrome/Edge via `chrome://extensions/`.
- **Reloading**: After making changes to `.\content.js` or `.\manifest.json`, the extension must be manually reloaded in the extensions management page, and target AI chat tabs must be refreshed.

## Coding Style & Naming Conventions
- **Vanilla JavaScript**: Uses standard ES6+ features without external libraries or frameworks.
- **Encapsulation**: Content scripts use IIFEs (`(function() { ... })();`) to avoid namespace collisions with host pages.
- **UI Injection**: Styles for the floating navigator are injected dynamically via `<style>` tags in `.\content.js`.
- **Storage**: Uses `chrome.storage.sync` for cross-device persistence of tracked metrics.

## Testing Guidelines
No automated test suite is currently implemented. Testing should be performed manually by loading the extension and verifying functionality across all supported platforms listed in `.\manifest.json`.
