export default function Footer() {
  return (
    <footer className="wf-wrap w-full">
      {/* Extra bottom space clears the homepage's LED "next stop" panel */}
      <div className="flex flex-wrap justify-between gap-3 border-t border-wf-line pt-6 pb-24 text-[13.5px] text-wf-muted">
        <span>Michael Bobov · Product designer · Seattle</span>
        <p className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="mailto:michaelbobov@gmail.com" className="transition-colors duration-150 hover:text-wf-ink">
            michaelbobov@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/michael-bobov-94b61b202/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-wf-ink"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}
