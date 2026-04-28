import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import ProposalToolbar from "../components/proposal/ProposalToolbar";
import ProposalViewer from "../components/proposal/ProposalViewer";
import Button from "../components/ui/Button";
import { triggerDownload } from "../services/api";
import { generateProposalPdf } from "../services/pdfGenerator";
import { parseProposalText } from "../services/proposalParser";
import "./ProposalPage.css";

export default function ProposalPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    proposalText: initialText,
    clientName,
    formData,
    screenshots = [],
    demoLink = "",
    demoLabel = "",
  } = location.state || {};

  const [proposalText, setProposalText] = useState(initialText || "");
  const [editMode, setEditMode]         = useState(false);
  const [editDraft, setEditDraft]       = useState(initialText || "");
  const [pdfLoading, setPdfLoading]     = useState(false);
  const [copied, setCopied]             = useState(false);
  const [pdfError, setPdfError]         = useState("");

  useEffect(() => {
    if (!initialText) navigate("/generate", { replace: true });
  }, [initialText, navigate]);

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    setPdfError("");
    try {
      const cleanText = parseProposalText(proposalText);
      const blob = await generateProposalPdf(cleanText, {
        projectTitle: formData?.project_name || "Project Proposal",
        preparedBy:   "Virtual Employee",
        clientName:   clientName || "",
        date:         new Date().toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        }),
        screenshots,
        demoLink:  demoLink.trim(),
        demoLabel: demoLabel.trim() || "Project Demo",
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
  }, [proposalText, clientName, formData, screenshots, demoLink, demoLabel]);

  const handleCopy = useCallback(async () => {
    const cleanText = parseProposalText(proposalText);
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
  }, [proposalText]);

  const handleEditToggle = () => {
    if (editMode) setEditDraft(proposalText);
    setEditMode((e) => !e);
  };

  const handleSaveEdit = () => {
    setProposalText(editDraft);
    setEditMode(false);
  };

  const handleRegenerate = () => {
    navigate("/generate", { state: { prefill: formData } });
  };

  if (!initialText) return null;

  // ── Build sidebar TOC ────────────────────────────────────────────────────
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

  const tocItems = screenshots.length > 0
    ? [...baseToc.slice(0, -1), "Demo Screenshots", baseToc[baseToc.length - 1]]
    : baseToc;

  return (
    <PageShell>
      <div className="proposal-page">

        {/* Breadcrumb */}
        <div className="proposal-page__breadcrumb">
          <button className="proposal-page__back" onClick={() => navigate("/generate")}>
            ← New Proposal
          </button>
          <span className="proposal-page__breadcrumb-sep">/</span>
          <span className="proposal-page__breadcrumb-current">
            {clientName ? `${clientName} — Proposal` : "Generated Proposal"}
          </span>
        </div>

        {/* Toolbar */}
        <ProposalToolbar
          onDownloadPdf={handleDownloadPdf}
          onRegenerate={handleRegenerate}
          onCopy={handleCopy}
          onEdit={handleEditToggle}
          pdfLoading={pdfLoading}
          copied={copied}
          clientName={clientName}
        />

        {pdfError && (
          <div className="proposal-page__error" role="alert">⚠ {pdfError}</div>
        )}

        {/* Content */}
        <div className="proposal-page__body">

          {/* TOC sidebar */}
          <aside className="proposal-page__toc">
            <p className="proposal-page__toc-label">Contents</p>
            {tocItems.map((s, i) => (
              <a
                key={s}
                href={s === "Demo Screenshots" ? "#section-screenshots" : `#section-${i}`}
                className="proposal-page__toc-item"
              >
                <span className="proposal-page__toc-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </a>
            ))}
            {demoLink.trim() && (
              <a href="#section-demo" className="proposal-page__toc-item">
                <span className="proposal-page__toc-num">🔗</span>
                {demoLabel.trim() || "Demo Link"}
              </a>
            )}
          </aside>

          {/* Editor / Viewer */}
          <div className="proposal-page__doc">
            {editMode ? (
              <div className="proposal-page__editor-wrap">
                <div className="proposal-page__editor-bar">
                  <span className="proposal-page__editor-label">
                    ✏ Edit Mode — changes apply to PDF download
                  </span>
                  <div className="proposal-page__editor-actions">
                    <Button variant="ghost" size="sm" onClick={handleEditToggle}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSaveEdit}>Save Changes</Button>
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
              <div className="proposal-page__viewer">
                <ProposalViewer text={proposalText} screenshots={screenshots} />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}