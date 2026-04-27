def save_proposal(proposal_text, filename:str = "proposal_output.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(proposal_text)
    print(f"Proposal saved to {filename}")