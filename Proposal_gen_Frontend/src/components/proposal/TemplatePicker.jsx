import { useRef, useState } from "react";
import "./TemplatePicker.css";

// ── Border style previews ─────────────────────────────────────────────────────
const BORDER_STYLES = [
  { id: "simple", label: "Simple", desc: "Clean single line" },
  { id: "double", label: "Double", desc: "Classic double rule" },
  { id: "corner", label: "Corners", desc: "Bracket corners" },
  { id: "accent", label: "Accent", desc: "Bold left bar" },
];

// ── Image slot definitions ────────────────────────────────────────────────────
export const IMAGE_SLOTS = [
  { id: "topRight", label: "Top Right", desc: "Corner badge / logo area" },
  { id: "bottomLeft", label: "Bottom Left", desc: "Decorative corner element" },
  {
    id: "fullBg",
    label: "Full Background",
    desc: "Behind all text (low opacity)",
  },
  {
    id: "rightSidebar",
    label: "Right Sidebar",
    desc: "Vertical strip on right edge",
  },
  {
    id: "headerBanner",
    label: "Header Banner",
    desc: "Wide strip at top of each page",
  },
];

// ── Mini border preview SVGs ──────────────────────────────────────────────────
function BorderPreview({ style, color }) {
  const c = color || "#2980B9";
  const w = 60,
    h = 80;
  switch (style) {
    case "simple":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect
            x="3"
            y="3"
            width={w - 6}
            height={h - 6}
            fill="none"
            stroke={c}
            strokeWidth="1.5"
          />
        </svg>
      );
    case "double":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect
            x="2"
            y="2"
            width={w - 4}
            height={h - 4}
            fill="none"
            stroke={c}
            strokeWidth="1.2"
          />
          <rect
            x="5"
            y="5"
            width={w - 10}
            height={h - 10}
            fill="none"
            stroke={c}
            strokeWidth="0.7"
          />
        </svg>
      );
    case "corner":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          {/* TL */}
          <path
            d={`M 3 16 L 3 3 L 16 3`}
            fill="none"
            stroke={c}
            strokeWidth="2"
          />
          {/* TR */}
          <path
            d={`M ${w - 16} 3 L ${w - 3} 3 L ${w - 3} 16`}
            fill="none"
            stroke={c}
            strokeWidth="2"
          />
          {/* BR */}
          <path
            d={`M ${w - 3} ${h - 16} L ${w - 3} ${h - 3} L ${w - 16} ${h - 3}`}
            fill="none"
            stroke={c}
            strokeWidth="2"
          />
          {/* BL */}
          <path
            d={`M 16 ${h - 3} L 3 ${h - 3} L 3 ${h - 16}`}
            fill="none"
            stroke={c}
            strokeWidth="2"
          />
        </svg>
      );
    case "accent":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect x="2" y="2" width="4" height={h - 4} fill={c} rx="1" />
          <line x1="2" y1="3" x2={w - 2} y2="3" stroke={c} strokeWidth="1" />
          <line
            x1="2"
            y1={h - 3}
            x2={w - 2}
            y2={h - 3}
            stroke={c}
            strokeWidth="1"
          />
        </svg>
      );
    default:
      return null;
  }
}

