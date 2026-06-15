import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FaChrome, FaCode, FaLock } from 'react-icons/fa'
import './App.css'

// Brand-specific outline SVG logos
const brandLogos = {
  chatgpt: (
    <svg className="platform-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
      <path d="M12 6v12M6 12h12M7.75 7.75l8.5 8.5M7.75 16.25l8.5-8.5" />
    </svg>
  ),
  claude: (
    <svg className="platform-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M8 11h8M12 8v6" />
    </svg>
  ),
  gemini: (
    <svg className="platform-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 12h18M12 3l3.5 5.5L21 12l-5.5 3.5L12 21l-3.5-5.5L3 12l5.5-3.5z" />
    </svg>
  ),
  deepseek: (
    <svg className="platform-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  perplexity: (
    <svg className="platform-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3M11 8a3 3 0 000 6" />
    </svg>
  ),
  huggingface: (
    <svg className="platform-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeWidth="3" />
    </svg>
  )
};

// Helper component for smooth number count up animation
const CounterValue = ({ target, suffix }) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }
    let start = 0
    const duration = 2000
    const incrementTime = Math.max(Math.floor(duration / target), 15)
    const timer = setInterval(() => {
      start += 1
      setValue(start)
      if (start >= target) {
        clearInterval(timer)
      }
    }, incrementTime)
    return () => clearInterval(timer)
  }, [target])
  return <>{value}{suffix}</>
}

