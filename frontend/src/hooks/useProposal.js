import { useState, useCallback } from "react";
import { generateProposal } from "../services/api";
import { parseProposalText } from "../services/proposalParser";

const INITIAL_FORM = {
  project_name: "",
  description: "",
  project_type: "",
  industry: "",
  timeline: "",
  budget: "",
  phases: "",
  resources: "",
  client_name: "",
  extra_requirements: "",
};

const GENERATION_STEPS = [
  "Analysing project requirements…",
  "Drafting Purpose of Document…",
  "Outlining Key Deliverables…",
  "Writing Objectives…",
  "Defining Features & Functionality…",
  "Building Technical Approach…",
  "Selecting Technology Stack…",
  "Exploring Future Scope…",
  "Estimating Time & Budget…",
  "Assembling final proposal…",
];

export function useProposal() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [proposalText, setProposalText] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

  const updateField = useCallback((field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setProposalText("");
    setStatus("idle");
    setError("");
    setStepIndex(0);
  }, []);

  const generate = useCallback(async () => {
    if (!form.project_name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    setStatus("generating");
    setError("");
    setStepIndex(0);

    const totalSteps = GENERATION_STEPS.length;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < totalSteps - 1) setStepIndex(current);
    }, 3200);

    try {
      const rawText = await generateProposal(form);

      // ── Parse out any embedded JSON blocks into clean plain text ──────────
      const cleanText = parseProposalText(rawText);

      clearInterval(interval);
      setStepIndex(totalSteps - 1);
      await new Promise((r) => setTimeout(r, 600));
      setProposalText(cleanText);
      setStatus("done");
    } catch (e) {
      clearInterval(interval);
      setError(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [form]);

  return {
    form,
    updateField,
    resetForm,
    proposalText,
    setProposalText,
    status,
    error,
    stepIndex,
    steps: GENERATION_STEPS,
    generate,
    pdfLoading,
  };
}
