import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiDownload, FiChevronDown, FiZap, FiLayout, FiMaximize, FiShield, FiArrowRight, FiCpu, FiCode, FiActivity } from 'react-icons/fi';
import { SiOpenai, SiGoogle, SiAnthropic } from 'react-icons/si';
import './App.css';

// 3D Tilt Card Component
const TiltCard = ({ icon, title, description, delay = 0 }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setTilt({ x: rotateX, y: rotateY });
    setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div 
      ref={cardRef}
      className="feature-card glass-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(15px)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div 
        className="feature-card-glow"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255, 29, 77, 0.24) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)`
        }}
      ></div>
      <div className="feature-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem', transform: 'translateZ(40px)' }}>{icon}</div>
      <h3 className="space-grotesk" style={{ fontSize: '1.5rem', marginBottom: '1rem', transform: 'translateZ(25px)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', transform: 'translateZ(15px)' }}>{description}</p>
    </motion.div>
  );
};

const StatCounter = ({ endValue, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue, isInView]);

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-value glow-text">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <div className="faq-q" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <FiChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{ paddingBottom: '2rem' }}>{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Platforms Section — Stunning Glass Cards
const PlatformCard = ({ name, index }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div 
      ref={cardRef}
      className="platform-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="platform-status">Optimization Active</div>
      <span>{name}</span>
      <FiArrowRight className="platform-arrow" />
    </motion.div>
  );
};

const App = () => {
  const headingWords = "Fix AI Scrolling.".split(" ");
  const platforms = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "DeepSeek", "Mistral", "Llama"];
  
  const stepRef1 = useRef(null);
  const stepRef2 = useRef(null);
  const stepRef3 = useRef(null);
  const isStep1InView = useInView(stepRef1, { once: true });
  const isStep2InView = useInView(stepRef2, { once: true });
  const isStep3InView = useInView(stepRef3, { once: true });

  // Generate particle dots
  const particles = Array.from({ length: 20 });

  return (
    <div className="app-root">
      <div className="bg-blobs">
        <div className="blob blob-red"></div>
        <div className="blob blob-purple"></div>
        <div className="blob blob-pink"></div>
      </div>
      <div className="noise-grid"></div>

      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-dot"></div>
          <span>AI Scroll Fix</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#platforms" className="nav-link">Platforms</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <button className="nav-download" onClick={() => window.location.href='/ai-scroll-fix-website/ai-scroll-fix.zip'}>
            Download Free
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-scanline"></div>
        <div className="hero-left">
          <motion.div className="hero-badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>✦ Free Chrome Extension</motion.div>
          <h1 className="space-grotesk">
            {headingWords.map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ display: 'inline-block', marginRight: '16px' }}>{word}</motion.span>
            ))}
            <br />
            <motion.span className="glow-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Forever.</motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>A free Chrome Extension that brings smooth scrolling, chat navigation, and smart theme detection to ChatGPT, Claude, Gemini, Perplexity and more.</motion.p>
          <motion.div className="hero-btns" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <button className="btn-primary-hero" onClick={() => window.location.href='/ai-scroll-fix-website/ai-scroll-fix.zip'}>Download Extension</button>
            <button className="btn-ghost-hero" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>See How It Works</button>
          </motion.div>
          <div className="hero-stats">
            <StatCounter endValue={6} label="Platforms Supported" />
            <StatCounter endValue={0} label="Performance Hit" suffix="ms" />
            <StatCounter endValue={100} label="Free" suffix="%" />
          </div>
        </div>
        <div className="hero-right">
          <motion.div className="browser-mockup" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="mockup-shiny"></div>
            <div className="browser-header">
              <div className="header-dots"><div className="dot dot-r"></div><div className="dot dot-y"></div><div className="dot dot-g"></div></div>
              <div className="url-bar">claude.ai/chat</div>
            </div>
            <div className="browser-body">
              <div className="chat-bubble user-bubble"><div className="line line-med"></div><div className="line line-short"></div></div>
              <div className="chat-bubble ai-bubble">
                <div className="line line-full"></div>
                <div className="line line-med"></div>
                <div className="line line-short" style={{ display: 'inline-block' }}></div>
                <div className="blinking-cursor"></div>
              </div>
              <div className="chat-bubble user-bubble"><div className="line line-med"></div></div>
              <div className="floating-btn"><FiLayout style={{ color: 'white', fontSize: '1.2rem' }} /></div>
              <div className="side-panel">
                <span className="panel-title">Recent Chats</span>
                {[1,2,3,4,5].map(i => (
                  <motion.div 
                    key={i} 
                    className="panel-item"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  ></motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section — 3D Tilt */}
      <section id="features" style={{ padding: '120px 80px', textAlign: 'center' }}>
        <h2 className="space-grotesk" style={{ fontSize: '4rem', marginBottom: '4rem' }}>Experience the Smoothness</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <TiltCard 
            icon={<FiZap className="glow-text" />} 
            title="Zero Latency" 
            description="Engineered for performance. No UI lag, ever." 
          />
          <TiltCard 
            icon={<FiMaximize className="glow-text" />} 
            title="Smart Nav" 
            description="Quickly jump between chats with a floating overlay." 
            delay={0.1}
          />
          <TiltCard 
            icon={<FiShield className="glow-text" />} 
            title="Privacy First" 
            description="No data collection. No cloud sync. Just you." 
            delay={0.2}
          />
        </div>
      </section>

      {/* Platforms Section — Stunning Revamp */}
      <section id="platforms" className="platforms-section">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...platforms, ...platforms].map((p, i) => (
              <span key={i} className="marquee-item">{p}</span>
            ))}
          </div>
        </div>
        <div className="platform-grid">
          {platforms.slice(0, 4).map((p, i) => (
            <PlatformCard key={i} name={p} index={i} />
          ))}
        </div>
      </section>

      {/* How It Works Section — Connectors */}
      <section id="how-it-works" style={{ padding: '120px 80px' }}>
        <h2 className="space-grotesk glow-text" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '6rem' }}>Three Simple Steps</h2>
        <div className="steps-container" style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          <div className="step-card" ref={stepRef1} style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
            <div className="step-number-circle">01</div>
            <motion.div 
              className="step-connector" 
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: isStep1InView ? 1 : 0 }} 
              transition={{ duration: 1 }}
            ></motion.div>
            <div className="step-content">
              <h3 className="space-grotesk" style={{ fontSize: '2.5rem' }}>Download ZIP</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Click any download button to get the source files.</p>
            </div>
          </div>
          <div className="step-card" ref={stepRef2} style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexDirection: 'row-reverse', textAlign: 'right' }}>
            <div className="step-number-circle" style={{ animationDelay: '0.5s' }}>02</div>
            <motion.div 
              className="step-connector" 
              style={{ left: 'auto', right: '100px', transformOrigin: 'right', background: 'linear-gradient(-90deg, var(--accent-red), transparent)' }}
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: isStep2InView ? 1 : 0 }} 
              transition={{ duration: 1 }}
            ></motion.div>
            <div className="step-content">
              <h3 className="space-grotesk" style={{ fontSize: '2.5rem' }}>Extract & Load</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Enable Developer Mode in Chrome and Load Unpacked.</p>
            </div>
          </div>
          <div className="step-card" ref={stepRef3} style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
            <div className="step-number-circle" style={{ animationDelay: '1s' }}>03</div>
            <div className="step-content">
              <h3 className="space-grotesk" style={{ fontSize: '2.5rem' }}>Chat Freely</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Enjoy seamless scrolling on all AI platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <h2 className="faq-title space-grotesk">Got Questions?</h2>
        <div className="faq-container">
          <FAQItem question="Is this extension free?" answer="Yes, completely free and open source forever." />
          <FAQItem question="Will it slow down my browser?" answer="No. It uses minimal resources with no aggressive observers." />
          <FAQItem question="Does it work on Firefox?" answer="Currently Chrome only. Firefox support coming soon." />
          <FAQItem question="Is my data safe?" answer="The extension never collects, sends, or stores any of your chat data." />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        {/* Particle Dots */}
        {particles.map((_, i) => (
          <div 
            key={i} 
            className="particle-dot"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}

        {/* Floating Icons */}
        <div className="floating-tech-icon" style={{ top: '20%', left: '10%', animationDuration: '6s' }}><SiOpenai size={40} /></div>
        <div className="floating-tech-icon" style={{ top: '60%', right: '15%', animationDuration: '8s', animationDelay: '1s' }}><SiGoogle size={45} /></div>
        <div className="floating-tech-icon" style={{ top: '30%', right: '10%', animationDuration: '7s', animationDelay: '2s' }}><SiAnthropic size={35} /></div>

        <h2 className="space-grotesk">
          Ready to Fix Your <br />
          <span className="glow-text">AI Scrolling?</span>
        </h2>
        <button 
          className="btn-primary-hero footer-btn-huge" 
          onClick={() => window.location.href='/ai-scroll-fix-website/ai-scroll-fix.zip'}
        >
          Download Now — It's Free
        </button>
        <div className="footer-bottom">
          <p>© 2025 AI Scroll Fix — Built for the AI generation</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
