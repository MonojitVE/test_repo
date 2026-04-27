import { useMemo } from "react";
import { parseProposal } from "../../services/proposalParser";
import "./ProposalViewer.css";

function SectionItem({ item }) {
  switch (item.type) {
    case "spacer":
      return <div className="pv__spacer" />;
    case "subsection":
      return <h3 className="pv__subsection">{item.text}</h3>;
    case "bullet":
      return (
        <div className="pv__bullet">
          <span className="pv__bullet-dot" aria-hidden="true" />
          <span>{item.text}</span>
        </div>
      );
    case "body":
      return <p className="pv__body">{item.text}</p>;
    default:
      return null;
  }
}

export default function ProposalViewer({ text }) {
  const { sections } = useMemo(() => parseProposal(text || ""), [text]);

  if (!sections.length) return null;

  return (
    <div className="pv">
      {sections.map((section, si) => (
        <div key={si} className="pv__section" id={`section-${si}`}>
          {/* Section heading — only if it has a title */}
          {section.title && (
            <div className="pv__heading-wrap">
              <h2 className="pv__heading">
                {section.num && (
                  <span className="pv__heading-num">{section.num}</span>
                )}
                {section.title}
              </h2>
              <div className="pv__heading-rule" />
            </div>
          )}

          {/* Section content */}
          <div className="pv__content">
            {section.items.map((item, ii) => (
              <SectionItem key={ii} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
