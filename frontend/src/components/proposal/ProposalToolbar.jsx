import Button from '../ui/Button';
import Badge from '../ui/Badge';
import './ProposalToolbar.css';

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

export default function ProposalToolbar({
  onDownloadPdf,
  onRegenerate,
  onCopy,
  onEdit,
  pdfLoading,
  copied,
  clientName,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <Badge variant="success">✓ Generated</Badge>
        {clientName && (
          <span className="toolbar__client">
            for <strong>{clientName}</strong>
          </span>
        )}
      </div>

      <div className="toolbar__actions">
        <Button
          variant="ghost"
          size="sm"
          icon={<CopyIcon />}
          onClick={onCopy}
        >
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          icon={<EditIcon />}
          onClick={onEdit}
        >
          Edit
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshIcon />}
          onClick={onRegenerate}
        >
          Regenerate
        </Button>

        <Button
          variant="primary"
          size="sm"
          icon={<DownloadIcon />}
          loading={pdfLoading}
          onClick={onDownloadPdf}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
