import {
  CaseHero,
  CaseShell,
  Decision,
  Decisions,
  Figure,
  NextCase,
  MetaGrid,
  ProcessDetails,
  Prose,
  Section,
  Tldr,
} from '@/app/components/case/Case';
import '../case.css';

// PDF Penguin case study. Copy follows the PM review (§3.3). Unverified numbers (time to first
// output, parse success, setup times, "2 clicks") are left out until their method is known.
export default function PDFPenguinCaseStudy() {
  return (
    <CaseShell>
      <CaseHero
        kicker="AI · Developer tools · 2025"
        name="PDF Penguin"
        claim="messy PDF in, clean JSON out"
        summary="I built PDF Penguin in two weeks after EZ Recipe needed USDA nutrition data locked in messy PDFs and the existing tools were too technical or unreliable."
        link={{ href: 'https://www.figma.com/proto/6gUB6gR6ATucf890UPjQO6/Pdf-Pengu?node-id=14-418&t=O1XBikXg0ng6HNMv-1', label: 'Figma prototype' }}
      />
      <MetaGrid
        items={[
          { label: 'Role', lines: ['Founder', 'Product Designer', 'Frontend Developer'] },
          { label: 'Timeline', lines: ['2 weeks', 'Design MVP · Pre-launch'] },
          { label: 'Team', lines: ['Solo Project', 'End-to-end ownership'] },
          { label: 'Skills', lines: ['Product Design', 'AI Integration', 'Frontend Dev'] },
        ]}
      />
      <Tldr
        status="PRE-LAUNCH"
        rows={[
          { label: 'Problem', text: 'Getting a table out of a PDF meant selecting areas by hand, writing parser rules or fixing broken exports, all before the first result.' },
          { label: 'How I found it', text: 'I needed it myself: EZ Recipe’s nutrition data was stuck in USDA PDFs. Then I tried Tabula, Acrobat and DocParser as a first-time user.' },
          { label: 'Solution and why', text: 'Drop a PDF, describe the output in plain words, get JSON beside it. Every tool I tried broke down at setup, so this needs none.' },
          { label: 'Outcome', text: 'A working MVP in 2 weeks (React, OCR, OpenAI API). Pre-launch. It’s now part of my own toolset.' },
        ]}
      />
      <Figure
        size="hero"
        priority
        img={{ src: '/mockuuups-macknook-air.png', alt: 'PDF Penguin on a laptop: a drop zone and an output prompt on the left, the JSON output panel on the right.', width: 2400, height: 1552 }}
        caption="The built MVP: drop zone and prompt on the left, JSON output on the right."
      />

      <Section id="problem" label="The problem" title="Pulling data out of a PDF shouldn’t need setup, but the tools I tried all asked for it.">
        <Prose>
          <p>Tabula makes you select table areas by hand. DocParser makes you define parsing rules. Acrobat exports break the formatting. Scanned PDFs fail, multi-page documents break, and the output still needs cleanup.</p>
        </Prose>
      </Section>

      <Section id="found" label="How I found it" title="I was the first user.">
        <Prose>
          <p>While building EZ Recipe I needed USDA nutrition data that lived in messy PDFs, and the existing tools were too technical or unreliable. So I ran Tabula, Adobe Acrobat and DocParser as a first-time user with minimal technical background.</p>
        </Prose>
        <div className="cs-table-wrap cs-col">
          <table className="cs-table">
            <caption className="sr-only">How each tool gets from a PDF to data</caption>
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Steps before the first output</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Tabula</th><td>Install → select the table area → export</td></tr>
              <tr><th scope="row">Adobe Acrobat</th><td>Open → export → fix the formatting</td></tr>
              <tr><th scope="row">DocParser</th><td>Create a parser → define rules → run</td></tr>
              <tr><th scope="row">PDF Penguin</th><td>Drop → describe → convert</td></tr>
            </tbody>
          </table>
        </div>
        <Prose>
          <p>Extraction wasn’t the hard part. Setup was. So PDF Penguin needs none.</p>
        </Prose>
      </Section>

      <Section id="solution" label="Solution and why" title="Drop, describe, convert: two panels and a plain-language prompt." decisions>
        <Prose>
          <p>Drop a PDF on the left and describe what you want, like “Extract all product names and prices as a list.” Convert, and the JSON appears on the right, ready to copy, download or save to your library. If it’s not right, change the instructions and run it again.</p>
        </Prose>
        <Decisions>
          <Decision n={1} title="A plain-language prompt, not a form or schema.">
            <p>People stuck at this step don’t know schema syntax. Describing the output in plain English removes that barrier.</p>
          </Decision>
          <Decision n={2} title="Two panels, with the request on the left and JSON on the right.">
            <p>You see the result next to what you asked for, a familiar pattern from code editors.</p>
          </Decision>
          <Decision n={3} title="JSON first.">
            <p>JSON works with APIs, databases and spreadsheet imports. CSV and XML can come later.</p>
          </Decision>
        </Decisions>
      </Section>

      <Section id="screens" label="Screens" title="One loop: a request on the left, data on the right.">
        <Figure
          img={{ src: '/highfipengu2.png', alt: 'PDF Penguin hi-fi: an uploaded invoice PDF and a Customize Output prompt on the left, formatted JSON with a file name and Download button on the right.', width: 1728, height: 1117 }}
          caption="The core loop: a plain-language request on the left, structured JSON on the right, Download above it."
        />
        <div className="cs-grid2">
          <Figure size="narrow" img={{ src: '/sketchpdfpenguin.png', alt: 'PDF Penguin paper sketch of the two-panel layout.', width: 1024, height: 1024 }} />
          <Figure size="narrow" img={{ src: '/highfipengu1.png', alt: 'PDF Penguin hi-fi upload screen with the same two-panel layout.', width: 1728, height: 1117 }} />
        </div>
        <p className="cs-caption">The two-panel layout held from the first paper sketch to hi-fi.</p>
        <Figure
          img={{ src: '/highfipengu3.png', alt: 'PDF Penguin Export Library: saved JSON and XML exports with View and Download buttons, search, and format and date filters.', width: 1728, height: 1117 }}
          caption="Past conversions are saved in an export library, for people who process the same kind of document again."
        />
      </Section>

      <Section id="outcome" label="Outcome" title="A working MVP, built for a real need.">
        <Prose>
          <p>PDF Penguin is built with React, Tailwind, OCR and the OpenAI API, deployed on Vercel, and pre-launch. It started as a tool I needed for EZ Recipe and is now part of my toolset.</p>
        </Prose>
      </Section>

      <Section id="learned" label="What I learned" title="AI does the work; the interface makes it usable.">
        <Prose>
          <p>The model does the heavy lifting. The drop zone, the plain-language prompt and the preview are what make it usable. The hardest part was cutting: every “nice to have” threatened the simplicity. Next: accounts and upload history, CSV and XML export, better scanned-PDF support, and an API.</p>
        </Prose>
      </Section>

      <ProcessDetails list="user flow · lo-fi · more hi-fi">
        <h3>User flow</h3>
        <Figure
          size="narrow"
          img={{ src: '/pdfpenguinflow.png', alt: 'PDF Penguin user flow chart, from uploading a PDF to exporting JSON.', width: 1440, height: 2656 }}
          caption="If the output isn’t right, adjust the instructions and run it again."
        />
        <h3>Lo-fi</h3>
        <div className="cs-grid2">
          <Figure size="narrow" img={{ src: '/pengu1lowfi.png', alt: 'PDF Penguin lo-fi wireframe: upload interface', width: 1728, height: 1117 }} />
          <Figure size="narrow" img={{ src: '/pengu2lowfi.png', alt: 'PDF Penguin lo-fi wireframe: JSON output', width: 1728, height: 1117 }} />
          <Figure size="narrow" img={{ src: '/pengu3lowfi.png', alt: 'PDF Penguin lo-fi wireframe: library view', width: 1728, height: 1117 }} />
          <Figure size="narrow" img={{ src: '/pengu4lowfi.png', alt: 'PDF Penguin lo-fi wireframe: document view', width: 1728, height: 1117 }} />
        </div>
        <h3>More hi-fi</h3>
        <Figure size="narrow" img={{ src: '/highfipengu4.png', alt: 'PDF Penguin hi-fi design: document view', width: 1728, height: 1117 }} />
      </ProcessDetails>

      <NextCase
        href="/work/spotify-loop"
        name="Spotify Loop,"
        line="replay one part of a song without leaving Spotify."
        img="/spotifyloophero.png"
        bg="#2b2b2b"
      />
    </CaseShell>
  );
}
