import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { PRACTICE_AREAS, MANAGED_AGENTS, CONNECTORS } from './practiceAreas.js'
import { SAMPLE_DOCS, VULN_REPORT } from './documents.js'
import { COMPARE_PAIRS } from './comparePairs.js'
import { SAMPLE_CONTRACT_REGISTER, SAMPLE_REG_UPDATES, SAMPLE_LAUNCH_ITEMS } from './agentData.js'

/* ════════════════════════════════════════════════
   LEXICON AI v2.0 — Legal Intelligence Platform
   Complete Redesigned Application
   ════════════════════════════════════════════════ */

const TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'skills', label: 'Skills', icon: '🎯' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'documents', label: 'Documents', icon: '📄' },
  { id: 'compare', label: 'Compare', icon: '⚖️' },
  { id: 'agents', label: 'Agents', icon: '🤖' },
  { id: 'guide', label: 'Guide', icon: '📖' },
]

const SKILL_COLORS = {
  commercial: '#D4AF37',
  corporate: '#7B8CDE',
  litigation: '#EF4444',
  privacy: '#10B981',
  employment: '#8B5CF6',
  ip: '#F59E0B',
  product: '#3B82F6',
  regulatory: '#8B6F47',
  'ai-governance': '#14B8A6',
  'law-student': '#F43F5E',
  'legal-clinic': '#96CEB4',
  'legal-builder': '#06B6D4',
}

const SKILL_GLOWS = {
  commercial: 'rgba(212,175,55,0.15)',
  corporate: 'rgba(123,140,222,0.15)',
  litigation: 'rgba(239,68,68,0.15)',
  privacy: 'rgba(16,185,129,0.15)',
  employment: 'rgba(139,92,246,0.15)',
  ip: 'rgba(245,158,11,0.15)',
  product: 'rgba(59,130,246,0.15)',
  regulatory: 'rgba(139,111,71,0.15)',
  'ai-governance': 'rgba(20,184,166,0.15)',
  'law-student': 'rgba(244,63,94,0.15)',
  'legal-clinic': 'rgba(150,206,180,0.15)',
  'legal-builder': 'rgba(6,182,212,0.15)',
}

/* ─── Fade In Observer Hook ─── */
function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ════════════════════════════════════════════════
   HOME VIEW — Hero + Practice Areas + Features + Agents
   ════════════════════════════════════════════════ */
