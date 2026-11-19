'use client';

import { useState } from 'react';

// How to install, as a strip of tinted panels: darkest first, each later step a lighter tint of the
// same blue. One panel is open; the others are slivers with their names. On a phone it stacks.
// Every step names the real command, button or menu item (see SkillTree's package.json and dialogs).

type Step = { id: string; name: string; body: React.ReactNode };

export default function HowSteps({ marketplace, vsix }: { marketplace: string; vsix: string }) {
  const steps: Step[] = [
    {
      id: 'download',
      name: 'Download',
      body: (
        <>
          Get <a href={vsix} download>{vsix.split('/').pop()}</a> (1 MB). It goes to your Downloads folder.
        </>
      ),
    },
    {
      id: 'install',
      name: 'Install',
      body: (
        <>
          In VS Code, open Extensions (<kbd>⇧⌘X</kbd>, or <kbd>Ctrl+Shift+X</kbd> on Windows and Linux), open the ⋯ menu, choose <em>Install from VSIX…</em> and pick the file. Or search Extensions for <em>SkillTree</em> by Michael Bobov, from the <a href={marketplace}>VS Code Marketplace</a>.
        </>
      ),
    },
    {
      id: 'open',
      name: 'Open',
      body: <>Click the SkillTree icon in the bar on the left, or SkillTree in the status bar. Your skills are mapped right away, and nothing in your settings changes until you turn something on.</>,
    },
    {
      id: 'track',
      name: 'Track, if you want',
      body: (
        <>
          Open the Command Palette (<kbd>⇧⌘P</kbd>, or <kbd>Ctrl+Shift+P</kbd>), run <em>SkillTree: Enable Activity Tracking…</em> and pick <em>Enable for all projects</em>. It asks first, keeps no prompt text, and puts your Claude Code settings back when you turn it off.
        </>
      ),
    },
    {
      id: 'suggest',
      name: 'Let Claude suggest',
      body: (
        <>
          Run <em>SkillTree: Let Claude Suggest Skills…</em> and click Enable. A skill you don’t have that fits your request then shows up as a suggestion, and Claude can ask for one mid-task. You approve every install.
        </>
      ),
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
