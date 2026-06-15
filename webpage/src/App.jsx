import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)

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

  const toggleFaq = (index) => {
    if (activeFaqIndex === index) {
      setActiveFaqIndex(null)
    } else {
      setActiveFaqIndex(index)
    }
  }

  const features = [
    {
      emoji: '🔒',
      title: 'Auto-Scroll Lock',
      desc: 'Prevents the viewport from jumping around while the AI model streams code blocks or text chunks.'
    },
    {
      emoji: '⚡',
      title: 'Zero Overhead',
      desc: 'Written in pure, optimized JavaScript. No runtime delay or high CPU cycles. Extremely lightweight.'
    },
    {
      emoji: '🌐',
      title: 'Universal AI Support',
      desc: 'Works flawlessly on ChatGPT, Claude, Gemini, DeepSeek, and other web chat portals out of the box.'
    },
    {
      emoji: '⚙️',
      title: 'Seamless Controls',
      desc: 'Disable or enable the scroll lock with a simple browser toggle button or customizable shortcuts.'
    },
    {
      emoji: '👤',
      title: 'Privacy Preserved',
      desc: 'Zero user data collection. Runs entirely in your local browser sandbox. Safe, secure, and offline.'
    },
    {
      emoji: '📂',
      title: 'Open Source',
      desc: 'Completely open source codebase. Inspect the code, submit pull requests, or fork it on GitHub.'
    }
  ]

  const platforms = [
    { name: 'ChatGPT', url: 'chatgpt.com', status: 'Active' },
    { name: 'Claude AI', url: 'claude.ai', status: 'Active' },
    { name: 'Gemini', url: 'gemini.google.com', status: 'Active' },
    { name: 'DeepSeek', url: 'chat.deepseek.com', status: 'Active' },
    { name: 'Perplexity', url: 'perplexity.ai', status: 'Active' },
    { name: 'Hugging Chat', url: 'huggingface.co/chat', status: 'Active' }
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

  return (
    <div className="app-container">
      {/* Background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-red-tr"></div>
        <div className="blob blob-purple-bl"></div>
        <div className="blob blob-red-br"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="navbar-logo">
          <div className="logo-indicator"></div>
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

        <a href="#download" className="navbar-cta">
          Install Now
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-left animate-fade-up">
          <div className="chrome-pill">
            <span>✦</span> Chrome Extension — Free Forever
          </div>
          <h1 className="hero-heading">
            Fix AI Scrolling.
            <span className="accent">Forever.</span>
          </h1>
          <p className="hero-subtext">
            Tired of ChatGPT and Claude jumping to the bottom or scrolling you out of view during long generations? Lock your screen viewport automatically.
          </p>
          <div className="hero-buttons">
            <a href="#download" className="btn-primary">
              Add to Chrome (Free)
            </a>
            <a href="#features" className="btn-ghost">
              Explore Features
            </a>
          </div>
          <div className="trust-badges">
            <span>✦ Free Forever</span>
            <span>✦ No Account Needed</span>
            <span>✦ Open Source</span>
          </div>
        </div>

        <div className="hero-right animate-slide-in-right">
          <div className="browser-mockup">
            <div className="browser-header">
              <div className="browser-dots">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
              </div>
              <div className="browser-url-bar">chatgpt.com/c/scroll-lock-active</div>
            </div>
            <div className="browser-body">
              <div className="fake-chat-line" style={{ width: '85%' }}></div>
              <div className="fake-chat-line" style={{ width: '60%' }}></div>
              <div className="fake-chat-line tall" style={{ width: '75%' }}></div>
              <div className="fake-chat-line" style={{ width: '50%' }}></div>
              <div className="fake-chat-line tall" style={{ width: '80%' }}></div>
              
              <button className="floating-chat-btn">
                <span className="badge-num">9</span>
                <span className="badge-label">chats</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Engineered for Focus</h2>
          <p className="section-subtitle">
            Say goodbye to scroll fights. This extension resolves UI layout issues behind the scenes so you can read code blocks, review drafts, and follow AI streaming cleanly.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <span className="feature-emoji">{feat.emoji}</span>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLATFORMS SECTION */}
      <section id="platforms" className="platforms-section">
        <div className="section-header">
          <span className="section-tag">Compatibility</span>
          <h2 className="section-title">Tested Across All LLMs</h2>
          <p className="section-subtitle">
            Wherever you prompt, we lock the scroll. We continually verify and update class selectors for all major chat interfaces.
          </p>
        </div>

        <div className="platforms-container">
          {platforms.map((plat, index) => (
            <motion.div
              key={index}
              className="platform-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <h3 className="platform-name">{plat.name}</h3>
              <p className="platform-url">{plat.url}</p>
              <span className="platform-badge">{plat.status}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Simple 3-Step Setup</h2>
          <p className="section-subtitle">
            No complex setups or developers keys needed. Just load the files and start typing.
          </p>
        </div>

        <div className="steps-container">
          <div className="connecting-line"></div>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="demo-section">
        <div className="section-header">
          <span className="section-tag">Interactive Preview</span>
          <h2 className="section-title">See The Difference</h2>
          <p className="section-subtitle">
            Experience the scroll recovery feature. The extension injects indicators and panel shortcuts for easy layout settings.
          </p>
        </div>

        <div className="demo-container">
          <div className="demo-mockup">
            <div className="browser-header">
              <div className="browser-dots">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
              </div>
              <div className="browser-url-bar">extension-controls.local</div>
            </div>
            <div className="browser-body">
              <div className="fake-chat-line" style={{ width: '85%' }}></div>
              <div className="fake-chat-line" style={{ width: '50%' }}></div>
              <div className="fake-chat-line tall" style={{ width: '90%' }}></div>
              <div className="fake-chat-line" style={{ width: '60%' }}></div>
              <button className="floating-chat-btn">
                <span className="badge-num">Active</span>
                <span className="badge-label">scroll lock</span>
              </button>
            </div>
          </div>

          <div className="demo-mockup">
            <div className="browser-header">
              <div className="browser-dots">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
              </div>
              <div className="browser-url-bar">history-panel.local</div>
            </div>
            <div className="browser-body">
              <div className="chat-list">
                <div className="chat-list-item">#1 How do I fix scrolling jumps in ChatGPT?</div>
                <div className="chat-list-item">#2 Can you write a CSS fix for scroll anchoring?</div>
                <div className="chat-list-item">#3 What is the best browser for Chrome extensions?</div>
                <div className="chat-list-item">#4 Explain quantum computing scroll lock algorithms.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="faq-section">
        <div className="section-header">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">Common Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about the extension, privacy, and compatibility.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  {faq.question}
                  <svg
                    className="faq-chevron"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="faq-answer"
                    >
                      <div className="faq-answer-inner">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer id="download" className="footer-cta">
        <h2 className="footer-heading">Fix your scrolling once and for all.</h2>
        <a href="#" className="btn-primary btn-large">
          Add to Chrome (Free)
        </a>
        <div className="footer-note">Works on Chrome, Brave, Edge, and Opera.</div>
        <div className="footer-line">
          © 2025 AI Scroll Fix — Built for the AI generation
        </div>
      </footer>
    </div>
  )
}

export default App
