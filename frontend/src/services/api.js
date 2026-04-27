const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Generate a proposal from form data.
 * @param {Object} formData
 * @returns {Promise<string>} proposal_text
 */
export async function generateProposal(formData) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error ${res.status}`);
  }

  const data = await res.json();
  return data.proposal_text;
}

/**
 * Generate and download proposal PDF from backend
 * @param {string} proposalText
 * @returns {Promise<Blob>}
 */
export async function downloadProposalPdf(proposalText) {
  const res = await fetch(`${BASE_URL}/generate-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: proposalText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error ${res.status}`);
  }

  const blob = await res.blob();
  return blob;
}

/**
 * Trigger browser download from a Blob.
 * @param {Blob} blob
 * @param {string} filename
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
