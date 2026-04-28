import { useRef } from "react";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import "./ProposalForm.css";

const PROJECT_TYPES = [
  { value: "web_app", label: "Web Application" },
  { value: "mobile_app", label: "Mobile Application" },
  { value: "api", label: "API / Backend Service" },
  { value: "data_platform", label: "Data Platform / Analytics" },
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "ecommerce", label: "E-Commerce Platform" },
  { value: "crm", label: "CRM / ERP System" },
  { value: "saas", label: "SaaS Product" },
  { value: "other", label: "Other" },
];

const INDUSTRIES = [
  { value: "healthcare", label: "Healthcare" },
  { value: "fintech", label: "FinTech / Finance" },
  { value: "edtech", label: "EdTech / Education" },
  { value: "ecommerce", label: "E-Commerce / Retail" },
  { value: "logistics", label: "Logistics / Supply Chain" },
  { value: "real_estate", label: "Real Estate" },
  { value: "legal", label: "Legal / Compliance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "media", label: "Media / Entertainment" },
  { value: "government", label: "Government / Public Sector" },
  { value: "other", label: "Other" },
];

const TIMELINES = [
  { value: "1_month", label: "< 1 Month" },
  { value: "1_3_months", label: "1 – 3 Months" },
  { value: "3_6_months", label: "3 – 6 Months" },
  { value: "6_12_months", label: "6 – 12 Months" },
  { value: "12_plus", label: "12+ Months" },
];

const BUDGETS = [
  { value: "under_10k", label: "Under $10,000" },
  { value: "10k_25k", label: "$10,000 – $25,000" },
  { value: "25k_50k", label: "$25,000 – $50,000" },
  { value: "50k_100k", label: "$50,000 – $100,000" },
  { value: "100k_plus", label: "$100,000+" },
  { value: "flexible", label: "Flexible / TBD" },
];

export default function ProposalForm({
  form,
  updateField,
  addScreenshots,
  removeScreenshot,
  onSubmit,
  loading,
  error,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) addScreenshots(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <form
      className="proposal-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      {/* 01 — Project Brief */}
      <section className="proposal-form__section">
        <div className="proposal-form__section-header">
          <span className="proposal-form__section-num">01</span>
          <div>
            <h2 className="proposal-form__section-title">Project Brief</h2>
            <p className="proposal-form__section-desc">
              Describe what you're building — the more detail, the better the
              proposal.
            </p>
          </div>
        </div>
        <div className="proposal-form__fields">
          <FormField
            label="Project Name"
            name="project_name"
            as="input"
            value={form.project_name}
            onChange={updateField}
            placeholder="e.g. AI enabled Point Of Sale App"
            hint="This will appear as the title on the PDF cover page."
            required
          />
          <FormField
            label="Project Description"
            name="description"
            as="textarea"
            rows={5}
            value={form.description}
            onChange={updateField}
            placeholder="e.g. A multi-tenant SaaS platform for managing employee onboarding workflows…"
            required
            hint="Be specific about goals, users, and key capabilities."
          />
        </div>
      </section>

      {/* 02 — Project Details */}
      <section className="proposal-form__section">
        <div className="proposal-form__section-header">
          <span className="proposal-form__section-num">02</span>
          <div>
            <h2 className="proposal-form__section-title">Project Details</h2>
            <p className="proposal-form__section-desc">
              Optional context that sharpens the proposal's technical and
              business specificity.
            </p>
          </div>
        </div>
        <div className="proposal-form__fields proposal-form__fields--grid">
          <FormField
            label="Project Type"
            name="project_type"
            as="select"
            value={form.project_type}
            onChange={updateField}
            options={PROJECT_TYPES}
          />
          <FormField
            label="Industry / Domain"
            name="industry"
            as="select"
            value={form.industry}
            onChange={updateField}
            options={INDUSTRIES}
          />
          <FormField
            label="Timeline"
            name="timeline"
            as="select"
            value={form.timeline}
            onChange={updateField}
            options={TIMELINES}
          />
          <FormField
            label="Budget Range"
            name="budget"
            as="select"
            value={form.budget}
            onChange={updateField}
            options={BUDGETS}
          />
        </div>
      </section>

      {/* 03 — Execution Details */}
      <section className="proposal-form__section">
        <div className="proposal-form__section-header">
          <span className="proposal-form__section-num">03</span>
          <div>
            <h2 className="proposal-form__section-title">Execution Details</h2>
            <p className="proposal-form__section-desc">
              Help the AI understand how the project will be structured and
              staffed.
            </p>
          </div>
        </div>
        <div className="proposal-form__fields">
          <FormField
            label="Project Phases"
            name="phases"
            as="textarea"
            rows={3}
            value={form.phases}
            onChange={updateField}
            placeholder="e.g. Phase 1: Discovery & Design (2 weeks) → Phase 2: Core Development (6 weeks)…"
            hint="Describe the breakdown of work stages if known."
          />
          <FormField
            label="Team & Resources"
            name="resources"
            as="textarea"
            rows={3}
            value={form.resources}
            onChange={updateField}
            placeholder="e.g. 1 Project Manager, 2 Backend Engineers, 1 Frontend Engineer…"
            hint="List the roles or team structure expected for this project."
          />
        </div>
      </section>

      {/* 04 — Client Information */}
      <section className="proposal-form__section">
        <div className="proposal-form__section-header">
          <span className="proposal-form__section-num">04</span>
          <div>
            <h2 className="proposal-form__section-title">Client Information</h2>
            <p className="proposal-form__section-desc">
              Used in the PDF cover page and to personalize the proposal.
            </p>
          </div>
        </div>
        <div className="proposal-form__fields proposal-form__fields--grid">
          <FormField
            label="Client / Company Name"
            name="client_name"
            as="input"
            value={form.client_name}
            onChange={updateField}
            placeholder="e.g. Acme Corp"
            hint="Shown on the PDF cover as 'Prepared for:'"
          />
          <FormField
            label="Additional Requirements"
            name="extra_requirements"
            as="textarea"
            rows={3}
            value={form.extra_requirements}
            onChange={updateField}
            placeholder="e.g. Must comply with HIPAA, needs offline mode…"
          />
        </div>
      </section>

      {/* 05 — Demo Screenshots */}
      <section className="proposal-form__section">
        <div className="proposal-form__section-header">
          <span className="proposal-form__section-num">05</span>
          <div>
            <h2 className="proposal-form__section-title">Demo Screenshots</h2>
            <p className="proposal-form__section-desc">
              Optional. Upload JPG/PNG screenshots — they'll appear as a
              dedicated section in the PDF.
            </p>
          </div>
        </div>

        <div className="proposal-form__fields">
          {/* Drop zone */}
          <div
            className="screenshot-drop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="screenshot-drop__input"
              onChange={(e) => addScreenshots(e.target.files)}
            />
            <div className="screenshot-drop__icon">🖼</div>
            <p className="screenshot-drop__label">
              Drop screenshots here or{" "}
              <span className="screenshot-drop__link">browse</span>
            </p>
            <p className="screenshot-drop__hint">
              JPG or PNG · Multiple files allowed
            </p>
          </div>

          {/* Preview grid */}
          {form.screenshots.length > 0 && (
            <div className="screenshot-grid">
              {form.screenshots.map((s, i) => (
                <div key={i} className="screenshot-thumb">
                  <img
                    src={s.dataUrl}
                    alt={s.name}
                    className="screenshot-thumb__img"
                  />
                  <div className="screenshot-thumb__overlay">
                    <span className="screenshot-thumb__name">{s.name}</span>
                    <button
                      type="button"
                      className="screenshot-thumb__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeScreenshot(i);
                      }}
                      aria-label={`Remove ${s.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="proposal-form__error" role="alert">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="proposal-form__submit">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!form.project_name.trim() || !form.description.trim()}
        >
          Generate Proposal
        </Button>
        <p className="proposal-form__submit-note">
          Generation takes ~30 – 60 seconds. Each section is crafted
          individually by AI.
        </p>
      </div>
    </form>
  );
}
