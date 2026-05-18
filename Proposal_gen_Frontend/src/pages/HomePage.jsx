import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import "./HomePage.css";

const SECTIONS = [
  { icon: "📋", label: "Purpose of Document" },
  { icon: "📦", label: "Key Deliverables" },
  { icon: "🎯", label: "Objectives" },
  { icon: "⚙️", label: "Features & Functionality" },
  { icon: "🏗️", label: "Technical Approach" },
  { icon: "🛠️", label: "Technology Stack" },
  { icon: "🔭", label: "Future Scope" },
  { icon: "💰", label: "Time & Budget Estimate" },
];

const STEPS = [
  {
    num: "01",
    title: "Describe your project",
    desc: "Provide a description, project type, industry, timeline, and budget.",
  },
  {
    num: "02",
    title: "AI drafts each section",
    desc: "Our pipeline generates 8 sections individually for maximum quality and coherence.",
  },
  {
    num: "03",
    title: "Review & download",
    desc: "Edit the proposal in-browser, copy it as text, or download a branded PDF.",
  },
];

export default function HomePage() {
  return (
    <PageShell>
      <div className="home">
        {/* ── Hero ── */}
        <section className="home__hero">
          <div className="home__hero-eyebrow">
            <span className="home__hero-dot" />
            Powered by GPT-4o-mini
          </div>
          <h1 className="home__hero-title">
            Professional project proposals,
            <br />
            <em>generated in under a minute.</em>
          </h1>
          <p className="home__hero-sub">
            Describe your software project. Our AI pipeline drafts a complete,
            structured technical proposal — ready to send to clients.
          </p>
          <div className="home__hero-actions">
            <Link to="/generate" className="home__hero-cta">
              Start Generating
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <p className="home__hero-note">Free to use · No account needed</p>
          </div>
        </section>

        {/* ── Sections grid ── */}
        <section className="home__sections">
          <h2 className="home__section-label">
            What's included in every proposal
          </h2>
          <div className="home__sections-grid">
            {SECTIONS.map((s) => (
              <div key={s.label} className="home__section-card">
                <span className="home__section-icon">{s.icon}</span>
                <span className="home__section-name">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="home__how">
          <h2 className="home__section-label">How it works</h2>
          <div className="home__steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="home__step">
                <span className="home__step-num">{s.num}</span>
                <div>
                  <h3 className="home__step-title">{s.title}</h3>
                  <p className="home__step-desc">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="home__step-connector" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="home__banner">
          <div className="home__banner-inner">
            <h2 className="home__banner-title">Lets get started!</h2>
            <p className="home__banner-sub">
              Fill in a form. Get a proposal. Download the PDF.
            </p>
            <Link
              to="/generate"
              className="home__hero-cta home__hero-cta--white"
            >
              Generate Now
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
