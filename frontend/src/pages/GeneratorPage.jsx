import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import ProposalForm from "../components/proposal/ProposalForm";
import GenerationLoader from "../components/proposal/GenerationLoader";
import { useProposal } from "../hooks/useProposal";
import "./GeneratorPage.css";

export default function GeneratorPage() {
  const navigate = useNavigate();
  const proposal = useProposal();

  useEffect(() => {
    if (proposal.status === "done" && proposal.proposalText) {
      navigate("/proposal", {
        state: {
          proposalText: proposal.proposalText,
          clientName: proposal.form.client_name,
          formData: proposal.form,
          screenshots: proposal.form.screenshots,
        },
      });
    }
  }, [proposal.status, proposal.proposalText]);

  return (
    <PageShell>
      <div className="gen-page">
        <aside className="gen-page__sidebar">
          <div className="gen-page__sidebar-sticky">
            <h1 className="gen-page__title">New Proposal</h1>
            <p className="gen-page__desc">
              Fill in the details below. The more context you provide, the more
              tailored and accurate your proposal will be.
            </p>
            <div className="gen-page__checklist">
              <p className="gen-page__checklist-label">
                Your proposal will include:
              </p>
              {[
                "Company Overview",
                "Purpose of Document",
                "Key Deliverables",
                "Objectives",
                "Features & Functionality",
                "Technical Approach",
                "Technology Stack",
                "Future Scope",
                "Time & Budget Estimate",
              ].map((item) => (
                <div key={item} className="gen-page__checklist-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="gen-page__check-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
            <div className="gen-page__tip">
              <span className="gen-page__tip-label">💡 Tip</span>
              <p>
                Include integration requirements, compliance needs, or specific
                modules for a highly detailed proposal.
              </p>
            </div>
          </div>
        </aside>

        <main className="gen-page__main">
          {proposal.status === "generating" ? (
            <GenerationLoader
              steps={proposal.steps}
              stepIndex={proposal.stepIndex}
            />
          ) : (
            <div className="gen-page__form-wrap">
              <ProposalForm
                form={proposal.form}
                updateField={proposal.updateField}
                addScreenshots={proposal.addScreenshots}
                removeScreenshot={proposal.removeScreenshot}
                onSubmit={proposal.generate}
                loading={proposal.status === "generating"}
                error={proposal.error}
              />
            </div>
          )}
        </main>
      </div>
    </PageShell>
  );
}