// ── Slot preview thumbnails ───────────────────────────────────────────────────
function SlotPreview({ slotId, hasImage }) {
  const w = 50,
    h = 65;
  const fill = hasImage ? "#2980B9" : "#e2e8f0";
  switch (slotId) {
    case "topRight":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect width={w} height={h} fill="#f8fafc" rx="2" />
          <rect
            x={w * 0.55}
            y="2"
            width={w * 0.4}
            height={h * 0.25}
            fill={fill}
            rx="1"
            opacity="0.8"
          />
          <rect
            x="4"
            y={h * 0.3}
            width={w * 0.85}
            height="2.5"
            fill="#e2e8f0"
            rx="1"
          />
          <rect
            x="4"
            y={h * 0.42}
            width={w * 0.7}
            height="2"
            fill="#e2e8f0"
            rx="1"
          />
          <rect
            x="4"
            y={h * 0.52}
            width={w * 0.75}
            height="2"
            fill="#e2e8f0"
            rx="1"
          />
        </svg>
      );
    case "bottomLeft":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect width={w} height={h} fill="#f8fafc" rx="2" />
          <rect
            x="2"
            y={h * 0.72}
            width={w * 0.4}
            height={h * 0.24}
            fill={fill}
            rx="1"
            opacity="0.8"
          />
          <rect
            x="4"
            y="4"
            width={w * 0.85}
            height="2.5"
            fill="#e2e8f0"
            rx="1"
          />
          <rect x="4" y="10" width={w * 0.7} height="2" fill="#e2e8f0" rx="1" />
        </svg>
      );
    case "fullBg":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect width={w} height={h} fill={fill} rx="2" opacity="0.18" />
          <rect
            width={w}
            height={h}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="0.5"
            rx="2"
          />
          <rect
            x="4"
            y="8"
            width={w * 0.85}
            height="2.5"
            fill="#64748b"
            rx="1"
            opacity="0.5"
          />
          <rect
            x="4"
            y="14"
            width={w * 0.7}
            height="2"
            fill="#64748b"
            rx="1"
            opacity="0.4"
          />
          <rect
            x="4"
            y="20"
            width={w * 0.75}
            height="2"
            fill="#64748b"
            rx="1"
            opacity="0.4"
          />
        </svg>
      );
    case "rightSidebar":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect width={w} height={h} fill="#f8fafc" rx="2" />
          <rect
            x={w * 0.78}
            y="2"
            width={w * 0.18}
            height={h - 4}
            fill={fill}
            rx="1"
            opacity="0.7"
          />
          <rect
            x="4"
            y="8"
            width={w * 0.68}
            height="2.5"
            fill="#e2e8f0"
            rx="1"
          />
          <rect
            x="4"
            y="16"
            width={w * 0.55}
            height="2"
            fill="#e2e8f0"
            rx="1"
          />
        </svg>
      );
    case "headerBanner":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect width={w} height={h} fill="#f8fafc" rx="2" />
          <rect
            x="2"
            y="2"
            width={w - 4}
            height={h * 0.2}
            fill={fill}
            rx="1"
            opacity="0.7"
          />
          <rect
            x="4"
            y={h * 0.28}
            width={w * 0.85}
            height="2.5"
            fill="#e2e8f0"
            rx="1"
          />
          <rect
            x="4"
            y={h * 0.38}
            width={w * 0.7}
            height="2"
            fill="#e2e8f0"
            rx="1"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function TemplatePicker({ template, onChange }) {
  const fileRefs = useRef({});

  function update(patch) {
    onChange({ ...template, ...patch });
  }

  function handleSlotUpload(slotId, files) {
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      update({
        slotImages: {
          ...template.slotImages,
          [slotId]: { dataUrl: e.target.result, name: file.name },
        },
      });
    };
    reader.readAsDataURL(file);
  }

  function removeSlot(slotId) {
    const next = { ...template.slotImages };
    delete next[slotId];
    update({ slotImages: next });
  }

  return (
    <div className="tpicker">
      {/* ── Template selector ── */}
      <div className="tpicker__templates">
        {[
          { id: "default", label: "Default", desc: "Clean white" },
          { id: "border", label: "Border", desc: "Decorative borders" },
          { id: "rich", label: "Rich", desc: "Background + image slots" },
        ].map((t) => (
          <button
            key={t.id}
            className={`tpicker__template-btn ${template.id === t.id ? "tpicker__template-btn--active" : ""}`}
            onClick={() => update({ id: t.id })}
          >
            <span className="tpicker__template-name">{t.label}</span>
            <span className="tpicker__template-desc">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* ── Border options ── */}
      {(template.id === "border" || template.id === "rich") && (
        <div className="tpicker__section">
          <p className="tpicker__section-label">Border Style</p>
          <div className="tpicker__borders">
            {BORDER_STYLES.map((b) => (
              <button
                key={b.id}
                className={`tpicker__border-btn ${template.borderStyle === b.id ? "tpicker__border-btn--active" : ""}`}
                onClick={() => update({ borderStyle: b.id })}
                title={b.desc}
              >
                <BorderPreview
                  style={b.id}
                  color={template.borderColor || "#2980B9"}
                />
                <span className="tpicker__border-label">{b.label}</span>
              </button>
            ))}
          </div>

          <div className="tpicker__color-row">
            <label className="tpicker__color-label">Border Color</label>
            <input
              type="color"
              className="tpicker__color-input"
              value={template.borderColor || "#2980B9"}
              onChange={(e) => update({ borderColor: e.target.value })}
            />
            <span className="tpicker__color-value">
              {template.borderColor || "#2980B9"}
            </span>
          </div>
        </div>
      )}

      {/* ── Rich options: background color ── */}
      {template.id === "rich" && (
        <div className="tpicker__section">
          <p className="tpicker__section-label">Page Background</p>
          <div className="tpicker__color-row">
            <label className="tpicker__color-label">Background Color</label>
            <input
              type="color"
              className="tpicker__color-input"
              value={template.bgColor || "#ffffff"}
              onChange={(e) => update({ bgColor: e.target.value })}
            />
            <span className="tpicker__color-value">
              {template.bgColor || "#ffffff"}
            </span>
            <button
              className="tpicker__reset-btn"
              onClick={() => update({ bgColor: "#ffffff" })}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* ── Rich options: image slots ── */}
      {template.id === "rich" && (
        <div className="tpicker__section">
          <p className="tpicker__section-label">Layout Image Slots</p>
          <div className="tpicker__slots">
            {IMAGE_SLOTS.map((slot) => {
              const hasImage = !!template.slotImages?.[slot.id];
              return (
                <div
                  key={slot.id}
                  className={`tpicker__slot ${hasImage ? "tpicker__slot--filled" : ""}`}
                >
                  <div className="tpicker__slot-preview">
                    <SlotPreview slotId={slot.id} hasImage={hasImage} />
                  </div>
                  <div className="tpicker__slot-info">
                    <span className="tpicker__slot-name">{slot.label}</span>
                    <span className="tpicker__slot-desc">{slot.desc}</span>
                    {hasImage && (
                      <span className="tpicker__slot-file">
                        {template.slotImages[slot.id].name}
                      </span>
                    )}
                  </div>
                  <div className="tpicker__slot-actions">
                    <input
                      ref={(el) => (fileRefs.current[slot.id] = el)}
                      type="file"
                      accept="image/jpeg,image/png"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleSlotUpload(slot.id, e.target.files)
                      }
                    />
                    <button
                      className="tpicker__slot-upload"
                      onClick={() => fileRefs.current[slot.id]?.click()}
                    >
                      {hasImage ? "Replace" : "Upload"}
                    </button>
                    {hasImage && (
                      <button
                        className="tpicker__slot-remove"
                        onClick={() => removeSlot(slot.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
