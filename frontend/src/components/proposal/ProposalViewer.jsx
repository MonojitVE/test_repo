import { useMemo } from 'react';
import './ProposalViewer.css';

// Section headings the backend produces (mirrors pdf_generator.py SECTION_HEADING_RE)
const HEADING_PATTERNS = [
  /^\d+\s+[A-Z][A-Z\s&/]+$/,
  /^CONTENTS$/,
  /^COMPANY OVERVIEW$/,
  /^PURPOSE OF THE DOCUMENT$/,
  /^KEY DELIVERABLES$/,
  /^OBJECTIVES$/,
  /^FEATURES AND FUNCTIONALITY$/,
  /^TECHNICAL APPROACH$/,
  /^TECHNOLOGY STACK$/,
  /^FUTURE SCOPE$/,
  /^TIME AND BUDGET ESTIMATE$/,
];

const SUBSECTION_RE = /^(Frontend|Backend|Database|Architecture|Integrations|Security|DevOps|Workflow|Overview|Timeline|Phases|Budget|Other Tools):\s*/;
const NUMBERED_RE   = /^\d+[\.\)]\s+.+|^\d+\.\d+[\.\)]?\s+.+/;
const BULLET_RE     = /^[-•*]\s+.+/;

function isHeading(line) {
  return HEADING_PATTERNS.some(p => p.test(line.trim()));
}

function classifyLine(raw) {
  const stripped = raw.trim();
  if (!stripped) return { kind: 'empty', text: '' };
  if (isHeading(stripped)) return { kind: 'heading', text: stripped };
  if (SUBSECTION_RE.test(stripped)) return { kind: 'subsection', text: stripped };
  if (NUMBERED_RE.test(stripped)) return { kind: 'numbered', text: stripped };
  if (BULLET_RE.test(stripped)) return { kind: 'bullet', text: stripped.replace(/^[-•*]\s+/, '') };
  return { kind: 'body', text: stripped };
}

function parseProposal(text) {
  return text.split('\n').map((raw, i) => ({ ...classifyLine(raw), key: i }));
}

export default function ProposalViewer({ text }) {
  const lines = useMemo(() => parseProposal(text), [text]);

  return (
    <div className="pv">
      {lines.map(({ kind, text, key }) => {
        if (kind === 'empty') return <div key={key} className="pv__spacer" />;
        if (kind === 'heading') return (
          <div key={key} className="pv__heading-wrap">
            <h2 className="pv__heading">{text}</h2>
            <div className="pv__heading-rule" />
          </div>
        );
        if (kind === 'subsection') return (
          <h3 key={key} className="pv__subsection">{text}</h3>
        );
        if (kind === 'numbered') return (
          <p key={key} className="pv__numbered">{text}</p>
        );
        if (kind === 'bullet') return (
          <div key={key} className="pv__bullet">
            <span className="pv__bullet-dot" aria-hidden="true" />
            <span>{text}</span>
          </div>
        );
        return <p key={key} className="pv__body">{text}</p>;
      })}
    </div>
  );
}
