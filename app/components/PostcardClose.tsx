import Link from 'next/link';
import { EMAIL, RESUME } from '@/app/components/Site';

// The end of the postcard inner pages (in place of the old glass close): one invitation in the name's
// italic, the way to Contact, then a slim typed row. Styles: postcard.css.
const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';

export default function PostcardClose() {
  return (
    <footer className="pc-close">
      <p className="pc-close-title">
        <Link href="/contact">Say hello<span aria-hidden="true"> →</span></Link>
      </p>
      <div className="pc-close-row">
        <p>© 2026 Michael Bobov · Product designer in Seattle</p>
        <ul>
          <li><a href={EMAIL}>Email</a></li>
          <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
          <li><a href={RESUME} target="_blank" rel="noopener noreferrer">Résumé<span className="sr-only"> (PDF, opens in a new tab)</span></a></li>
        </ul>
      </div>
    </footer>
  );
}
