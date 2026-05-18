import './GenerationLoader.css';

export default function GenerationLoader({ steps, stepIndex }) {
  return (
    <div className="gen-loader" role="status" aria-live="polite">
      <div className="gen-loader__pulse">
        <div className="gen-loader__ring gen-loader__ring--1" />
        <div className="gen-loader__ring gen-loader__ring--2" />
        <div className="gen-loader__ring gen-loader__ring--3" />
        <div className="gen-loader__core">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
        </div>
      </div>

      <div className="gen-loader__content">
        <h2 className="gen-loader__title">Generating Your Proposal</h2>
        <p className="gen-loader__subtitle">
          Each section is being crafted individually by AI.
          This takes about 30–60 seconds.
        </p>

        <div className="gen-loader__steps">
          {steps.map((step, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div
                key={i}
                className={[
                  'gen-loader__step',
                  done ? 'gen-loader__step--done' : '',
                  active ? 'gen-loader__step--active' : '',
                ].join(' ')}
              >
                <span className="gen-loader__step-dot">
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : null}
                </span>
                <span className="gen-loader__step-text">{step}</span>
              </div>
            );
          })}
        </div>

        <div className="gen-loader__bar-wrap">
          <div
            className="gen-loader__bar-fill"
            style={{ width: `${Math.round(((stepIndex + 1) / steps.length) * 100)}%` }}
          />
        </div>
        <p className="gen-loader__pct">
          {Math.round(((stepIndex + 1) / steps.length) * 100)}% complete
        </p>
      </div>
    </div>
  );
}
