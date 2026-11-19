import type { Metadata } from 'next';
import PostcardBar from '@/app/components/PostcardBar';
import { EMAIL, RESUME } from '@/app/components/Site';
import { NOW } from '@/app/data/now';
import { placeOf } from '@/app/data/places';
import '../hp.css';
import '../postcard.css';

// Contact, behind the littlest doll: a postcard. The message on the left, the ways to reach him where the
// address goes, the red sun for a stamp, and a postmark from where he is now.
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Write to Michael Bobov, a product designer and builder in Seattle.',
  alternates: { canonical: '/contact' },
};

const LINKEDIN = 'https://www.linkedin.com/in/michael-bobov-94b61b202/';
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

export default function ContactPage() {
  const place = placeOf(NOW.place);
  return (
    <div className="hp pc pc-page">
      <PostcardBar current="/contact" />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <article className="pc-postcard" aria-labelledby="contact-title">
          <div className="pc-postcard-note">
            <h1 id="contact-title" className="pc-postcard-title">Say hello.</h1>
            <p>I’m a product designer and builder. Write about a role, a project, or something you’re making.</p>
          </div>
          <div className="pc-postcard-to">
            <img className="pc-stamp" src="/postcard/sun.webp" alt="" width={900} height={900} />
            <p className="pc-postmark" aria-hidden="true">{place.caption}</p>
            <ul className="pc-lines">
              <li><span>Email</span><a href={EMAIL}>michaelbobov@gmail.com</a></li>
              <li><span>LinkedIn</span><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">michael-bobov<NewTab /></a></li>
              <li><span>Résumé</span><a href={RESUME} target="_blank" rel="noopener noreferrer">PDF ↗<span className="sr-only"> (opens in a new tab)</span></a></li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}
