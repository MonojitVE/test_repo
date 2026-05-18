import Header from './Header';
import './PageShell.css';

export default function PageShell({ children, fullWidth = false }) {
  return (
    <div className="page-shell">
      <Header />
      <main className={`page-shell__main ${fullWidth ? 'page-shell__main--full' : ''}`}>
        {children}
      </main>
    </div>
  );
}
