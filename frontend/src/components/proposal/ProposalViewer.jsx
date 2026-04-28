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

export default function ProposalViewer({ text, screenshots = [] }) {
  const { sections } = useMemo(() => parseProposal(text || ""), [text]);

  if (!sections.length && !screenshots.length) return null;

  const hasScreenshots = screenshots.length > 0;

  // Screenshots injects before the 2nd-to-last section (TIME AND BUDGET).
  // It takes that section's original number.
  // TIME AND BUDGET and FUTURE SCOPE each get their original number + 1.
  const injectBeforeIndex = sections.length - 2; // second-to-last
  const screenshotNum = hasScreenshots
    ? (sections[injectBeforeIndex]?.num ?? injectBeforeIndex + 1)
    : null;

  return (
    <div className="pv">
      {sections.map((section, si) => {
        // Any section at or after the inject point gets its number bumped by 1
        const isBumped = hasScreenshots && si >= injectBeforeIndex;
        const displayNum = isBumped
          ? section.num
            ? String(Number(section.num) + 1)
            : null
          : section.num;

        return (
          <>
            {/* Inject screenshots before the second-to-last section */}
            {si === injectBeforeIndex && hasScreenshots && (
              <div
                key="screenshots"
                className="pv__section"
                id="section-screenshots"
              >
                <div className="pv__heading-wrap">
                  <h2 className="pv__heading">
                    <span className="pv__heading-num">{screenshotNum}</span>
                    DEMO SCREENSHOTS
                  </h2>
                  <div className="pv__heading-rule" />
                </div>
                <div className="pv__screenshots">
                  {screenshots.map((s, i) => (
                    <div key={i} className="pv__screenshot">
                      <img
                        src={s.dataUrl}
                        alt={s.name || `Screenshot ${i + 1}`}
                        className="pv__screenshot-img"
                      />
                      <p className="pv__screenshot-caption">
                        {s.name || `Screenshot ${i + 1}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular section */}
            <div key={si} className="pv__section" id={`section-${si}`}>
              {section.title && (
                <div className="pv__heading-wrap">
                  <h2 className="pv__heading">
                    {displayNum && (
                      <span className="pv__heading-num">{displayNum}</span>
                    )}
                    {section.title}
                  </h2>
                  <div className="pv__heading-rule" />
                </div>
              )}
              <div className="pv__content">
                {section.items.map((item, ii) => (
                  <SectionItem key={ii} item={item} />
                ))}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
