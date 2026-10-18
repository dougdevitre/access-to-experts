import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from './App.js';

/**
 * Guards the persistent disclaimer in the app shell: it renders on every
 * route, ahead of the header, with 911 and 988 as tel: links and a link to
 * the full DISCLAIMER.md. Interim wording, pending attorney review.
 */
const NOTICE =
  'Educational information only. Access to Experts is not legal, medical, ' +
  'mental health, financial or safety advice, and using it creates no ' +
  'professional relationship. In danger now? Call 911. For crisis support, ' +
  'call or text 988. Confirm anything important with the official source ' +
  'or a licensed professional.';

function render(path: string): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

function text(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
}

describe('disclaimer notice', () => {
  it.each(['/', '/marketplace', '/workspace', '/missing'])('renders on %s', (path) => {
    const html = render(path);
    expect(text(html)).toContain(NOTICE);
    expect(html).toMatch(/<a[^>]*href="tel:911"[^>]*>911<\/a>/);
    expect(html).toMatch(/<a[^>]*href="tel:988"[^>]*>988<\/a>/);
    expect(html).toContain(
      'href="https://github.com/dougdevitre/access-to-experts/blob/main/DISCLAIMER.md"',
    );
  });

  it('is a labelled landmark shown before the app header', () => {
    const html = render('/');
    const notice = html.indexOf('aria-label="Disclaimer"');
    expect(notice).toBeGreaterThan(-1);
    expect(notice).toBeLessThan(html.indexOf('class="app-header"'));
  });
});