// Helper component for 3D tilt Bento cards
const BentoCard = ({ className, children, index }) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)')
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, background: '' })

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const xc = rect.width / 2
    const yc = rect.height / 2
    const dx = x - xc
    const dy = y - yc
    
    // Tilt calculations (max 6 degrees)
    const tiltX = -(dy / yc) * 6
    const tiltY = (dx / xc) * 6
    
    setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`)
    setGlowStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(225, 29, 72, 0.12) 0%, transparent 60%)`
    })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)')
    setGlowStyle({ opacity: 0, background: '' })
  }

  return (
    <motion.div
      className={`bento-card-wrapper ${className || ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <div
        className="bento-card spring-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: transform }}
      >
        <div className="card-cursor-glow" style={glowStyle} />
        <div className="bento-card-content">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)
  const [isHeroMockupHovered, setIsHeroMockupHovered] = useState(false)

  // Bento Card lock switch state
  const [isLockActive, setIsLockActive] = useState(true)

  // Hero mockup simulation states (matching simulator behavior)
  const [heroShowNavPanel, setHeroShowNavPanel] = useState(false)
  const [heroHighlightedPromptIndex, setHeroHighlightedPromptIndex] = useState(null)
  const heroChatContainerRef = useRef(null)

  const handleHeroScrollToPrompt = (index) => {
    if (heroChatContainerRef.current) {
      const container = heroChatContainerRef.current;
      const targetEl = container.querySelector(`[data-hero-prompt-idx="${index}"]`);
      if (targetEl) {
        // Smoothly scroll the container to center the target element
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show glowing highlight
        setHeroHighlightedPromptIndex(index);
        
        // Clear highlight after 1.5 seconds
        setTimeout(() => {
          setHeroHighlightedPromptIndex(null);
        }, 1500);
      }
    }
  }

  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // Interactive Simulator States (100% accurate to actual extension)
  const [popupChatsCount, setPopupChatsCount] = useState(14)
  const [lastPlatform, setLastPlatform] = useState('claude.ai')
  const [showNavPanel, setShowNavPanel] = useState(false)
  const [highlightedPromptIndex, setHighlightedPromptIndex] = useState(null)

  const chatContainerRef = useRef(null)

  // Injected navigation list prompts
  const simPromptsList = [
    "Write a React hook to handle scroll anchoring, please!",
    "Is this compatible with Chrome extensions?",
    "Does it handle zero-width spaces in text matching?"
  ]

  // Reset extension storage counter simulator
  const handleResetCounter = () => {
    setPopupChatsCount(0)
    setLastPlatform('None')
  }

  // Smooth scroll and highlight simulation handler (matching content.js)
  const handleScrollToPrompt = (index) => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const targetEl = container.querySelector(`[data-prompt-idx="${index}"]`);
      if (targetEl) {
        // Smoothly scroll the container to center the target element
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Show glowing highlight (matching line 809 of content.js)
        setHighlightedPromptIndex(index);
        
        // Clear highlight after 1.5 seconds (matching line 820 of content.js)
        setTimeout(() => {
          setHighlightedPromptIndex(null);
        }, 1500);
      }
    }
  }

  // Auto-increment counter when user interacts
  const handleSimulateChatActivity = () => {
    setPopupChatsCount(prev => prev + 1)
    setLastPlatform('claude.ai')
  }

  // Refs for scroll-trigger animations
  const stepsRef = useRef(null)
  const isStepsInView = useInView(stepsRef, { once: true, amount: 0.2 })

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 20 randomly distributed particle dots around the footer
  const particleDots = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 90 + 5}%`,
      size: `${Math.random() * 4 + 3}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 4 + 4}s`
    }))
  ).current

  // Removed features list in favor of custom Bento Grid layout

  const platforms = [
    { name: 'ChatGPT', url: 'chatgpt.com', status: 'Active', id: 'chatgpt' },
    { name: 'Claude AI', url: 'claude.ai', status: 'Active', id: 'claude' },
    { name: 'Gemini', url: 'gemini.google.com', status: 'Active', id: 'gemini' },
    { name: 'DeepSeek', url: 'chat.deepseek.com', status: 'Active', id: 'deepseek' },
    { name: 'Perplexity', url: 'perplexity.ai', status: 'Active', id: 'perplexity' },
    { name: 'Hugging Chat', url: 'huggingface.co/chat', status: 'Active', id: 'huggingface' }
  ]

  const tickerItems = [
    "ChatGPT", "Claude AI", "Gemini", "DeepSeek", "Perplexity", "Hugging Chat",
    "ChatGPT", "Claude AI", "Gemini", "DeepSeek", "Perplexity", "Hugging Chat"
  ]

  const steps = [
    {
      num: '01',
      title: 'Install Extension',
      desc: 'Add the extension to Chrome, Brave, or Edge from the Chrome Web Store in just a click.'
    },
    {
      num: '02',
      title: 'Open AI Chats',
      desc: 'Visit ChatGPT, Claude, Gemini or DeepSeek. The extension automatically activates.'
    },
    {
      num: '03',
      title: 'Scroll Restored',
      desc: 'Focus on reading and writing prompts. The interface is now locked in place.'
    }
  ]

  const faqs = [
    {
      question: 'Why does AI chat scrolling jump around in the first place?',
      answer: 'Popular AI interfaces render messages dynamically in real-time. When new paragraphs, lists, or large code blocks are injected, the layout shift triggers the browser to recalculate scroll heights, resulting in disorienting scroll jumps.'
    },
    {
      question: 'Is my personal chat data secure?',
      answer: 'Yes, absolutely. AI Scroll Fix does not read, parse, or upload your messages or chat history. It operates strictly on the viewport scroll controller within your browser layout.'
    },
    {
      question: 'Can I disable it for specific websites?',
      answer: 'Yes. By clicking the extension icon in your browser toolbar, you can manage the list of active websites, whitelist/blacklist specific domains, or toggle the entire extension off.'
    },
    {
      question: 'Does this run on mobile browsers?',
      answer: 'It supports mobile browsers that allow Chrome extension installations (such as Kiwi Browser or Yandex Browser). Official mobile Chrome/Safari do not support extensions yet.'
    }
  ]

  const heroWords = "Fix AI Scrolling.".split(" ")

  return (
    <div className="app-container">
      {/* Background elements */}
      <div className="grid-overlay"></div>
      <div className="bg-blobs">
        <div className="blob blob-red-tr"></div>
        <div className="blob blob-purple-bl"></div>
        <div className="blob blob-pink-c"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="navbar-logo">
          <div className="logo-dot"></div>
          AI Scroll Fix
        </a>

        <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#platforms" className="nav-link" onClick={() => setIsMenuOpen(false)}>Platforms</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>How It Works</a>
          <a href="#faq" className="nav-link" onClick={() => setIsMenuOpen(false)}>FAQ</a>
        </div>

        <a href="#download" className="navbar-cta spring-btn">
          Download Extension
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-scanline"></div>
        <div className="hero-left">
          <div className="badge-pill">
            <span>✦</span> Free Chrome Extension
          </div>
          <h1 className="hero-heading">
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', marginRight: '16px' }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="glow-text"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Forever.
            </motion.span>
          </h1>
          <motion.p
            className="hero-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Tired of ChatGPT and Claude jumping to the bottom or scrolling you out of view during long generations? Lock your screen viewport automatically.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#download" className="btn-primary-shine spring-btn">
              Add to Chrome (Free)
            </a>
            <a href="#features" className="btn-hero-ghost spring-btn">
              Explore Features
            </a>
          </motion.div>

          <div className="counter-row">
            <div className="counter-item">
              <span className="counter-number">
                <CounterValue target={6} />
              </span>
              <span className="counter-label">Platforms Supported</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">
                <CounterValue target={0} suffix="ms" />
              </span>
              <span className="counter-label">Performance Hit</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">
                <CounterValue target={100} suffix="%" />
              </span>
              <span className="counter-label">Free & Open Source</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="interactive-mockup hero-chat-simulator">
            <div className="mockup-reflection"></div>
            <div className="mockup-header">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e11d48' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
              </div>
              <div className="mockup-url-bar">
                <span>🔒</span> claude.ai/chat/scroll-navigation
              </div>
            </div>
            
            <div className="mockup-body hero-chat-container-relative">
              <div 
                ref={heroChatContainerRef}
                className="hero-chat-simulator-scroll-area"
              >
                {/* Turn 1 */}
                <div 
                  data-hero-prompt-idx="0" 
                  className={`mockup-chat-bubble user ${heroHighlightedPromptIndex === 0 ? 'hero-asf-highlighted' : ''}`}
                >
                  Write a React hook to handle scroll anchoring, please!
                </div>
                <div className="mockup-chat-bubble ai">
                  <p style={{ marginBottom: '12px' }}>Here is a pure React implementation that listens to layout mutations and automatically locks scroll offsets:</p>
                  <div className="mock-code-editor">
                    <div className="editor-header">
                      <span className="editor-lang">useScrollAnchor.js</span>
                      <span className="editor-copy">Copy code</span>
                    </div>
                    <div className="editor-code-container">
                      <pre className="code-content" style={{ fontSize: '11px', color: '#93c5fd' }}>
{`const useScrollAnchor = (containerRef) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new MutationObserver(() => {
      // scroll anchor lock code
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [containerRef]);
};`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Turn 2 */}
                <div 
                  data-hero-prompt-idx="1" 
                  className={`mockup-chat-bubble user ${heroHighlightedPromptIndex === 1 ? 'hero-asf-highlighted' : ''}`}
                >
                  Is this compatible with Chrome extensions?
                </div>
                <div className="mockup-chat-bubble ai">
                  Yes, it runs inside content scripts and uses chrome.storage.sync for persistence.
                </div>

                {/* Turn 3 */}
                <div 
                  data-hero-prompt-idx="2" 
                  className={`mockup-chat-bubble user ${heroHighlightedPromptIndex === 2 ? 'hero-asf-highlighted' : ''}`}
                >
                  Does it handle zero-width spaces in text matching?
                </div>
                <div className="mockup-chat-bubble ai">
                  Yes, we clean it with normalizeText: text.replace(/[\u200B-\u200D\uFEFF]/g, '') in the search index.
                </div>
              </div>

              {/* INJECTED FLOATING BUTTON (Matching extension style) */}
              <div 
                id="hero-asf-btn"
                className="asf-dark"
                onMouseEnter={() => setHeroShowNavPanel(true)}
                onMouseLeave={() => setHeroShowNavPanel(false)}
                onClick={() => setHeroShowNavPanel(!heroShowNavPanel)}
              >
                <span id="hero-asf-num">3</span>
                <span id="hero-asf-label">chats</span>
              </div>

              {/* INJECTED NAV PANEL (Matching extension style) */}
              <div 
                id="hero-asf-panel"
                className={`asf-dark ${heroShowNavPanel ? 'show' : ''}`}
                onMouseEnter={() => setHeroShowNavPanel(true)}
                onMouseLeave={() => setHeroShowNavPanel(false)}
              >
                <div className="asf-header">
                  <span className="asf-header-title">Chat Navigation</span>
                  <span className="asf-header-badge">3</span>
                </div>
                <div className="asf-list">
                  {simPromptsList.map((prompt, idx) => (
                    <div 
                      key={idx}
                      className="asf-item"
                      onClick={() => handleHeroScrollToPrompt(idx)}
                    >
                      <span className="asf-item-index">#{idx + 1}</span> {prompt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <motion.section
        id="features"
        className="features-section"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Engineered for Focus</h2>
          <p className="section-subtitle">
            Say goodbye to scroll fights. This extension resolves UI layout shifts dynamically so you can read, review, and prompt without interruption.
          </p>
        </div>

        <div className="features-grid bento-layout">
          {/* Card 1: Universal AI Support (Large Wide Bento Card) */}
          <BentoCard className="bento-large" index={0}>
            <div className="bento-split-layout">
              <div className="bento-text-side">
                <div className="bento-badge">✦ COMPATIBILITY</div>
                <div className="bento-header-row">
                  <span className="bento-emoji">🌐</span>
                  <h3 className="bento-title">Universal AI Support</h3>
                </div>
                <p className="bento-desc">
                  Works flawlessly on ChatGPT, Claude, Gemini, DeepSeek, and other web chat portals out of the box. No manual scripting needed.
                </p>
              </div>
              <div className="bento-visual-side platform-orbit-visual">
                <div className="orbital-core">
                  <div className="orbital-logo-dot"></div>
                </div>
                <div className="orbital-satellites">
                  <div className="satellite sat-chatgpt">
                    {brandLogos.chatgpt}
                    <span>ChatGPT</span>
                  </div>
                  <div className="satellite sat-claude">
                    {brandLogos.claude}
                    <span>Claude</span>
                  </div>
                  <div className="satellite sat-gemini">
                    {brandLogos.gemini}
                    <span>Gemini</span>
                  </div>
                  <div className="satellite sat-deepseek">
                    {brandLogos.deepseek}
                    <span>DeepSeek</span>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Zero Overhead (Normal Bento Card) */}
          <BentoCard className="bento-small bento-overhead" index={1}>
            <div className="bento-flex-layout">
              <div className="bento-text-side">
                <div className="bento-header-row">
                  <span className="bento-emoji">⚡</span>
                  <h3 className="bento-title">Zero Overhead</h3>
                </div>
                <p className="bento-desc">
                  Written in pure, optimized JavaScript. No runtime delay or high CPU cycles. Extremely lightweight extension footprint.
                </p>
              </div>
              
              <div className="bento-visual-widget performance-widget">
                <div className="perf-gauge">
                  <div className="perf-gauge-fill"></div>
                  <div className="perf-gauge-text">
                    <span className="gauge-number">0.0</span>
                    <span className="gauge-unit">ms lag</span>
                  </div>
                </div>
                <div className="perf-spark-lines">
                  <div className="spark-line line-1"></div>
                  <div className="spark-line line-2"></div>
                  <div className="spark-line line-3"></div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Seamless Controls (Normal Bento Card) */}
          <BentoCard className="bento-small bento-controls" index={2}>
            <div className="bento-flex-layout">
              <div className="bento-text-side">
                <div className="bento-header-row">
                  <span className="bento-emoji">⚙️</span>
                  <h3 className="bento-title">Seamless Controls</h3>
                </div>
                <p className="bento-desc">
                  Disable or enable the scroll lock with a simple browser toggle switch or custom keyboard shortcuts.
                </p>
              </div>
              
              <div className="bento-visual-widget controls-widget">
                <div 
                  className={`sim-switch-card ${isLockActive ? 'active' : 'inactive'}`}
                  onClick={() => setIsLockActive(!isLockActive)}
                >
                  <span className="sim-switch-label">Scroll Anchor</span>
                  <div className="sim-switch-track">
                    <div className="sim-switch-thumb"></div>
                  </div>
                  <div className="sim-status-badge">
                    {isLockActive ? 'ACTIVE' : 'PAUSED'}
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </motion.section>

      {/* PLATFORMS SECTION */}
      <motion.section
        id="platforms"
        className="platforms-section"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-header">
          <span className="section-tag">Compatibility</span>
          <h2 className="section-title">Tested Across All LLMs</h2>
          <p className="section-subtitle">
            Wherever you prompt, we lock the scroll. We continually verify and update class selectors for all major chat interfaces.
          </p>
        </div>

        {/* Continuous Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {tickerItems.map((item, idx) => (
              <span key={idx} className="marquee-item">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="platforms-container">
          {platforms.map((plat, index) => (
            <motion.div
              key={index}
              className={`platform-card plat-${plat.id} spring-card`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <div className="platform-card-glow-bg"></div>
              <div className="platform-icon-wrapper">
                {brandLogos[plat.id]}
              </div>
              <h3 className="platform-name">{plat.name}</h3>
              <p className="platform-url">{plat.url}</p>
              
              <div className="platform-badge-row">
                <span className="platform-status-dot"></span>
                <span className="platform-badge-text">{plat.status}</span>
              </div>
              
              <span className="platform-arrow">↗</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* HOW IT WORKS SECTION */}
      <motion.section
        id="how-it-works"
        className="how-it-works-section"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Simple 3-Step Setup</h2>
          <p className="section-subtitle">
            No complex configurations files or APIs. Just install and let it work its magic behind the scenes.
          </p>
        </div>

        <div className="steps-container" ref={stepsRef}>
          <motion.div
            className="connecting-line neon-pipeline"
            initial={{ scaleX: 0 }}
            animate={isStepsInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {steps.map((step, index) => {
            // Render specific mock interactive widget for each step
            let widgetContent = null;
            if (index === 0) {
              widgetContent = (
                <div className="mock-widget install-widget">
                  <div className="browser-header-row">
                    <span className="browser-icon-chrome"></span>
                    <span className="browser-url-text">chrome://store</span>
                  </div>
                  <div className="browser-content-box">
                    <div className="extension-avatar-circle">
                      <div className="logo-dot small-dot"></div>
                    </div>
                    <div className="extension-action-button-sim">
                      <span>Add to Chrome</span>
                    </div>
                  </div>
                </div>
              );
            } else if (index === 1) {
              widgetContent = (
                <div className="mock-widget tabs-widget">
                  <div className="mock-tab active-tab">
                    <span className="tab-bullet purple"></span>
                    <span>claude.ai</span>
                  </div>
                  <div className="mock-tab">
                    <span className="tab-bullet green"></span>
                    <span>chatgpt</span>
                  </div>
                  <div className="mock-tab">
                    <span className="tab-bullet blue"></span>
                    <span>gemini</span>
                  </div>
                </div>
              );
            } else if (index === 2) {
              widgetContent = (
                <div className="mock-widget lock-status-widget">
                  <div className="visual-lock-ring">
                    <div className="padlock-icon">🔒</div>
                    <div className="sonar-ring"></div>
                  </div>
                  <div className="locked-badge-indicator">SCROLL RESTORED</div>
                </div>
              );
            }

            return (
              <motion.div
                key={index}
                className="step-card-box spring-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              >
                <div className="step-card-inner">
                  <div className="step-number-badge">
                    {step.num}
                  </div>
                  
                  {/* Visual Widget representation */}
                  <div className="step-card-visual-container">
                    {widgetContent}
                  </div>

                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* DEMO SECTION */}
      <motion.section
        className="demo-section"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-header">
          <span className="section-tag">Interactive Simulator</span>
          <h2 className="section-title">See The Difference</h2>
          <p className="section-subtitle">
            Hover over the floating navigator on the left chat mockup to quickly jump back to any previous prompt, and check the real extension popup dashboard on the right.
          </p>
        </div>

        <div className="demo-container">
          {/* LEFT PANEL: Chat Window Simulator */}
          <div className="demo-mockup chat-simulator-window">
            <div className="mockup-header">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              <div className="mockup-url-bar">
                <span>🔒</span> claude.ai/chat/scroll-navigation
              </div>
            </div>
            
            <div className="mockup-body chat-simulator-container-relative">
              <div 
                ref={chatContainerRef}
                className="chat-simulator-scroll-area"
                onClick={handleSimulateChatActivity}
              >
                {/* Turn 1 */}
                <div 
                  data-prompt-idx="0" 
                  className={`mockup-chat-bubble user ${highlightedPromptIndex === 0 ? 'asf-highlighted' : ''}`}
                >
                  Write a React hook to handle scroll anchoring, please!
                </div>
                <div className="mockup-chat-bubble ai">
                  <p style={{ marginBottom: '12px' }}>Here is a pure React implementation that listens to layout mutations and automatically locks scroll offsets:</p>
                  <div className="mock-code-editor">
                    <div className="editor-header">
                      <span className="editor-lang">useScrollAnchor.js</span>
                      <span className="editor-copy">Copy code</span>
                    </div>
                    <div className="editor-code-container">
                      <pre className="code-content" style={{ fontSize: '11px', color: '#93c5fd' }}>
{`const useScrollAnchor = (containerRef) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new MutationObserver(() => {
      // scroll anchor lock code
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [containerRef]);
};`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Turn 2 */}
                <div 
                  data-prompt-idx="1" 
                  className={`mockup-chat-bubble user ${highlightedPromptIndex === 1 ? 'asf-highlighted' : ''}`}
                >
                  Is this compatible with Chrome extensions?
                </div>
                <div className="mockup-chat-bubble ai">
                  Yes, it runs inside content scripts and uses chrome.storage.sync for persistence.
                </div>

                {/* Turn 3 */}
                <div 
                  data-prompt-idx="2" 
                  className={`mockup-chat-bubble user ${highlightedPromptIndex === 2 ? 'asf-highlighted' : ''}`}
                >
                  Does it handle zero-width spaces in text matching?
                </div>
                <div className="mockup-chat-bubble ai">
                  Yes, we clean it with normalizeText: text.replace(/[\u200B-\u200D\uFEFF]/g, '') in the search index.
                </div>
              </div>

              {/* INJECTED FLOATING BUTTON (Matching content.js style) */}
              <div 
                id="asf-btn"
                className="asf-dark"
                onMouseEnter={() => setShowNavPanel(true)}
                onMouseLeave={() => setShowNavPanel(false)}
                onClick={() => setShowNavPanel(!showNavPanel)}
              >
                <span id="asf-num">3</span>
                <span id="asf-label">chats</span>
              </div>

              {/* INJECTED NAV PANEL (Matching content.js style) */}
              <div 
                id="asf-panel"
                className={`asf-dark ${showNavPanel ? 'show' : ''}`}
                onMouseEnter={() => setShowNavPanel(true)}
                onMouseLeave={() => setShowNavPanel(false)}
              >
                <div className="asf-header">
                  <span className="asf-header-title">Chat Navigation</span>
                  <span className="asf-header-badge">3</span>
                </div>
                <div className="asf-list">
                  {simPromptsList.map((prompt, idx) => (
                    <div 
                      key={idx}
                      className="asf-item"
                      onClick={() => handleScrollToPrompt(idx)}
                    >
                      <span className="asf-item-index">#{idx + 1}</span> {prompt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="simulator-helper-banner">
              <span>💡 Hover or Click the floating button (3 chats) to reveal prompt quick-navigation panel!</span>
            </div>
          </div>

          {/* RIGHT PANEL: Replicating real popup.html / popup.js */}
          <div className="demo-mockup extension-popup-window">
            <div className="mockup-header">
              <div className="extension-badge-header">
                <span className="window-dots">•••</span>
                <span>Chrome Extension UI</span>
              </div>
            </div>
            
            <div className="mockup-body extension-popup-body">
              <h2 className="extension-popup-title">
                🔧 AI Scroll Fix
              </h2>
              
              <div className="extension-popup-stats-card">
                <span className="extension-popup-stats-count">
                  {popupChatsCount}
                </span>
                <span className="extension-popup-stats-label">
                  AI Chats Tracked
                </span>
              </div>

              <div className="extension-popup-last-platform">
                Last visited: <span className="highlight-plat">{lastPlatform}</span>
              </div>

              <div className="extension-popup-platform-card">
                <ul className="extension-popup-platform-list">
                  <li><span className="check">&#10003;</span> ChatGPT</li>
                  <li><span className="check">&#10003;</span> Claude.ai</li>
                  <li><span className="check">&#10003;</span> Gemini</li>
                  <li><span className="check">&#10003;</span> Perplexity</li>
                  <li><span className="check">&#10003;</span> Copilot</li>
                  <li><span className="check">&#10003;</span> You.com</li>
                  <li><span className="check">&#10003;</span> DeepSeek</li>
                </ul>
              </div>

              <div className="extension-popup-footer">
                <button 
                  onClick={handleResetCounter}
                  id="reset-btn"
                >
                  Reset Counter
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section
        id="faq"
        className="faq-section"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="faq-container-grid">
          {/* LEFT COLUMN: Sticky Info & Live Stats */}
          <div className="faq-info-panel">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Common Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about the extension, privacy, and compatibility.
            </p>

            {/* Premium Extension Status Hub Widget */}
            <div className="faq-status-widget glass-card">
              <div className="widget-header">
                <div className="status-indicator-wrapper">
                  <span className="status-pulse-dot"></span>
                  <span className="status-label">Extension Status: Active</span>
                </div>
                <span className="widget-version">v1.2.0</span>
              </div>

              <div className="widget-metrics">
                <div className="metric-item">
                  <div className="metric-val">0ms</div>
                  <div className="metric-lbl">Scroll Lag</div>
                </div>
                <div className="metric-item">
                  <div className="metric-val">100%</div>
                  <div className="metric-lbl">Privacy Assured</div>
                </div>
                <div className="metric-item">
                  <div className="metric-val">5★</div>
                  <div className="metric-lbl">User Rating</div>
                </div>
              </div>

              <div className="widget-footer">
                <span className="widget-secure-icon">🛡️</span>
                <span className="widget-secure-text">Fully sandboxed. Zero remote connections.</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Redesigned FAQ Accordion */}
          <div className="faq-accordion-panel">
            <div className="faq-accordion">
              {faqs.map((faq, index) => {
                const isOpen = activeFaqIndex === index;
                // Category determination
                let category = "TECH";
                if (index === 1) category = "PRIVACY";
                if (index === 2) category = "CONTROLS";
                if (index === 3) category = "PLATFORMS";

                return (
                  <div
                    key={index}
                    className={`faq-item-card ${isOpen ? 'active-open' : ''}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-card-glow-border"></div>
                    <div className="faq-item-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className={`faq-card-tag tag-${category.toLowerCase()}`}>{category}</span>
                        <h3 className="faq-question-text">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="faq-chevron-wrapper">
                        <svg
                          className="faq-chevron-svg"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                          className="faq-answer-container"
                        >
                          <div className="faq-answer-text">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER CTA */}
      <footer id="download" className="footer-cta">
        <h2 className="footer-heading">
          Ready to Fix Your <span className="glow-text">AI Scrolling?</span>
        </h2>
        <a href="#" className="btn-primary-shine btn-large spring-btn">
          Add to Chrome (Free)
        </a>
        <div className="footer-note">Works on Chrome, Brave, Edge, and Opera.</div>

        {/* Floating tech icons */}
        <FaChrome className="floating-icon floating-icon-1" />
        <FaLock className="floating-icon floating-icon-2" />
        <FaCode className="floating-icon floating-icon-3" />

        {/* Particle dots */}
        {particleDots.map((dot) => (
          <div
            key={dot.id}
            style={{
              position: 'absolute',
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              backgroundColor: 'rgba(225, 29, 72, 0.4)',
              animation: `float ${dot.duration} ease-in-out infinite`,
              animationDelay: dot.delay,
              pointerEvents: 'none'
            }}
          />
        ))}

        <div className="footer-line">
          © 2025 AI Scroll Fix — Built for the AI generation
        </div>
      </footer>
    </div>
  )
}

export default App
