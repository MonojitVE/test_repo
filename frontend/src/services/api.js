const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Build a prompt string from all form fields.
 */
function buildPrompt(formData) {
  const parts = [];

  if (formData.description?.trim())
    parts.push(`Project Description: ${formData.description.trim()}`);
  if (formData.project_type?.trim())
    parts.push(`Project Type: ${formData.project_type.trim()}`);
  if (formData.industry?.trim())
    parts.push(`Industry/Domain: ${formData.industry.trim()}`);
  if (formData.timeline?.trim())
    parts.push(`Timeline: ${formData.timeline.trim()}`);
  if (formData.budget?.trim()) parts.push(`Budget: ${formData.budget.trim()}`);
  if (formData.phases?.trim())
    parts.push(`Project Phases: ${formData.phases.trim()}`);
  if (formData.resources?.trim())
    parts.push(`Team & Resources: ${formData.resources.trim()}`);
  if (formData.client_name?.trim())
    parts.push(`Client/Company: ${formData.client_name.trim()}`);
  if (formData.extra_requirements?.trim())
    parts.push(
      `Additional Requirements: ${formData.extra_requirements.trim()}`,
    );
  if (formData.demoLabel?.trim() && formData.demoLink?.trim())
    parts.push(
      `Demo: ${formData.demoLabel.trim()} — ${formData.demoLink.trim()}`,
    );

  return parts.join("\n");
}

/**
 * Generate a proposal from form data.
 * Sends { prompt: string } to backend, returns full_proposal JSON object.
 * @param {Object} formData
 * @returns {Promise<Object>} full_proposal
 */
export async function generateProposal(formData) {
  const prompt = buildPrompt(formData);

  const res = await fetch(`${BASE_URL}/proposal/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (Array.isArray(err.detail) ? err.detail[0]?.msg : err.detail) ||
        `Server error ${res.status}`,
    );
  }

  const data = await res.json();
  return data.full_proposal;
}

/**
 * Trigger browser download from a Blob.
 */
export function triggerDownload(blob, filename = "proposal.pdf") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
