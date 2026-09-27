/**
 * Boot-sequence intro (~1.6s), pure CSS — no client JS, never blocks input
 * (pointer-events: none). Shown once per browser session; skipped entirely for
 * reduced-motion users and when motion is paused. The inline script runs
 * before first paint, so repeat visitors never see a flash of it.
 */
const SKIP_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem("north:intro")||matchMedia("(prefers-reduced-motion: reduce)").matches||localStorage.getItem("north:motion-paused")==="1"){d.classList.add("intro-seen")}else{sessionStorage.setItem("north:intro","1")}}catch(e){}`;

const LINES = [
  { text: "> booting north.os", ok: "" },
  { text: "> loading blueprint ........", ok: "ok" },
  { text: "> compiling city ...........", ok: "ok" },
  { text: "> deploying to production ..", ok: "✓ live" },
];

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SCRIPT }} />
      <div className="intro" aria-hidden="true" data-testid="intro">
        <div className="intro-inner">
          <svg viewBox="0 0 64 64" className="intro-compass">
            <circle cx="32" cy="32" r="30" fill="none" stroke="var(--line)" strokeWidth="1.5" />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1="32" y1="4" x2="32" y2="9" stroke="var(--paper-muted)" strokeWidth="1.5" transform={`rotate(${a} 32 32)`} />
            ))}
            <g className="intro-needle">
              <path d="M32 12 L36 32 L32 52 L28 32 Z" fill="rgba(237,230,217,0.18)" />
              <path d="M32 12 L36 32 L28 32 Z" fill="var(--signal)" />
            </g>
          </svg>
          <div className="intro-lines">
            {LINES.map((l, i) => (
              <p key={l.text} className="intro-line" style={{ ["--i" as string]: i, ["--ch" as string]: `${l.text.length}ch` }}>
                <span className="intro-type">{l.text}</span>
                {l.ok && <span className="intro-ok"> {l.ok}</span>}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
