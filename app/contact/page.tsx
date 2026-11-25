import { permanentRedirect } from 'next/navigation';

// Contact lives in About now (its last section), in MichaelOS's About window.
export default function ContactPage() {
  permanentRedirect('/about#contact');
}
