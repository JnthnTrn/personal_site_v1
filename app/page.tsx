import Clock from "@/components/Clock";
import Contributions from "@/components/Contributions";
import NowPlaying from "@/components/NowPlaying";
import Viewport from "@/components/Viewport";
import { coursework } from "@/lib/coursework";
import { githubUrl, projects, sideQuest, site } from "@/lib/site";

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M3.6 5.9H1.2V14h2.4V5.9ZM2.4 2a1.4 1.4 0 1 0 0 2.8A1.4 1.4 0 0 0 2.4 2Zm3.5 3.9V14h2.4V9.8c0-1.1.5-1.9 1.6-1.9 1 0 1.4.7 1.4 1.9V14h2.4V9.2c0-2.3-1.1-3.5-3-3.5-1.1 0-1.9.5-2.4 1.2V5.9H5.9Z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
    <path d="m2 4 6 5 6-5" />
  </svg>
);

const ResumeIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M9.5 1.5h-6v13h9v-10l-3-3Z" />
    <path d="M9.5 1.5v3h3M5.5 8h5M5.5 10.5h5" />
  </svg>
);

function Links() {
  return (
    <ul className="links">
      <li>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          <GitHubIcon /> GitHub
        </a>
      </li>
      <li>
        <a href={site.linkedin} target="_blank" rel="noreferrer">
          <LinkedInIcon /> LinkedIn
        </a>
      </li>
      <li>
        <a href={`mailto:${site.email}`}>
          <MailIcon /> Email
        </a>
      </li>
      <li>
        <a href={site.resume} target="_blank" rel="noreferrer">
          <ResumeIcon /> Résumé
        </a>
      </li>
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <Viewport />

      <header className="beam">
        <a className="mark" href="#top" aria-label={`${site.name}, back to top`}>
          {site.initials}
        </a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#coursework">Coursework</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <p className="eyebrow">Observation deck</p>
          <h1>{site.name}</h1>
          <p className="role">{site.role}</p>
          <Links />
          <a className="descend" href="#about">
            <span>Below deck</span>
          </a>
        </section>

        <div className="deck">
          <section className="panel panel-about" id="about" aria-labelledby="about-title">
            <h2 id="about-title">
              <span>01</span> About
            </h2>
            <p className="lede">{site.tagline}</p>
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <dl className="facts">
              {site.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel panel-signal" id="signal" aria-labelledby="signal-title">
            <h2 id="signal-title">
              <span>02</span> Listening
            </h2>
            <NowPlaying />
            <p className="footnote">Live from Spotify.</p>
          </section>

          <section className="panel panel-quest" id="quest" aria-labelledby="quest-title">
            <h2 id="quest-title">
              <span>03</span> Current side quest
            </h2>
            <span className="status status-live">In progress</span>
            <p className="quest-name">{sideQuest.current}</p>
            <p className="quest-note">{sideQuest.note}</p>
            <p className="quest-goal">
              <span>Objective</span>
              {sideQuest.goal}
            </p>
            {sideQuest.completed.length > 0 && (
              <ul className="quest-log">
                {sideQuest.completed.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel panel-wide" id="projects" aria-labelledby="projects-title">
            <h2 id="projects-title">
              <span>04</span> Projects
              <a className="h2-link" href={githubUrl} target="_blank" rel="noreferrer">
                @{site.github} ↗
              </a>
            </h2>
            <ul className="projects">
              {projects.map((p) => (
                <li key={p.name}>
                  <a href={p.url} target="_blank" rel="noreferrer">
                    <span className="project-name">
                      {p.name}
                      {p.status && <em>{p.status}</em>}
                    </span>
                    <span className="project-desc">{p.description}</span>
                    <span className="tags">
                      {p.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Contributions />
          </section>

          <section className="panel panel-wide" id="coursework" aria-labelledby="coursework-title">
            <h2 id="coursework-title">
              <span>05</span> Coursework
            </h2>
            <ol className="terms">
              {coursework.map((t) => (
                <li key={t.term}>
                  <h3>
                    {t.term}
                    {t.note && <em>{t.note}</em>}
                  </h3>
                  <ul>
                    {t.courses.map(([code, title]) => (
                      <li key={code}>
                        <span>{code}</span>
                        {title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section className="panel panel-wide panel-contact" id="contact" aria-labelledby="contact-title">
            <h2 id="contact-title">
              <span>06</span> Contact
            </h2>
            <a className="hail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <Links />
          </section>
        </div>
      </main>

      <footer className="sill">
        <span className="sill-status">Systems nominal</span>
        <span className="sill-place">
          {site.location.label} · {site.location.coords}
        </span>
        <span>
          Local <Clock timeZone={site.location.timeZone} />
        </span>
      </footer>
    </>
  );
}