function HomeView({ onNavigate }) {
  const heroRef = useFadeIn()
  const areasRef = useFadeIn()
  const featuresRef = useFadeIn()
  const agentsRef = useFadeIn()

  const totalSkills = PRACTICE_AREAS.reduce((sum, a) => sum + a.skills.length, 0)

  return (
    <>
      {/* HERO BANNER */}
      <div ref={heroRef} className="fade-wrapper hero-banner">
        <div className="hero-mesh" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-inner">
          <div className="hero-badge">AI-Powered Legal Intelligence</div>
          <h1 className="hero-headline">
            Lexicon <span className="hero-gradient-text">AI</span>
          </h1>
          <p className="hero-tagline">
            The most advanced legal intelligence platform. 100+ specialized skills across 12 practice areas, 
            powered by Claude for Legal. Contract review, compliance, litigation support, and more — 
            all in one unified workspace.
          </p>
          <div className="hero-actions">
            <button className="btn-hero btn-hero-primary" onClick={() => onNavigate('skills')}>
              Explore Skills 🎯
            </button>
            <button className="btn-hero btn-hero-secondary" onClick={() => onNavigate('chat')}>
              Start Chatting 💬
            </button>
          </div>
        </div>
        <div className="hero-stats-bar">
          <div className="hero-stat" style={{ '--glow': SKILL_GLOWS.commercial }}>
            <span className="hero-stat-icon">⚖️</span>
            <div className="hero-stat-num">{PRACTICE_AREAS.length}</div>
            <div className="hero-stat-label">Practice Areas</div>
          </div>
          <div className="hero-stat" style={{ '--glow': SKILL_GLOWS.privacy }}>
            <span className="hero-stat-icon">🎯</span>
            <div className="hero-stat-num">{totalSkills}</div>
            <div className="hero-stat-label">Legal Skills</div>
          </div>
          <div className="hero-stat" style={{ '--glow': SKILL_GLOWS.employment }}>
            <span className="hero-stat-icon">🤖</span>
            <div className="hero-stat-num">{MANAGED_AGENTS.length}</div>
            <div className="hero-stat-label">AI Agents</div>
          </div>
          <div className="hero-stat" style={{ '--glow': SKILL_GLOWS.product }}>
            <span className="hero-stat-icon">🔗</span>
            <div className="hero-stat-num">{CONNECTORS.length}</div>
            <div className="hero-stat-label">Integrations</div>
          </div>
        </div>
      </div>

      {/* PRACTICE AREAS */}
      <div ref={areasRef} className="fade-wrapper section-block">
        <div className="section-header">
          <h2 className="section-heading">
            Practice <span className="section-heading-accent">Areas</span>
          </h2>
          <p className="section-sub">12 specialized legal domains, each with dedicated AI skills</p>
          <div className="section-divider" />
        </div>
        <div className="area-grid-v2">
          {PRACTICE_AREAS.map((area) => (
            <div
              key={area.id}
              className="area-card-v2"
              style={{
                '--accent': SKILL_COLORS[area.id],
                '--accent-glow': SKILL_GLOWS[area.id],
              }}
              onClick={() => onNavigate('skills', area.id)}
            >
              <div className="acard-glow" />
              <div className="acard-content">
                <div className="acard-top">
                  <span className="acard-icon">{area.icon}</span>
                  <span className="acard-count">{area.skills.length}</span>
                </div>
                <div className="acard-name">{area.name}</div>
                <div className="acard-desc">{area.desc}</div>
              </div>
              <div className="acard-hover-bar" />
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div ref={featuresRef} className="fade-wrapper section-block">
        <div className="section-header">
          <h2 className="section-heading">
            Platform <span className="section-heading-accent">Features</span>
          </h2>
          <p className="section-sub">Powerful capabilities designed for modern legal teams</p>
          <div className="section-divider" />
        </div>
        <div className="features-grid">
          <div className="feature-card" style={{ '--fcolor': '#D4AF37' }}>
            <div className="feature-icon-wrap">
              <span className="feature-icon">⚡</span>
            </div>
            <div className="feature-title">Instant Analysis</div>
            <div className="feature-desc">
              Upload contracts, NDAs, or regulatory documents and get instant AI-powered analysis with redline recommendations.
            </div>
          </div>
          <div className="feature-card" style={{ '--fcolor': '#3B82F6' }}>
            <div className="feature-icon-wrap">
              <span className="feature-icon">🔍</span>
            </div>
            <div className="feature-title">Smart Comparison</div>
            <div className="feature-desc">
              Compare vendor documents against your standard templates. Spot deviations, risks, and missing clauses automatically.
            </div>
          </div>
          <div className="feature-card" style={{ '--fcolor': '#10B981' }}>
            <div className="feature-icon-wrap">
              <span className="feature-icon">🛡️</span>
            </div>
            <div className="feature-title">Risk Assessment</div>
            <div className="feature-desc">
              Automated vulnerability scanning and risk scoring across your entire legal document portfolio.
            </div>
          </div>
        </div>
      </div>

      {/* MANAGED AGENTS */}
      <div ref={agentsRef} className="fade-wrapper section-block">
        <div className="section-header">
          <h2 className="section-heading">
            Managed <span className="section-heading-accent">Agents</span>
          </h2>
          <p className="section-sub">Autonomous AI agents that monitor, alert, and act on your behalf</p>
          <div className="section-divider" />
        </div>
        <div className="agents-grid-v2">
          {MANAGED_AGENTS.map((agent) => (
            <div key={agent.name} className="agent-card-v2">
              <div className="agent-pulse" />
              <span className="agent-icon-v2">🤖</span>
              <div className="agent-name-v2">{agent.name}</div>
              <div className="agent-desc-v2">{agent.desc}</div>
              <div className="agent-status-v2">● LIVE MONITORING</div>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        <strong>⚖️ Important Notice:</strong> Lexicon AI is an intelligence platform that assists legal professionals. 
        All AI-generated outputs should be reviewed by qualified legal counsel before use in actual legal matters. 
        The platform does not constitute legal advice, attorney-client relationship, or a substitute for professional legal judgment.
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════
   SKILLS VIEW — Browse & Filter All Skills
   ════════════════════════════════════════════════ */
function SkillsView({ initialArea }) {
  const [filter, setFilter] = useState(initialArea || 'all')
  const [search, setSearch] = useState('')
  const skillsRef = useFadeIn()

  const filtered = PRACTICE_AREAS.filter((a) => filter === 'all' || a.id === filter)

  const allSkills = filtered.flatMap((area) =>
    area.skills.map((s) => ({ ...s, areaId: area.id, areaName: area.name, areaColor: area.color, areaIcon: area.icon }))
  ).filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
  })

  return (
    <div ref={skillsRef} className="fade-wrapper">
      <div className="section-header">
        <h2 className="section-heading">
          Skills <span className="section-heading-accent">Browser</span>
        </h2>
        <p className="section-sub">Browse and search all {allSkills.length} legal skills across practice areas</p>
        <div className="section-divider" />
      </div>

      <div className="skills-toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search skills by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <div className="area-filter-chips">
          <button
            className={`filter-chip ${filter === 'all' ? 'filter-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Areas
          </button>
          {PRACTICE_AREAS.map((a) => (
            <button
              key={a.id}
              className={`filter-chip ${filter === a.id ? 'filter-active' : ''}`}
              style={{ '--chip-color': a.color }}
              onClick={() => setFilter(a.id)}
            >
              {a.icon} {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="skill-panel">
        {allSkills.map((skill, idx) => (
          <div key={`${skill.areaId}-${skill.id}`} className={`skill-item ${idx === 0 ? 'active' : ''}`}>
            <span className="skill-rank-num">{(idx + 1).toString().padStart(2, '0')}</span>
            <div className="skill-dot" style={{ background: skill.areaColor }} />
            <div className="skill-info">
              <div className="skill-name">
                {skill.name}
                {skill.tag === 'setup' && <span className="skill-setup-tag">SETUP</span>}
              </div>
              <div className="skill-desc">{skill.desc}</div>
            </div>
            <span
              className="skill-area-badge"
              style={{
                background: `${skill.areaColor}15`,
                color: skill.areaColor,
                border: `1px solid ${skill.areaColor}25`,
              }}
            >
              {skill.areaIcon} {skill.areaName}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   CHAT VIEW — AI Legal Assistant
   ════════════════════════════════════════════════ */
function ChatView() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const messagesEndRef = useRef(null)
  const chatRef = useFadeIn()

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  const sendMessage = async () => {
    if (!input.trim() && files.length === 0) return
    const userMsg = { role: 'user', content: input, files, time: new Date().toLocaleTimeString() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setFiles([])
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `I've analyzed your request. As your legal AI assistant, I can help with:

• Contract review and redlining
• Regulatory compliance checks
• Legal research and case analysis
• Document drafting and formatting
• Risk assessment and triage

Please share a document or describe your legal question in detail.`,
          time: new Date().toLocaleTimeString(),
        },
      ])
      setLoading(false)
    }, 1500)
  }

  const quickPrompts = [
    'Review this NDA',
    'Check compliance risks',
    'Draft a demand letter',
    'Analyze litigation strategy',
  ]

  return (
    <div ref={chatRef} className="fade-wrapper">
      <div className="chat-layout">
        <div className="chat-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Active Skill</div>
            <div className="active-skill-card">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>General Legal Assistant</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                Ask any legal question or upload documents for analysis
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Upload Documents</div>
            <div className="upload-zone">
              <div className="upload-text">📎 Drop files here</div>
              <div className="upload-hint">PDF, DOCX, TXT — up to 5MB</div>
            </div>
            {files.length > 0 && (
              <div className="file-chips">
                {files.map((f, i) => (
                  <span key={i} className="file-chip">
                    <strong>📄</strong> {f.name}
                    <span className="file-remove" onClick={() => setFiles(files.filter((_, j) => j !== i))}>✕</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Export</div>
            <div className="export-btns">
              <button className="btn btn-sm btn-ghost">📥 Download Chat</button>
              <button className="btn btn-sm btn-ghost">📄 Export as PDF</button>
            </div>
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <span className="chat-title">💬 Legal Assistant</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Claude for Legal</span>
          </div>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="empty-icon">⚖️</div>
                <div className="empty-title">Start a Legal Conversation</div>
                <div className="empty-desc">
                  Ask questions, upload contracts, or request legal analysis. 
                  The AI will respond with structured, cited legal intelligence.
                </div>
                <div className="api-warning">
                  ⚠️ Connect your ANTHROPIC_API_KEY to enable live AI responses
                </div>
                <div className="quick-prompts">
                  {quickPrompts.map((p) => (
                    <button key={p} className="btn btn-sm" onClick={() => { setInput(p); }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role}`}>
                  {msg.files?.length > 0 && (
                    <div className="msg-files">
                      {msg.files.map((f, j) => (
                        <span key={j} className="file-chip"><strong>📄</strong> {f.name}</span>
                      ))}
                    </div>
                  )}
                  <div className="msg-text">{msg.content}</div>
                  <div className="msg-time">{msg.time}</div>
                </div>
              ))
            )}
            {loading && (
              <div className="msg assistant loading-msg">
                <div className="loading-dots"><span /><span /><span /></div>
                <span className="loading-text">Analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-wrap">
            <div className="input-row">
              <textarea
                className="chat-textarea"
                placeholder="Ask a legal question or paste contract text..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                rows={2}
              />
              <button className="btn btn-gold" onClick={sendMessage} disabled={loading || (!input.trim() && files.length === 0)}>
                Send ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   DOCUMENTS VIEW — Legal Document Viewer
   ════════════════════════════════════════════════ */
function DocumentsView() {
  const [activeDoc, setActiveDoc] = useState(0)
  const docsRef = useFadeIn()

  return (
    <div ref={docsRef} className="fade-wrapper">
      <div className="section-header">
        <h2 className="section-heading">
          Document <span className="section-heading-accent">Vault</span>
        </h2>
        <p className="section-sub">Sample legal documents and vulnerability assessment reports</p>
        <div className="section-divider" />
      </div>
      <div className="doc-layout">
        <div className="doc-sidebar">
          {SAMPLE_DOCS.map((doc, i) => (
            <div key={i} className={`doc-item ${activeDoc === i ? 'active' : ''}`} onClick={() => setActiveDoc(i)}>
              <div className="doc-item-name">
                <span style={{ marginRight: 8 }}>
                  {doc.type === 'contract' ? '📜' : doc.type === 'privacy' ? '🔒' : '⚖️'}
                </span>
                {doc.name}
              </div>
              <span className={`badge badge-${doc.type}`}>{doc.type}</span>
            </div>
          ))}
        </div>
        <div className="doc-main">
          <div className="doc-header">
            <div className="doc-title">{SAMPLE_DOCS[activeDoc].name}</div>
            <div className="doc-actions">
              <button className="btn btn-sm btn-ghost">📋 Copy</button>
              <button className="btn btn-sm btn-gold">📥 Download</button>
            </div>
          </div>
          <pre className="doc-preview">{SAMPLE_DOCS[activeDoc].content}</pre>
        </div>
      </div>

      {/* VULNERABILITY REPORT */}
      <div style={{ marginTop: 40 }}>
        <div className="section-header">
          <h2 className="section-heading">
            Security <span className="section-heading-accent">Assessment</span>
          </h2>
          <p className="section-sub">Vulnerability scan results and compliance status</p>
          <div className="section-divider" />
        </div>
        <div className="vuln-list">
          {VULN_REPORT.map((v, i) => (
            <div key={i} className={`vuln-item vuln-${v.severity}`}>
              <div className="vuln-badges">
                <span className={`badge badge-sev-${v.severity}`}>{v.severity}</span>
                <span className={`badge badge-${v.status}`}>{v.status}</span>
              </div>
              <div className="vuln-title">{v.title}</div>
              <div className="vuln-desc">{v.desc}</div>
            </div>
          ))}
          <div className="vuln-summary">
            <div className="vuln-stat"><div className="vuln-dot" style={{ background: 'var(--green)' }} /> Pass: {VULN_REPORT.filter(v => v.status === 'pass').length}</div>
            <div className="vuln-stat"><div className="vuln-dot" style={{ background: 'var(--gold)' }} /> Warn: {VULN_REPORT.filter(v => v.status === 'warn').length}</div>
            <div className="vuln-stat"><div className="vuln-dot" style={{ background: 'var(--red)' }} /> Fail: {VULN_REPORT.filter(v => v.status === 'fail').length}</div>
          </div>
          <div className="assessment-box">
            <div className="assessment-title">✅ Overall Assessment</div>
            <div className="assessment-text">
              The codebase demonstrates strong security posture with closed-schema validation, 
              input sanitization, and privilege isolation. Two low-severity items noted: 
              bypassable denylist (mitigated by schema validation) and non-OS-enforced audit logs. 
              No critical vulnerabilities detected.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   COMPARE VIEW — Document Comparison
   ════════════════════════════════════════════════ */
function CompareView() {
  const [activePair, setActivePair] = useState(0)
  const [mode, setMode] = useState('side-by-side')
  const compareRef = useFadeIn()

  const pair = COMPARE_PAIRS[activePair]

  return (
    <div ref={compareRef} className="fade-wrapper">
      <div className="section-header">
        <h2 className="section-heading">
          Compare & <span className="section-heading-accent">Comply</span>
        </h2>
        <p className="section-sub">Compare vendor documents against your standard templates</p>
        <div className="section-divider" />
      </div>

      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'side-by-side' ? 'mode-active' : ''}`} onClick={() => setMode('side-by-side')}>Side-by-Side</button>
        <button className={`mode-tab ${mode === 'diff' ? 'mode-active' : ''}`} onClick={() => setMode('diff')}>Diff View</button>
      </div>

      <div className="compare-samples">
        <div className="sample-pair-chips">
          {COMPARE_PAIRS.map((p, i) => (
            <button
              key={p.id}
              className={`filter-chip ${activePair === i ? 'filter-active' : ''}`}
              onClick={() => setActivePair(i)}
            >
              {p.icon} {p.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="compare-upload-box compare-org">
          <span className="compare-label">📄 Vendor Document</span>
          <div className="compare-file-info">
            <span className="compare-file-name">{pair.vendor.name}</span>
            <span className="compare-ready">✓ Ready</span>
          </div>
        </div>
        <div className="compare-upload-box">
          <span className="compare-label">📋 Your Standard</span>
          <div className="compare-file-info">
            <span className="compare-file-name">{pair.org.name}</span>
            <span className="compare-ready">✓ Ready</span>
          </div>
        </div>
      </div>

      <button className="btn btn-gold compare-btn">🔍 Run Comparison Analysis</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div className="doc-main">
          <div className="doc-header">
            <div className="doc-title" style={{ color: 'var(--red-soft)' }}>{pair.vendor.label}</div>
          </div>
          <pre className="doc-preview" style={{ fontSize: 12 }}>{pair.vendor.content}</pre>
        </div>
        <div className="doc-main">
          <div className="doc-header">
            <div className="doc-title" style={{ color: 'var(--blue-soft)' }}>{pair.org.label}</div>
          </div>
          <pre className="doc-preview" style={{ fontSize: 12 }}>{pair.org.content}</pre>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   AGENTS VIEW — Managed Agent Runner
   ════════════════════════════════════════════════ */
function AgentsView() {
  const agentsRef = useFadeIn()

  const agentSamples = [
    { name: 'Renewal Watcher', desc: 'Scans contract register for upcoming renewal deadlines', sample: SAMPLE_CONTRACT_REGISTER, area: 'commercial' },
    { name: 'Reg Monitor', desc: 'Polls regulatory feeds and writes weekly digests', sample: SAMPLE_REG_UPDATES, area: 'regulatory' },
    { name: 'Launch Radar', desc: 'Watches product launch trackers for legal review items', sample: SAMPLE_LAUNCH_ITEMS, area: 'product' },
  ]

  return (
    <div ref={agentsRef} className="fade-wrapper">
      <div className="section-header">
        <h2 className="section-heading">
          Agent <span className="section-heading-accent">Runner</span>
        </h2>
        <p className="section-sub">Deploy autonomous AI agents to monitor and act on legal workflows</p>
        <div className="section-divider" />
      </div>

      <div className="agent-runner-grid">
        {agentSamples.map((agent, i) => (
          <div key={i} className="agent-runner-card">
            <div className="agent-runner-header">
              <div>
                <div className="agent-runner-name">🤖 {agent.name}</div>
                <div className="agent-runner-desc">{agent.desc}</div>
              </div>
              <span className="agent-status agent-done">● READY</span>
            </div>
            <div className="agent-runner-body">
              <div className="agent-runner-actions">
                <button className="btn btn-gold">▶ Run Agent</button>
                <span className="agent-sample-info">📄 Sample data loaded</span>
              </div>
              <div className="agent-upload-row">
                <div className="upload-zone agent-upload-btn" style={{ padding: 12, flex: 1 }}>
                  <div className="upload-text">📎 Upload your data</div>
                </div>
                <span className="agent-or">or</span>
                <button className="btn btn-ghost">Use Sample</button>
              </div>
            </div>
            <div className="agent-results">
              <div className="agent-results-meta">
                <span>Last run: Never</span>
                <span>Status: Idle</span>
                <span>Schedule: On-demand</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   GUIDE VIEW — User Documentation
   ════════════════════════════════════════════════ */
function GuideView() {
  const guideRef = useFadeIn()

  const guides = [
    {
      icon: '🚀', title: 'Getting Started', headerClass: 'guide-header-1',
      content: 'Lexicon AI is your unified legal intelligence workspace. Start by exploring the 12 practice areas, each containing specialized AI skills for different legal domains.',
      areas: PRACTICE_AREAS.slice(0, 6).map(a => ({ name: a.name, desc: a.desc, color: a.color })),
    },
    {
      icon: '💬', title: 'Using Chat', headerClass: 'guide-header-2',
      content: 'The Chat interface connects you directly to Claude for Legal. Upload documents, ask questions, or request analysis. All conversations are structured with proper legal citations.',
      examples: [
        { icon: '📜', text: 'Review this NDA for red flags' },
        { icon: '🔍', text: 'What are the compliance risks?' },
        { icon: '⚖️', text: 'Draft a demand letter for breach' },
      ],
    },
    {
      icon: '⚖️', title: 'Compare & Comply', headerClass: 'guide-header-3',
      content: 'Compare vendor documents against your standard templates. The AI highlights deviations, missing clauses, and risk items automatically.',
    },
    {
      icon: '🤖', title: 'Managed Agents', headerClass: 'guide-header-4',
      content: 'Autonomous agents monitor contracts, regulations, and launches 24/7. They alert you to deadlines, changes, and items needing legal review.',
    },
    {
      icon: '🔗', title: 'Integrations', headerClass: 'guide-header-5',
      content: 'Connect with your existing legal tech stack. Lexicon AI integrates with major platforms to pull and push data seamlessly.',
      connectors: CONNECTORS.slice(0, 10),
    },
    {
      icon: '🛡️', title: 'Security & Privacy', headerClass: 'guide-header-6',
      content: 'Your data stays secure. API keys are server-side only. Documents are processed with encryption. Audit logs track all agent actions.',
    },
  ]

  return (
    <div ref={guideRef} className="fade-wrapper">
      <div className="section-header">
        <h2 className="section-heading">
          User <span className="section-heading-accent">Guide</span>
        </h2>
        <p className="section-sub">Learn how to get the most from Lexicon AI</p>
        <div className="section-divider" />
      </div>

      <div className="guide-grid">
        {guides.map((g, i) => (
          <div key={i} className="guide-card">
            <div className={`guide-card-header ${g.headerClass}`}>
              <span className="guide-card-icon">{g.icon}</span>
              <h3>{g.title}</h3>
            </div>
            <div className="guide-card-body">
              <p>{g.content}</p>
              {g.areas && (
                <>
                  <p className="guide-what">Practice Areas:</p>
                  <div className="guide-areas-list">
                    {g.areas.map((a, j) => (
                      <div key={j} className="guide-area-chip" style={{ borderLeftColor: a.color }}>
                        <div>
                          <strong>{a.name}</strong>
                          <span className="guide-area-desc">{a.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {g.examples && (
                <>
                  <p className="guide-what">Example Prompts:</p>
                  <div className="guide-examples">
                    {g.examples.map((ex, j) => (
                      <div key={j} className="guide-example">
                        <span className="guide-ex-icon">{ex.icon}</span>
                        <div><strong>Try:</strong> "{ex.text}"</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {g.connectors && (
                <>
                  <p className="guide-what">Supported Integrations:</p>
                  <div className="guide-connectors-grid">
                    {g.connectors.map((c, j) => (
                      <span key={j} className="guide-connector-chip">{c}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   AUTH GATE — Login Screen
   ════════════════════════════════════════════════ */
function AuthGate({ onAuth }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === 'LEXICON2026') {
      onAuth()
    } else {
      setError('Invalid access code. Please try again.')
    }
  }

  return (
    <div className="auth-gate">
      <div className="auth-card">
        <div className="auth-icon">⚖️</div>
        <div className="auth-title">Lexicon AI</div>
        <div className="auth-desc">
          Legal Intelligence Platform — Secure Access Required
        </div>
        <form onSubmit={handleSubmit}>
          <div className="auth-input-row">
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••••••"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError('') }}
              maxLength={20}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px' }}>
            🔐 Access Platform
          </button>
        </form>
        <div className="auth-demo-hint">
          <span className="auth-hint-label">Demo Access</span>
          <div className="auth-hint-text">
            Use code <strong style={{ color: 'var(--gold)' }}>LEXICON2026</strong> to explore the platform.
            <br />All AI features require ANTHROPIC_API_KEY configuration.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   MAIN APP — Router & Shell
   ════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState('home')
  const [auth, setAuth] = useState(false)
  const [skillArea, setSkillArea] = useState(null)

  const navigate = (t, area = null) => {
    setTab(t)
    if (area) setSkillArea(area)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!auth) {
    return (
      <div className="app">
        <div className="grain-overlay" />
        <div className="ambient-glow" />
        <AuthGate onAuth={() => setAuth(true)} />
      </div>
    )
  }

  return (
    <div className="app">
      <div className="grain-overlay" />
      <div className="ambient-glow" />

      {/* NAVIGATION */}
      <div className="nav-wrap">
        <div className="nav">
          <div className="logo">
            <div className="logo-text">⚖️ LEXICON</div>
            <div className="logo-sub">Legal Intelligence Platform</div>
          </div>
          <div className="nav-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`nav-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => navigate(t.id)}
              >
                <span className="tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          <div className="nav-status">
            <div className="status-dot ok" />
            <span className="status-text">System Online</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="main">
        {tab === 'home' && <HomeView onNavigate={navigate} />}
        {tab === 'skills' && <SkillsView initialArea={skillArea} />}
        {tab === 'chat' && <ChatView />}
        {tab === 'documents' && <DocumentsView />}
        {tab === 'compare' && <CompareView />}
        {tab === 'agents' && <AgentsView />}
        {tab === 'guide' && <GuideView />}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <span>⚖️ Lexicon AI</span>
          <span className="footer-divider">|</span>
          <span>Legal Intelligence Platform</span>
          <span className="footer-divider">|</span>
          <span>Powered by Claude for Legal</span>
          <span className="footer-divider">|</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  )
}
