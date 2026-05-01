import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import ProposalToolbar from "../components/proposal/ProposalToolbar";
import TemplatedViewer from "../components/proposal/TemplatedViewer";
import Button from "../components/ui/Button";
import { triggerDownload } from "../services/api";
import { generateProposalPdf } from "../services/pdfGenerator";
import { parseProposalText } from "../services/proposalParser";
import "./ProposalPage.css";

const DEFAULT_TEMPLATE = {
  id: "default",
  borderStyle: "simple",
  borderColor: "#2980B9",
  bgColor: "#ffffff",
  slotImages: {},
};

const DownloadIcon = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function ProposalPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    proposalData,
    projectName = "",
    clientName,
    formData,
    screenshots = [],
    demoLink = "",
    demoLabel = "",
  } = location.state || {};

  const [editDraft, setEditDraft] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!proposalData) navigate("/generate", { replace: true });
  }, [proposalData, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeData = editedData ?? proposalData;

  // ── Smooth scroll to anchor without React Router interference ──
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    setPdfError("");
    try {
      const cleanText = parseProposalText(activeData);
      const blob = await generateProposalPdf(cleanText, {
        projectTitle: projectName || "Project Proposal",
        preparedBy: "Virtual Employee",
        clientName: clientName || "",
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        screenshots,
        demoLink: demoLink.trim(),
        demoLabel: demoLabel.trim() || "Project Demo",
        template,
      });
      const slug = clientName
        ? clientName.replace(/\s+/g, "_").toLowerCase()
        : "proposal";
      triggerDownload(blob, `${slug}_proposal.pdf`);
    } catch (e) {
      setPdfError(e.message || "PDF generation failed.");
    } finally {
      setPdfLoading(false);
    }
  }, [
    activeData,
    clientName,
    projectName,
    screenshots,
    demoLink,
    demoLabel,
    template,
  ]);

  const handleCopy = useCallback(async () => {
    const cleanText = parseProposalText(activeData);
    try {
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = cleanText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [activeData]);

  const handleEditToggle = () => {
    if (!editMode) {
      setEditDraft(parseProposalText(activeData));
    } else {
      setEditDraft("");
    }
    setEditMode((e) => !e);
  };

  const handleSaveEdit = () => {
    setEditedData(editDraft);
    setEditMode(false);
  };

  const handleRegenerate = () =>
    navigate("/generate", { state: { prefill: formData } });

  if (!proposalData) return null;

  const baseToc = [
    "Company Overview",
    "Purpose of Document",
    "Key Deliverables",
    "Objectives",
    "Features & Functionality",
    "Technical Approach",
    "Technology Stack",
    "Future Scope",
    "Time & Budget Estimate",
  ];
  const tocItems =
    screenshots.length > 0
      ? [
          ...baseToc.slice(0, -1),
          "Demo Screenshots",
          baseToc[baseToc.length - 1],
        ]
      : baseToc;

  return (
    <PageShell>
      <div className="proposal-page">
        {/* ── Breadcrumb ── */}
        <div className="proposal-page__breadcrumb">
          <button
            className="proposal-page__back"
            onClick={() => navigate("/generate")}
          >
            ← New Proposal
          </button>
          <span className="proposal-page__breadcrumb-sep">/</span>
          <span className="proposal-page__breadcrumb-current">
            {clientName ? `${clientName} — Proposal` : "Generated Proposal"}
          </span>
        </div>

        <ProposalToolbar
          onDownloadPdf={handleDownloadPdf}
          onRegenerate={handleRegenerate}
          onCopy={handleCopy}
          onEdit={handleEditToggle}
          pdfLoading={pdfLoading}
          copied={copied}
          clientName={clientName}
          template={template}
          onTemplateChange={setTemplate}
        />

        {pdfError && (
          <div className="proposal-page__error" role="alert">
            ⚠ {pdfError}
          </div>
        )}

        <div className="proposal-page__body">
          {/* ── TOC ── */}
          <aside className="proposal-page__toc">
            <p className="proposal-page__toc-label">Contents</p>
            {tocItems.map((s, i) => {
              const href =
                s === "Demo Screenshots"
                  ? "#section-screenshots"
                  : `#section-${i}`;
              return (
                <a
                  key={s}
                  href={href}
                  className="proposal-page__toc-item"
                  onClick={(e) => scrollToSection(e, href)}
                >
                  <span className="proposal-page__toc-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s}
                </a>
              );
            })}
            {demoLink.trim() && (
              <a
                href="#section-demo"
                className="proposal-page__toc-item"
                onClick={(e) => scrollToSection(e, "#section-demo")}
              >
                <span className="proposal-page__toc-num">🔗</span>
                {demoLabel.trim() || "Demo Link"}
              </a>
            )}
          </aside>

          {/* ── Document ── */}
          <div className="proposal-page__doc">
            {editMode ? (
              <div className="proposal-page__editor-wrap">
                <div className="proposal-page__editor-bar">
                  <span className="proposal-page__editor-label">
                    ✏ Edit Mode — changes apply to PDF download
                  </span>
                  <div className="proposal-page__editor-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
                <textarea
                  className="proposal-page__editor"
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  spellCheck={false}
                  aria-label="Edit proposal text"
                />
              </div>
            ) : (
              <TemplatedViewer
                data={activeData}
                screenshots={screenshots}
                template={template}
              />
            )}
          </div>
        </div>

        {/* ── Bottom Download Button ── */}
        <div className="proposal-page__bottom-actions">
          <Button
            variant="primary"
            size="lg"
            icon={<DownloadIcon />}
            loading={pdfLoading}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
        </div>

        {/* ── Go To Top Button ── */}
        {showScrollTop && (
          <button
            className="proposal-page__scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑
          </button>
        )}
      </div>
    </PageShell>
  );
}
