import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Header.css";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <img src={logo} alt="Virtual Employee" className="header__logo-img" />
        </Link>

        <nav className="header__nav">
          <Link
            to="/"
            className={`header__link ${pathname === "/" ? "header__link--active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/generate"
            className={`header__link ${pathname === "/generate" ? "header__link--active" : ""}`}
          >
            Generator
          </Link>
        </nav>

        <Link to="/generate" className="header__cta">
          New Proposal
        </Link>
      </div>
    </header>
  );
}
