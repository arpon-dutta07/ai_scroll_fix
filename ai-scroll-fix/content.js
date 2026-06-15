(function() {
  if (window.__asfLoaded) { return; }
  window.__asfLoaded = true;

  var btn = null;
  var panel = null;
  var isOverBtn = false;
  var isOverPanel = false;
  var masterMessages = [];
  var allMessages = [];
  var currentScrollTarget = null;
  var scrollTimer = null;

  function getTheme() {
    var bg = getComputedStyle(document.body).backgroundColor;
    var m = bg.match(/\d+/g);
    if (!m) return 'dark';
    var lum = parseInt(m[0]) * 0.299 + parseInt(m[1]) * 0.587 + parseInt(m[2]) * 0.114;
    return lum < 128 ? 'dark' : 'light';
  }

  function updateThemeClass() {
    if (!panel || !btn) return;
    var theme = getTheme();
    if (theme === 'dark') {
      panel.className = 'asf-dark';
      btn.className = 'asf-dark';
    } else {
      panel.className = 'asf-light';
      btn.className = 'asf-light';
    }
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'asf-styles';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

      /* Hide native ChatGPT timeline ticks, scroll markers, or conflicting scroll extensions */
      .chatgpt-timeline-ticks, 
      .scroll-marker, 
      [class*="TimelineTick"], 
      [class*="timeline-tick"],
      [class*="scroll-marker"],
      [class*="TimelineRail"],
      [class*="scroll-nav"] {
        display: none !important;
      }
      
      /* Make scrollbar look premium and modern */
      ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }
      ::-webkit-scrollbar-track {
        background: transparent !important;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15) !important;
        border-radius: 4px !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3) !important;
      }

      /* Premium UI Theme CSS Variables */
      #asf-panel, #asf-btn, #asf-panel * {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        box-sizing: border-box;
      }

      #asf-panel.asf-dark, #asf-btn.asf-dark {
        --asf-panel-bg: rgba(15, 15, 25, 0.72);
        --asf-item-bg: rgba(255, 255, 255, 0.04);
        --asf-item-border: rgba(255, 255, 255, 0.05);
        --asf-item-hover-bg: rgba(255, 255, 255, 0.08);
        --asf-item-hover-border: rgba(255, 255, 255, 0.15);
        --asf-text-color: rgba(255, 255, 255, 0.85);
        --asf-text-hover-color: #ffffff;
        --asf-border: rgba(255, 255, 255, 0.08);
        --asf-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
        
        /* Red gradient themes */
        --asf-accent-gradient: linear-gradient(-45deg, #ff3366, #e11d48, #be123c, #f43f5e);
        --asf-accent-shadow: rgba(225, 29, 72, 0.4);
        --asf-badge-bg: linear-gradient(135deg, #ff3366, #be123c);
      }

      #asf-panel.asf-light, #asf-btn.asf-light {
        --asf-panel-bg: rgba(255, 255, 255, 0.82);
        --asf-item-bg: rgba(0, 0, 0, 0.03);
        --asf-item-border: rgba(0, 0, 0, 0.05);
        --asf-item-hover-bg: rgba(0, 0, 0, 0.06);
        --asf-item-hover-border: rgba(0, 0, 0, 0.12);
        --asf-text-color: rgba(0, 0, 0, 0.75);
        --asf-text-hover-color: #000000;
        --asf-border: rgba(0, 0, 0, 0.08);
        --asf-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
        
        /* Blue gradient themes */
        --asf-accent-gradient: linear-gradient(-45deg, #2563eb, #1d4ed8, #3b82f6, #1e40af);
        --asf-accent-shadow: rgba(37, 99, 235, 0.3);
        --asf-badge-bg: linear-gradient(135deg, #2563eb, #1d4ed8);
      }

      /* Moving gradient background for the floating button */
      @keyframes asf-gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      #asf-btn {
        position: fixed;
        bottom: 90px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 18px;
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: var(--asf-accent-gradient);
        background-size: 300% 300%;
        animation: asf-gradient-shift 8s ease infinite;
        box-shadow: 0 8px 25px var(--asf-accent-shadow);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
      }

      #asf-btn:hover {
        transform: scale(1.08) translateY(-3px);
        box-shadow: 0 12px 30px var(--asf-accent-shadow);
      }

      #asf-btn:active {
        transform: scale(0.95);
      }

      #asf-num {
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
        line-height: 1;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      #asf-label {
        font-size: 9px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-top: 2px;
      }

      /* Glassmorphism Navigation Panel */
      #asf-panel {
        position: fixed;
        right: 96px;
        bottom: 75px;
        width: 310px;
        max-height: 60vh;
        overflow-y: hidden;
        background: var(--asf-panel-bg);
        backdrop-filter: blur(20px) saturate(160%);
        -webkit-backdrop-filter: blur(20px) saturate(160%);
        border: 1px solid var(--asf-border);
        border-radius: 20px;
        padding: 14px;
        z-index: 2147483646;
        box-shadow: var(--asf-shadow), inset 0 1px 0 rgba(255,255,255,0.05);
        transform: scale(0.9) translateY(20px);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      #asf-panel.show {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: auto;
      }

      /* Fixed Header */
      .asf-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 6px 12px 6px;
        border-bottom: 1px solid var(--asf-item-border);
        margin-bottom: 10px;
        flex-shrink: 0;
      }

      .asf-header-title {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.2px;
        color: var(--asf-text-color);
      }

      .asf-header-badge {
        font-size: 11px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 20px;
        background: var(--asf-badge-bg);
        color: white;
        box-shadow: 0 2px 8px var(--asf-accent-shadow);
      }

      /* Scrollable List */
      .asf-list {
        flex: 1;
        overflow-y: auto;
        padding-right: 2px;
      }

      /* Custom scrollbar inside the list */
      .asf-list::-webkit-scrollbar {
        width: 6px !important;
      }
      .asf-list::-webkit-scrollbar-track {
        background: transparent !important;
      }
      .asf-list::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12) !important;
        border-radius: 10px !important;
      }
      .asf-list::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25) !important;
      }

      /* List Items Staggered slide in animation */
      @keyframes asf-slide-in {
        0% { opacity: 0; transform: translateY(12px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      .asf-item {
        position: relative;
        padding: 10px 14px;
        color: var(--asf-text-color);
        font-size: 13px;
        font-weight: 500;
        border-radius: 12px;
        cursor: pointer;
        margin-bottom: 6px;
        background: var(--asf-item-bg);
        border: 1px solid var(--asf-item-border);
        line-height: 1.5;
        word-break: break-word;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        animation: asf-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .asf-item:hover {
        color: var(--asf-text-hover-color);
        background: var(--asf-item-hover-bg);
        border-color: var(--asf-item-hover-border);
        transform: translateX(-4px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      }

      .asf-item:active {
        transform: scale(0.97) translateX(-4px);
      }

      .asf-item-index {
        background: var(--asf-badge-bg);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        margin-right: 4px;
      }

      .asf-empty {
        padding: 24px;
        color: rgba(255, 255, 255, 0.4);
        font-size: 13px;
        text-align: center;
        line-height: 1.6;
      }

      .asf-empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeText(str) {
    if (!str) return '';
    return str.toString()
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
      .replace(/[^a-z0-9\u0980-\u09fe]/g, '') // keep only alphanumeric and Bengali characters
      .slice(0, 50);
  }

  function truncateText(str, limit) {
    if (!str) return '';
    if (str.length <= limit) return str;
    var truncated = str.slice(0, limit);
    var lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > limit * 0.7) {
      truncated = truncated.slice(0, lastSpace);
    }
    return truncated.trim() + '...';
  }

  function isElementValid(el, expectedText) {
    if (!el || !document.body.contains(el)) return false;
    try {
      var txt = el.innerText || '';
      return normalizeText(txt) === normalizeText(expectedText);
    } catch(e) {
      return false;
    }
  }

  function findScrollContainer() {
    // 1. Try ChatGPT's react-scroll-to-bottom
    var c = document.querySelector('[class*="react-scroll-to-bottom--"] [class*="react-scroll-to-bottom--"]');
    if (c) return c;
    c = document.querySelector('[class*="react-scroll-to-bottom--"]');
    if (c) return c;

    // 2. Find all scrollable containers, excluding the sidebar
    var containers = Array.from(document.querySelectorAll('div, main, section'));
    var bestSc = null;
    var maxArea = -1;

    for (var i = 0; i < containers.length; i++) {
      var sc = containers[i];
      
      // Skip if inside navigation or sidebar elements
      var parent = sc;
      var isSidebar = false;
      while (parent) {
        if (parent.tagName.toLowerCase() === 'nav') {
          isSidebar = true;
          break;
        }
        var cls = (parent.className || '').toString().toLowerCase();
        var id = (parent.id || '').toString().toLowerCase();
        if (cls.indexOf('sidebar') !== -1 || cls.indexOf('navigation') !== -1 || cls.indexOf('nav-') !== -1 || id.indexOf('sidebar') !== -1) {
          isSidebar = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (isSidebar) continue;

      var oy = getComputedStyle(sc).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && sc.scrollHeight > sc.clientHeight && sc.clientHeight > 300) {
        var area = sc.clientWidth * sc.clientHeight;
        if (area > maxArea) {
          maxArea = area;
          bestSc = sc;
        }
      }
    }
    return bestSc;
  }

  function heuristicScan() {
    var sc = findScrollContainer();
    if (!sc) return [];

    var divs = Array.from(sc.querySelectorAll('div, p, span, [class*="message"], [class*="bubble"]'));
    var scRect = sc.getBoundingClientRect();
    var midpoint = scRect.left + scRect.width / 2;

    var candidates = divs.filter(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      // Must be in the right half of the scroll container
      var isRight = (rect.left + rect.width / 2) > midpoint;
      if (!isRight) return false;

      // Must contain text
      var txt = (el.innerText || '').trim();
      if (txt.length < 1) return false;

      // Must not be inside or contain assistant markdown
      if (el.querySelector('.ds-markdown, [class*="markdown"], [class*="assistant"]')) return false;
      var parent = el.parentElement;
      while (parent && parent !== sc) {
        if (parent.className && (parent.className.includes('markdown') || parent.className.includes('assistant') || parent.className.includes('bot'))) {
          return false;
        }
        parent = parent.parentElement;
      }

      // Must not be a common interactive element like button or input
      var tag = el.tagName.toLowerCase();
      if (tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'a' || tag === 'svg' || tag === 'path') return false;
      var role = el.getAttribute('role');
      if (role === 'button' || role === 'menu' || role === 'tab') return false;
      var cls = el.className ? el.className.toString().toLowerCase() : '';
      if (cls.includes('button') || cls.includes('btn') || cls.includes('action') || cls.includes('copy') || cls.includes('share') || cls.includes('thumb') || cls.includes('like') || cls.includes('icon') || cls.includes('tooltip')) return false;

      return true;
    });

    // Only keep the leaf-most candidate elements
    var leaves = candidates.filter(function(a) {
      return !candidates.some(function(b) {
        return b !== a && a.contains(b);
      });
    });

    // Filter out duplicates
    var unique = [];
    leaves.forEach(function(el) {
      var txt = (el.innerText || '').trim().replace(/\s+/g, ' ');
      var rect = el.getBoundingClientRect();
      var isDup = unique.some(function(item) {
        var itemTxt = (item.innerText || '').trim().replace(/\s+/g, ' ');
        var itemRect = item.getBoundingClientRect();
        return Math.abs(itemRect.top - rect.top) < 5 && Math.abs(itemRect.left - rect.left) < 5 && itemTxt === txt;
      });
      if (!isDup) {
        unique.push(el);
      }
    });

    return unique;
  }

  function resolveElement(m) {
    if (!m) return null;
    
    // 1. Try the stored element reference first, check if it's still attached to the document and matches
    if (isElementValid(m.el, m.text)) {
      return m.el;
    }
    
    // 2. Scan the page to update refs
    scanMessages();
    
    // 3. Find the element at the same index
    if (allMessages[m.index] && isElementValid(allMessages[m.index].el, allMessages[m.index].text)) {
      return allMessages[m.index].el;
    }
    
    // 4. Try text matching inside the scroll container only
    var sc = findScrollContainer();
    if (!sc) return m.el;

    var bestMatch = null;
    var els = Array.from(sc.querySelectorAll('div, p, span'));
    var candidates = els.filter(function(el) {
      var txt = (el.innerText || '').trim();
      return txt.length >= 1 && (el.className || '').toString().toLowerCase().indexOf('button') === -1;
    });
    
    candidates.forEach(function(el) {
      var txt = el.innerText || '';
      if (normalizeText(txt) === normalizeText(m.text)) {
        bestMatch = el;
      }
    });
    
    return bestMatch || m.el;
  }

  function fetchClaudeMessages() {
    var match = window.location.pathname.match(/\/chat\/([a-f0-9\-]+)/);
    if (!match) {
      scanMessages();
      return;
    }
    var chatUuid = match[1];

    fetch('/api/organizations')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to fetch orgs');
        return res.json();
      })
      .then(function(orgs) {
        if (!orgs || orgs.length === 0) throw new Error('No orgs found');
        var orgUuid = orgs[0].uuid;
        return fetch('/api/organizations/' + orgUuid + '/chat_conversations/' + chatUuid);
      })
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to fetch conversation');
        return res.json();
      })
      .then(function(data) {
        if (!data || !data.chat_messages) {
          scanMessages();
          return;
        }

        var apiUserMessages = data.chat_messages.filter(function(msg) {
          return msg.sender === 'human';
        });

        var apiMessages = apiUserMessages.map(function(msg) {
          return {
            id: msg.uuid || '',
            text: msg.text || '',
            el: null
          };
        });

        if (masterMessages.length === 0) {
          masterMessages = apiMessages;
        } else {
          apiMessages.forEach(function(apiMsg) {
            var match = masterMessages.find(function(m) {
              return (m.id && apiMsg.id && m.id === apiMsg.id) || normalizeText(m.text) === normalizeText(apiMsg.text);
            });
            if (match && isElementValid(match.el, match.text)) {
              apiMsg.el = match.el;
            }
          });
          masterMessages = apiMessages;
        }

        allMessages = masterMessages.slice(0, 150).map(function(m, i) {
          return { id: m.id, text: m.text, el: m.el, index: i };
        });

        updateCount();
      })
      .catch(function(err) {
        console.warn('[AI Scroll Fix] Claude API fetch error (falling back to DOM scan):', err);
        scanMessages();
      });
  }

  function fetchChatGPTMessages() {
    var match = window.location.pathname.match(/\/c\/([a-f0-9\-]+)/);
    if (!match) {
      scanMessages();
      return;
    }
    var chatUuid = match[1];

    fetch('/backend-api/conversation/' + chatUuid)
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to fetch ChatGPT conversation');
        return res.json();
      })
      .then(function(data) {
        if (!data || !data.mapping || !data.current_node) {
          scanMessages();
          return;
        }

        // Trace back from leaf node to root
        var path = [];
        var curr = data.current_node;
        while (curr && data.mapping[curr]) {
          var node = data.mapping[curr];
          path.push(node);
          curr = node.parent;
        }
        path.reverse();

        var apiUserMessages = [];
        path.forEach(function(node) {
          if (node.message && node.message.author && node.message.author.role === 'user') {
            var parts = (node.message.content && node.message.content.parts) || [];
            var text = parts.join(' ').trim();
            if (text.length >= 1) {
              apiUserMessages.push({
                id: node.message.id || '',
                text: text,
                el: null
              });
            }
          }
        });

        if (masterMessages.length === 0) {
          masterMessages = apiUserMessages;
        } else {
          apiUserMessages.forEach(function(apiMsg) {
            var match = masterMessages.find(function(m) {
              return (m.id && apiMsg.id && m.id === apiMsg.id) || normalizeText(m.text) === normalizeText(apiMsg.text);
            });
            if (match && isElementValid(match.el, match.text)) {
              apiMsg.el = match.el;
            }
          });
          masterMessages = apiUserMessages;
        }

        allMessages = masterMessages.slice(0, 150).map(function(m, i) {
          return { id: m.id, text: m.text, el: m.el, index: i };
        });

        updateCount();
      })
      .catch(function(err) {
        console.warn('[AI Scroll Fix] ChatGPT API fetch error (falling back to DOM scan):', err);
        scanMessages();
      });
  }

  function scanMessages() {
    var hostname = window.location.hostname;
    var found = [];
    var selectorGroups = [];

    if (hostname.includes('claude.ai')) {
      selectorGroups = [
        '[data-testid="user-message"]',
        '[data-testid="human-turn"]',
        '[class*="human-turn"]',
        '[class*="HumanTurn"]',
        '[class*="humanTurn"]',
        '[class*="human_turn"]',
        '[class*="userMessage"]',
        '[class*="user-message"]',
        '[class*="UserMessage"]'
      ];
    } else if (hostname.includes('chatgpt.com')) {
      selectorGroups = [
        '[data-message-author-role="user"]'
      ];
    } else if (hostname.includes('gemini.google.com')) {
      selectorGroups = [
        'user-query',
        '.query-text',
        '[class*="user-query"]'
      ];
    } else if (hostname.includes('perplexity.ai')) {
      selectorGroups = [
        '[data-testid="user-message-bubble"]',
        '[class*="UserMessage"]',
        '[class*="userMessage"]'
      ];
    } else {
      selectorGroups = [
        '[data-testid="user-message"]',
        '[data-message-author-role="user"]'
      ];
    }

    for (var i = 0; i < selectorGroups.length; i++) {
      try {
        var els = Array.from(document.querySelectorAll(selectorGroups[i]));
        els = els.filter(function(el) {
          return (el.innerText || '').trim().length >= 1;
        });
        if (els.length > found.length) {
          found = els;
        }
      } catch(e) {}
    }

    // Fallback heuristic scan if nothing found or on DeepSeek/Claude virtualization
    if (found.length === 0 || hostname.includes('deepseek.com')) {
      try {
        var hEls = heuristicScan();
        if (hEls && hEls.length > found.length) {
          found = hEls;
        }
      } catch(e) {}
    }

    // Sort the found elements by their document order
    try {
      found.sort(function(a, b) {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
    } catch(e) {}

    // Map currently visible DOM elements to temporary message objects
    var V = found.map(function(el) {
      var id = el.getAttribute('data-message-id') || '';
      return { id: id, text: el.innerText || '', el: el };
    });

    // Clean up stale or reused element references immediately
    masterMessages.forEach(function(m) {
      if (m.el && !isElementValid(m.el, m.text)) {
        m.el = null;
      }
    });

    if (masterMessages.length === 0) {
      masterMessages = V;
    } else if (V.length > 0) {
      // Find alignment offset o between V and masterMessages
      var bestOffset = null;
      var bestScore = 0;
      var matchCount = 0;

      // 1. Try aligning with stable data-message-id
      var idMatchOffset = null;
      for (var i = 0; i < V.length; i++) {
        if (V[i].id) {
          for (var j = 0; j < masterMessages.length; j++) {
            if (masterMessages[j].id === V[i].id) {
              idMatchOffset = j - i;
              break;
            }
          }
        }
        if (idMatchOffset !== null) break;
      }

      if (idMatchOffset !== null) {
        bestOffset = idMatchOffset;
        bestScore = 1;
        matchCount = 1;
      } else {
        // 2. Fallback to sequence text matching using normalized text
        for (var o = -V.length; o <= masterMessages.length; o++) {
          var score = 0;
          for (var i = 0; i < V.length; i++) {
            var j = i + o;
            if (j >= 0 && j < masterMessages.length) {
              if (normalizeText(V[i].text) === normalizeText(masterMessages[j].text)) {
                score++;
              }
            }
          }
          if (score > bestScore) {
            bestScore = score;
            bestOffset = o;
            matchCount = 1;
          } else if (score === bestScore && score > 0) {
            matchCount++;
          }
        }
      }

      // If bestScore is 0, indicates thread switch or clear
      if (bestScore === 0) {
        masterMessages = V;
      } else if (bestOffset !== null && matchCount === 1) {
        // Merge elements only if alignment is unique and confident
        var prepends = [];
        var appends = [];

        for (var i = 0; i < V.length; i++) {
          var j = i + bestOffset;
          if (j < 0) {
            prepends.push({ id: V[i].id, text: V[i].text, el: V[i].el });
          } else if (j >= masterMessages.length) {
            appends.push({ id: V[i].id, text: V[i].text, el: V[i].el });
          } else {
            // Overlap: update DOM ref and text
            masterMessages[j].el = V[i].el;
            masterMessages[j].text = V[i].text;
            if (V[i].id && !masterMessages[j].id) {
              masterMessages[j].id = V[i].id;
            }
          }
        }

        if (prepends.length > 0) {
          masterMessages = prepends.concat(masterMessages);
        }
        if (appends.length > 0) {
          masterMessages = masterMessages.concat(appends);
        }
      }
    }

    allMessages = masterMessages.slice(0, 150).map(function(m, i) {
      return { id: m.id, text: m.text, el: m.el, index: i };
    });

    updateCount();
  }

  function updateCount() {
    try {
      var n = document.getElementById('asf-num');
      if (n) n.innerText = allMessages.length;
    } catch(e) {}
  }

  function scrollToElement(el) {
    if (!el) return;
    try {
      var oldTransition = el.style.transition;
      var oldOutline = el.style.outline;
      var oldBg = el.style.backgroundColor;
      var oldBoxShadow = el.style.boxShadow;
      
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      setTimeout(function() {
        var theme = getTheme();
        var outlineColor = theme === 'dark' ? '#ff3366' : '#2563eb';
        var shadowColor = theme === 'dark' ? 'rgba(255, 51, 102, 0.6)' : 'rgba(37, 99, 235, 0.5)';
        var bgColor = theme === 'dark' ? 'rgba(255, 51, 102, 0.15)' : 'rgba(37, 99, 235, 0.1)';

        el.style.transition = 'all 0.4s ease';
        el.style.outline = '3px solid ' + outlineColor;
        el.style.boxShadow = '0 0 15px ' + shadowColor;
        el.style.backgroundColor = bgColor;
        
        setTimeout(function() {
          el.style.outline = oldOutline;
          el.style.boxShadow = oldBoxShadow;
          el.style.backgroundColor = oldBg;
          setTimeout(function() {
            el.style.transition = oldTransition;
          }, 400);
        }, 1500);
      }, 300);
    } catch(e) {
      try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e2) {}
    }
  }

  function scrollToVirtualMessage(m, attempt) {
    if (!attempt) {
      attempt = 0;
      currentScrollTarget = m;
    }
    if (currentScrollTarget !== m) return;
    if (attempt > 40) {
      currentScrollTarget = null;
      return; // Cap after 4 seconds
    }
    
    var el = resolveElement(m);
    if (el && isElementValid(el, m.text)) {
      scrollToElement(el);
      currentScrollTarget = null;
      return;
    }
    
    var sc = findScrollContainer();
    if (sc) {
      var firstVisibleIdx = -1;
      var lastVisibleIdx = -1;
      for (var i = 0; i < allMessages.length; i++) {
        if (isElementValid(allMessages[i].el, allMessages[i].text)) {
          if (firstVisibleIdx === -1) firstVisibleIdx = i;
          lastVisibleIdx = i;
        }
      }
      
      if (firstVisibleIdx !== -1) {
        if (m.index < firstVisibleIdx) {
          if (m.index === 0 || m.index < allMessages.length * 0.1) {
            sc.scrollTop = 0;
          } else {
            sc.scrollTop = Math.max(0, sc.scrollTop - Math.round(sc.clientHeight * 0.8));
          }
        } else if (m.index > lastVisibleIdx) {
          if (m.index === allMessages.length - 1 || m.index > allMessages.length * 0.9) {
            sc.scrollTop = sc.scrollHeight;
          } else {
            sc.scrollTop = Math.min(sc.scrollHeight, sc.scrollTop + Math.round(sc.clientHeight * 0.8));
          }
        }
      } else {
        if (m.index < allMessages.length / 2) {
          sc.scrollTop = Math.max(0, sc.scrollTop - Math.round(sc.clientHeight * 0.8));
        } else {
          sc.scrollTop = Math.min(sc.scrollHeight, sc.scrollTop + Math.round(sc.clientHeight * 0.8));
        }
      }
    }
    
    setTimeout(function() {
      scrollToVirtualMessage(m, attempt + 1);
    }, 100);
  }

  function createBtn() {
    btn = document.createElement('div');
    btn.id = 'asf-btn';
    btn.innerHTML = '<span id="asf-num">0</span><span id="asf-label">chats</span>';
    document.body.appendChild(btn);
  }

  function createPanel() {
    panel = document.createElement('div');
    panel.id = 'asf-panel';
    document.body.appendChild(panel);
  }

  function hidePanel() {
    if (!panel) return;
    if (isOverBtn || isOverPanel) return;
    panel.classList.remove('show');
  }

  function showPanel() {
    if (!panel) return;
    scanMessages();
    updateThemeClass();
    panel.innerHTML = '';

    if (allMessages.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'asf-empty';
      empty.innerHTML = '<span class="asf-empty-icon">💬</span>No messages found.<br>Try scrolling the chat first.';
      panel.appendChild(empty);
    } else {
      // Create fixed header
      var header = document.createElement('div');
      header.className = 'asf-header';
      header.innerHTML = '<span class="asf-header-title">Chat Navigation</span><span class="asf-header-badge">' + allMessages.length + '</span>';
      panel.appendChild(header);

      // Create scrollable list
      var listContainer = document.createElement('div');
      listContainer.className = 'asf-list';

      allMessages.forEach(function(m, i) {
        var d = document.createElement('div');
        d.className = 'asf-item';
        d.style.animationDelay = (i * 0.03) + 's';
        d.innerHTML = '<span class="asf-item-index">#' + (i + 1) + '</span> ' + truncateText(m.text, 65);
        d.title = m.text;
        
        (function(item) {
          d.addEventListener('click', function() {
            isOverBtn = false;
            isOverPanel = false;
            hidePanel();
            setTimeout(function() {
              scrollToVirtualMessage(item);
            }, 350);
          });
          
          d.addEventListener('mouseenter', function() {
            var targetEl = resolveElement(item);
            if (targetEl) {
              targetEl.style.outline = '2px dashed ' + (getTheme() === 'dark' ? '#ff3366' : '#2563eb');
              targetEl.style.outlineOffset = '2px';
            }
          });
          
          d.addEventListener('mouseleave', function() {
            var targetEl = resolveElement(item);
            if (targetEl) {
              targetEl.style.outline = '';
              targetEl.style.outlineOffset = '';
            }
          });
        })(m);
        
        listContainer.appendChild(d);
      });

      panel.appendChild(listContainer);
    }

    panel.classList.add('show');
  }

  function initPlatform() {
    masterMessages = [];
    allMessages = [];
    updateCount();
    clearTimeout(window.__asfScanTimer);
    
    var hostname = window.location.hostname;
    if (hostname.includes('claude.ai')) {
      fetchClaudeMessages();
    } else if (hostname.includes('chatgpt.com')) {
      fetchChatGPTMessages();
    } else {
      scanMessages();
    }
  }

  function startObserver() {
    var observer = new MutationObserver(function(mutations) {
      var relevant = mutations.some(function(mut) {
        var target = mut.target;
        while (target) {
          if (target.id === 'asf-btn' || target.id === 'asf-panel') {
            return false;
          }
          target = target.parentElement;
        }
        return true;
      });
      if (relevant) {
        clearTimeout(window.__asfScanTimer);
        window.__asfScanTimer = setTimeout(scanMessages, 800);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function startScrollListener() {
    var sc = findScrollContainer();
    if (sc) {
      sc.removeEventListener('scroll', handleScroll);
      sc.addEventListener('scroll', handleScroll);
    }
  }

  function handleScroll() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(scanMessages, 250);
  }

  setTimeout(function() {
    injectStyles();
    createBtn();
    createPanel();
    updateThemeClass();
    initPlatform();
    startObserver();

    btn.addEventListener('mouseenter', function() {
      isOverBtn = true;
      showPanel();
    });
    btn.addEventListener('mouseleave', function() {
      isOverBtn = false;
      setTimeout(hidePanel, 300);
    });
    panel.addEventListener('mouseenter', function() { isOverPanel = true; });
    panel.addEventListener('mouseleave', function() {
      isOverPanel = false;
      setTimeout(hidePanel, 300);
    });

    try {
      chrome.storage.sync.get(['aiChatCount', 'lastPlatform'], function(data) {
        chrome.storage.sync.set({
          aiChatCount: (data.aiChatCount || 0) + 1,
          lastPlatform: window.location.hostname
        });
      });
    } catch(e) {}

    // Setup URL polling to detect SPA transitions
    var lastUrl = window.location.href;
    setInterval(function() {
      startScrollListener();
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        initPlatform();

        setTimeout(scanMessages, 500);
        setTimeout(scanMessages, 1000);
        setTimeout(scanMessages, 2000);
        setTimeout(scanMessages, 4000);
      }
    }, 500);

  }, 2000);

  try {
    chrome.runtime.onMessage.addListener(function(msg) {
      if (!btn) return;
      if (msg.type === 'TOGGLE') {
        btn.style.display = msg.enabled ? 'flex' : 'none';
        if (!msg.enabled) {
          isOverBtn = false;
          isOverPanel = false;
          hidePanel();
        }
      }
    });
  } catch(e) {}

})();