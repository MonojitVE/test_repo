import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import ProposalPage from "./pages/ProposalPage";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GeneratorPage />} />
        <Route path="/proposal" element={<ProposalPage />} />
      </Routes>
    </BrowserRouter>
  );
}
