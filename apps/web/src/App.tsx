import { Route, Routes, NavLink } from 'react-router-dom';
import { DisclaimerNotice } from './DisclaimerNotice.js';

/**
 * Stub for the three-pane UI described in docs/architecture/system-overview.md.
 *
 *   +-----------+-------------+-------------+
 *   |  Guide    |  Marketplace|  Workspace  |
 *   +-----------+-------------+-------------+
 *
 * Phase 1 replaces these placeholder pages with real routes.
 */
export function App() {
  return (
    <div className="app-shell">
      <DisclaimerNotice />
      <header className="app-header">
        <h1>Access To Experts</h1>
        <nav aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/workspace">Workspace</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  return (
    <section>
      <h2>Welcome</h2>
      <p>Structured, expert-authored guidance for practitioners, professionals, and institutions.</p>
    </section>
  );
}

function Marketplace() {
  return (
    <section>
      <h2>Marketplace</h2>
      <p>Browse certified playbooks by vertical, jurisdiction, and role. (Stub)</p>
    </section>
  );
}

function Workspace() {
  return (
    <section>
      <h2>Workspace</h2>
      <p>Your active sessions and produced artifacts. (Stub)</p>
    </section>
  );
}

function NotFound() {
  return (
    <section>
      <h2>Not found</h2>
    </section>
  );
}
