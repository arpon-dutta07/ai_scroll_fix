(function() {
  if (window.__asfLoaded) { return; }
  window.__asfLoaded = true;

  var btn = null;
  var panel = null;
  var isOverBtn = false;
  var isOverPanel = false;
  var allMessages = [];

  function getTheme() {
    var bg = getComputedStyle(document.body).backgroundColor;
    var m = bg.match(/\d+/g);
    if (!m) return 'dark';
    var lum = parseInt(m[0]) * 0.299 + parseInt(m[1]) * 0.587 + parseInt(m[2]) * 0.114;
    return lum < 128 ? 'dark' : 'light';
  }

  function getColors() {
    if (getTheme() === 'dark') {
      return { bg: 'linear-gradient(135deg,#e11d48,#be123c)', shadow: '0 0 20px rgba(225,29,72,0.7)' };
    }
    return { bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)', shadow: '0 0 20px rgba(37,99,235,0.7)' };
  }

  function findScrollContainer() {
    var containers = Array.from(document.querySelectorAll('div, main, section'));
    for (var i = 0; i < containers.length; i++) {
      var c = containers[i];
      var oy = getComputedStyle(c).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && c.scrollHeight > c.clientHeight && c.clientHeight > 300) {
        return c;
      }
    }
    return null;
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
    
    // 1. Try the stored element reference first, check if it's still attached to the document
    if (m.el && document.body.contains(m.el)) {
      return m.el;
    }
    
    // 2. If it's detached, scan the page again to find all current user messages
    scanMessages();
    
    // 3. Find the element at the same index
    if (allMessages[m.index] && allMessages[m.index].el && document.body.contains(allMessages[m.index].el)) {
      return allMessages[m.index].el;
    }
    
    // 4. If index mismatch, try to find by text matching
    var bestMatch = null;
    var els = Array.from(document.querySelectorAll('div, p, span'));
    
    var candidates = els.filter(function(el) {
      var txt = (el.innerText || '').trim();
      return txt.length >= 1 && (el.className || '').toString().toLowerCase().indexOf('button') === -1;
    });
    
    candidates.forEach(function(el) {
      var txt = (el.innerText || '').trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').slice(0, 50);
      if (txt === m.text) {
        bestMatch = el;
      }
    });
    
    return bestMatch || m.el;
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

    // Fallback heuristic scan if nothing found or on DeepSeek
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

    allMessages = found.slice(0, 100).map(function(el, i) {
      var text = '';
      try {
        text = (el.innerText || '').trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').slice(0, 50);
      } catch(e) { text = 'Message ' + (i + 1); }
      return { el: el, text: text, index: i };
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
        el.style.transition = 'all 0.4s ease';
        el.style.outline = '3px solid #e11d48';
        el.style.boxShadow = '0 0 15px rgba(225,29,72,0.6)';
        el.style.backgroundColor = 'rgba(225,29,72,0.1)';
        
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

  function createBtn() {
    var c = getColors();
    btn = document.createElement('div');
    btn.id = 'asf-btn';
    btn.style.cssText = 'position:fixed;bottom:90px;right:24px;width:56px;height:56px;border-radius:16px;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;border:none;transition:all 0.3s ease;';
    btn.style.background = c.bg;
    btn.style.boxShadow = c.shadow;
    btn.innerHTML = '<span id="asf-num" style="font-size:22px;font-weight:800;color:white;line-height:1">0</span><span style="font-size:9px;color:white;opacity:0.75;margin-top:2px">chats</span>';
    document.body.appendChild(btn);
  }

  function createPanel() {
    panel = document.createElement('div');
    panel.id = 'asf-panel';
    panel.style.cssText = 'position:fixed;right:88px;bottom:70px;width:280px;max-height:55vh;overflow-y:auto;background:#1a1a2e;border-radius:14px;padding:10px;z-index:2147483646;box-shadow:0 8px 32px rgba(0,0,0,0.6);transform:translateX(320px);opacity:0;pointer-events:none;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s ease;';
    document.body.appendChild(panel);
  }

  function hidePanel() {
    if (!panel) return;
    if (isOverBtn || isOverPanel) return;
    panel.style.transform = 'translateX(320px)';
    panel.style.opacity = '0';
    panel.style.pointerEvents = 'none';
  }

  function showPanel() {
    if (!panel) return;
    scanMessages();
    panel.innerHTML = '';

    if (allMessages.length === 0) {
      var empty = document.createElement('div');
      empty.style.cssText = 'padding:12px;color:rgba(255,255,255,0.5);font-size:12px;text-align:center;line-height:1.6;';
      empty.innerText = 'No messages found.\nTry scrolling the chat first.';
      panel.appendChild(empty);
    } else {
      allMessages.forEach(function(m, i) {
        var d = document.createElement('div');
        d.style.cssText = 'padding:8px 10px;color:white;font-size:12px;border-radius:8px;cursor:pointer;margin-bottom:4px;background:rgba(255,255,255,0.05);line-height:1.4;word-break:break-word;transition:background 0.2s ease;';
        d.innerText = '#' + (i + 1) + ' \u2014 ' + m.text;
        d.addEventListener('mouseover', function() { d.style.background = 'rgba(255,255,255,0.15)'; });
        d.addEventListener('mouseout', function() { d.style.background = 'rgba(255,255,255,0.05)'; });
        
        (function(item) {
          d.addEventListener('click', function() {
            isOverBtn = false;
            isOverPanel = false;
            hidePanel();
            setTimeout(function() {
              var targetEl = resolveElement(item);
              scrollToElement(targetEl);
            }, 350);
          });
          
          d.addEventListener('mouseenter', function() {
            var targetEl = resolveElement(item);
            if (targetEl) {
              targetEl.setAttribute('data-asf-highlight', 'true');
              targetEl.style.outline = '2px dashed #e11d48';
              targetEl.style.outlineOffset = '2px';
            }
          });
          
          d.addEventListener('mouseleave', function() {
            var targetEl = resolveElement(item);
            if (targetEl) {
              targetEl.removeAttribute('data-asf-highlight');
              targetEl.style.outline = '';
              targetEl.style.outlineOffset = '';
            }
          });
        })(m);
        
        panel.appendChild(d);
      });
    }

    panel.style.transform = 'translateX(0)';
    panel.style.opacity = '1';
    panel.style.pointerEvents = 'auto';
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

  setTimeout(function() {
    createBtn();
    createPanel();
    scanMessages();
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
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        allMessages = [];
        updateCount();
        clearTimeout(window.__asfScanTimer);
        scanMessages();
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