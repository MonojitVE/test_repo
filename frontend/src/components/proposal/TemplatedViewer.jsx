import ProposalViewer from "./ProposalViewer";
import "./TemplatedViewer.css";

function BorderOverlay({ style, color }) {
  const c = color || "#2980B9";
  switch (style) {
    case "simple":
      return (
        <div className="tv__border tv__border--simple" style={{ "--bc": c }} />
      );
    case "double":
      return (
        <div className="tv__border tv__border--double" style={{ "--bc": c }} />
      );
    case "corner":
      return (
        <div className="tv__border tv__border--corner" style={{ "--bc": c }}>
          <span className="tv__corner tv__corner--tl" />
          <span className="tv__corner tv__corner--tr" />
          <span className="tv__corner tv__corner--br" />
          <span className="tv__corner tv__corner--bl" />
        </div>
      );
    case "accent":
      return (
        <div className="tv__border tv__border--accent" style={{ "--bc": c }} />
      );
    default:
      return null;
  }
}

function SlotImages({ slotImages }) {
  if (!slotImages) return null;
  return (
    <>
      {slotImages.topRight?.dataUrl && (
        <div className="tv__slot tv__slot--topright">
          <img src={slotImages.topRight.dataUrl} alt="" />
        </div>
      )}
      {slotImages.bottomLeft?.dataUrl && (
        <div className="tv__slot tv__slot--bottomleft">
          <img src={slotImages.bottomLeft.dataUrl} alt="" />
        </div>
      )}
      {slotImages.fullBg?.dataUrl && (
        <div className="tv__slot tv__slot--fullbg">
          <img src={slotImages.fullBg.dataUrl} alt="" />
        </div>
      )}
      {slotImages.rightSidebar?.dataUrl && (
        <div className="tv__slot tv__slot--rightsidebar">
          <img src={slotImages.rightSidebar.dataUrl} alt="" />
        </div>
      )}
      {slotImages.headerBanner?.dataUrl && (
        <div className="tv__slot tv__slot--headerbanner">
          <img src={slotImages.headerBanner.dataUrl} alt="" />
        </div>
      )}
    </>
  );
}

export default function TemplatedViewer({ data, text, screenshots, template }) {
  const t = template || { id: "default" };
  const wrapperStyle = {};
  if (t.id === "rich" && t.bgColor && t.bgColor !== "#ffffff") {
    wrapperStyle.backgroundColor = t.bgColor;
  }

  return (
    <div className={`tv tv--${t.id}`} style={wrapperStyle}>
      {(t.id === "border" || t.id === "rich") && t.borderStyle && (
        <BorderOverlay style={t.borderStyle} color={t.borderColor} />
      )}
      {t.id === "rich" && <SlotImages slotImages={t.slotImages} />}
      <div className="tv__content">
        {/* Pass data (new JSON) or text (legacy) to ProposalViewer */}
        <ProposalViewer data={data} text={text} screenshots={screenshots} />
      </div>
    </div>
  );
}
