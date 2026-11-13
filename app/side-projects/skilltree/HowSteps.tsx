'use client';

import { useState } from 'react';

// How to install, as a strip of tinted panels: darkest first, each later step a lighter tint of the
// same blue. One panel is open; the others are slivers with their names. On a phone it stacks.
// Every step describes what the extension really does (commands, settings, consent dialogs).

type Step = { id: string; name: string; body: React.ReactNode };

export default function HowSteps({ vsix }: { vsix: string }) {
  const steps: Step[] = [
    {
      id: 'download',
      name: 'Download',
      body: (
        <>
          Get <a href={vsix} download>skilltree-0.1.2.vsix</a> (0.9 MB). SkillTree isn’t on the VS Code Marketplace yet, so it installs from this file.
        </>
      ),
    },
    {
      id: 'install',
      name: 'Install',
      body: (
        <>
          In VS Code, open the Extensions view, then the ⋯ menu, then <em>Install from VSIX…</em> and pick the file. Or run{' '}
          <code>code --install-extension skilltree-0.1.2.vsix</code>.
        </>
      ),
    },
    {
      id: 'open',
      name: 'Open',
      body: <>Click SkillTree in the Activity Bar or in the status bar. The Get Started walkthrough shows the rest. Nothing changes on your machine until you ask.</>,
    },
    {
      id: 'track',
      name: 'Track, if you want',
      body: <>Turn on usage tracking to record which skills Claude runs. It asks first, keeps no prompt text, and puts your Claude Code settings back exactly when you turn it off.</>,
    },
    {
      id: 'suggest',
      name: 'Let Claude suggest',
      body: <>When this is on, a skill you don’t have that fits your request shows up as a suggestion, and Claude can ask for one mid-task. You approve every install.</>,
    },
  ];
  const [open, setOpen] = useState(steps[0].id);
  return (
    <div className="stx-steps" data-reveal style={{ ['--i' as string]: 2 }}>
      {steps.map((s, i) => {
        const isOpen = s.id === open;
        return (
          <div key={s.id} className={`stx-step stx-step-${i}${isOpen ? ' is-open' : ''}`}>
            <button type="button" className="stx-step-head" aria-expanded={isOpen} aria-controls={`stx-step-${s.id}`} onClick={() => setOpen(s.id)}>
              <span className="stx-step-name">{s.name}</span>
            </button>
            <div id={`stx-step-${s.id}`} className="stx-step-body" hidden={!isOpen}>
              <p className="stx-step-title">{s.name}</p>
              <p className="stx-step-text">{s.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
