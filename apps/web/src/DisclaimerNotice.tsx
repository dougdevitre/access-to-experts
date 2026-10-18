/**
 * Persistent disclaimer shown at the top of every screen. Interim wording,
 * pending attorney review; the full text lives in DISCLAIMER.md.
 *
 * 911 and 988 stay visible without any interaction. When interactive
 * surfaces (Guide chat, Workspace forms) land, they also need the one-time
 * acknowledgment described in the Access To disclaimer standard.
 */
const FULL_DISCLAIMER_URL =
  'https://github.com/dougdevitre/access-to-experts/blob/main/DISCLAIMER.md';

export function DisclaimerNotice() {
  return (
    <aside className="disclaimer-notice" aria-label="Disclaimer">
      <p>
        Educational information only. Access to Experts is not legal, medical, mental health,
        financial or safety advice, and using it creates no professional relationship. In danger
        now? Call{' '}
        <a className="disclaimer-tel" href="tel:911">
          911
        </a>
        . For crisis support, call or text{' '}
        <a className="disclaimer-tel" href="tel:988">
          988
        </a>
        . Confirm anything important with the official source or a licensed professional.{' '}
        <a className="disclaimer-more" href={FULL_DISCLAIMER_URL}>
          Read the full disclaimer
        </a>
      </p>
    </aside>
  );
}
