import {
  CaseHero,
  CaseShell,
  Decision,
  Decisions,
  Figure,
  MetaGrid,
  NextCase,
  PhoneRow,
  ProcessDetails,
  Prose,
  Section,
  Tldr,
} from '@/app/components/case/Case';
import '../case.css';

// EZ Recipe case study. Copy follows the PM review (§3.2). Unverified numbers (recipes generated,
// rating, wait-time and survey percentages) are left out until their method is known.
export default function EZRecipeCaseStudy() {
  return (
    <CaseShell>
      <CaseHero
        kicker="Consumer · AI · 2025"
        name="EZ Recipe"
        claim="recipes from what’s already in your kitchen"
        summary="I designed, built and shipped EZ Recipe on my own in two months: answer six quick questions, add your ingredients, and AI writes a recipe that fits."
        link={{ href: 'https://ezrecipe.app', label: 'ezrecipe.app' }}
      />
      <MetaGrid
        items={[
          { label: 'Role', lines: ['Founder', 'Product Designer', 'Full-Stack Developer'] },
          { label: 'Timeline', lines: ['2 months', 'Concept to launch'] },
          { label: 'Team', lines: ['Solo Project', 'End-to-end ownership'] },
          { label: 'Skills', lines: ['UX Research', 'Product Design', 'AI Integration'] },
        ]}
      />
      <Tldr
        status="LIVE"
        rows={[
          { label: 'Problem', text: 'Recipe apps assume you’ll shop for the recipe. Home cooks need meals that fit what’s in their kitchen, their time and their goals.' },
          { label: 'How I found it', text: 'In cooking subreddits, beginners felt overwhelmed and people asked how to use leftovers. Four popular recipe apps I compared weren’t built around constraints.' },
          { label: 'Solution and why', text: 'Six questions plus your ingredients; AI writes a recipe to fit. AI, not a recipe database, so any pantry gets a result, never “no results found.”' },
          { label: 'Outcome', text: 'Live at ezrecipe.app. Family testing on the live app showed images slowed recipes down, so the recipe now appears first and the image loads after.' },
        ]}
      />
      <Figure
        size="hero"
        priority
        img={{ src: '/ezrecipelaptop.png', alt: 'EZ Recipe on a laptop and a phone: Cooking Preferences and ingredients on the left of the Create Recipe screen, a generated recipe on the right, and Saved Recipes on the phone.', width: 2400, height: 1700 }}
        caption="The live app: your preferences and ingredients on the left, the generated recipe on the right; saved recipes on the phone."
      />

      <Section id="problem" label="The problem" title="Recipe apps assume you’ll shop. Home cooks start from what’s in the fridge.">
        <Prose>
          <p>
            Recipes call for ingredients people don’t have, which means a trip to the store or a guess at substitutions. Apps ignore dietary goals and time limits. Endless options with no guidance lead to decision fatigue, and leftovers go to waste because there’s no easy way to find a recipe that uses them.
          </p>
        </Prose>
      </Section>

      <Section id="found" label="How I found it" title="Cooking communities kept asking how to use what they already had.">
        <Prose>
          <p>
            I read r/CookingForBeginners, where people said complex recipes overwhelmed them, and r/EatCheapAndHealthy, where people asked for help using leftover ingredients. Then I compared Mealime, Yummly, Tasty and Paprika. All have large recipe libraries; none is built around your constraints. That gap became the product: start from what you have, not from a recipe.
          </p>
        </Prose>
      </Section>

      <Section id="solution" label="Solution and why" title="Six questions and your ingredients in, one recipe that fits out." decisions>
        <Prose>
          <p>Pick the meal, cuisine, servings, time limit, calories and food style; each has a default. Add the ingredients you have, and AI writes a recipe. Review substitutions and save the ones you like.</p>
        </Prose>
        <Decisions>
          <Decision n={1} title="AI generation, not a recipe database.">
            <p>A database can’t cover every combination of ingredients, so it dead-ends at “no results found.” AI writes a recipe for any pantry.</p>
          </Decision>
          <Decision n={2} title="Six questions, each with a smart default.">
            <p>Some people care about calories, others about cuisine. Defaults let people customize without overwhelming first-timers.</p>
          </Decision>
          <Decision n={3} title="Show the recipe first, load the image after.">
            <p>In family testing on the live app, recipes took too long because the image was generated alongside the text. I changed the flow so the recipe appears as soon as it’s ready.</p>
          </Decision>
        </Decisions>
      </Section>

      <Section id="screens" label="Screens" title="Constraints in, a recipe card out.">
        <PhoneRow
          label="EZ Recipe screens"
          items={[
            {
              img: { src: '/HiFiSevingsselect.png', alt: 'EZ Recipe Cooking Preferences: dropdowns for time of day, cuisine, servings, time limit, calories and food style, fields for ingredients on hand and special instructions, and Generate and Reset to Defaults buttons.', width: 393, height: 852 },
              caption: 'All six constraints as dropdowns, plus ingredients on hand, special instructions and Reset to Defaults.',
            },
            {
              img: { src: '/HiFiViewRecipe.png', alt: 'EZ Recipe recipe card for Roast Chicken with Onions: servings, time and macros above the ingredient list.', width: 393, height: 852 },
              caption: 'Servings, time and macros first, then ingredients.',
            },
          ]}
        />
      </Section>

      <Section id="outcome" label="Outcome" title="Shipped, and changed by real use.">
        <Prose>
          <p>EZ Recipe is live at ezrecipe.app. The biggest change after launch came from family testing on the live product: the image bottleneck above, which wouldn’t have shown up in a prototype.</p>
        </Prose>
      </Section>

      <Section id="learned" label="What I learned" title="Good tools cut decisions without cutting control.">
        <Prose>
          <p>Narrow inputs and focused outputs build confidence instead of choice paralysis, and real use surfaces problems a prototype hides. Next: better support for allergies and intolerances, improved scanning, and export to a grocery list.</p>
        </Prose>
      </Section>

      <ProcessDetails list="proto-persona · journey map · sketches · lo-fi · hi-fi">
        <h3>Proto-persona</h3>
        <p className="cs-muted">A synthesized persona, not a specific person.</p>
        <Figure
          size="narrow"
          img={{ src: '/ezrecipepersona.png', alt: 'Proto-persona: Jessica Rhomes, 36, working mother of two in California. Goals: cook healthy meals without constant grocery trips, stay on budget, reduce food waste. Frustrations: recipe apps assume she has everything on hand; time wasted scrolling irrelevant recipes. Needs: a fast way to turn fridge and pantry leftovers into full meals.', width: 960, height: 540 }}
        />
        <h3>Journey map</h3>
        <Figure
          img={{ src: '/ezrecipejourneymap.png', alt: 'EZ Recipe user journey map for Jessica, from planning a meal to cooking it.', width: 5829, height: 3561 }}
          caption="The low point is cooking: unclear instructions and risky substitutions while she’s rushed."
        />
        <h3>Sketches</h3>
        <Figure
          size="narrow"
          img={{ src: '/ezrecipesketch.jpeg', alt: 'EZ Recipe wireframe sketches on paper.', width: 2510, height: 2926 }}
          caption="Six screens on paper before any pixels."
        />
        <h3>Lo-fi</h3>
        <PhoneRow
          label="EZ Recipe lo-fi wireframes"
          items={[
            { img: { src: '/Home App.png', alt: 'EZ Recipe lo-fi wireframe: home screen', width: 393, height: 852 } },
            { img: { src: '/Sevings select.png', alt: 'EZ Recipe lo-fi wireframe: servings and preferences', width: 393, height: 852 } },
            { img: { src: '/View Recipe Saved.png', alt: 'EZ Recipe lo-fi wireframe: recipe detail', width: 393, height: 852 } },
            { img: { src: '/Saved-1.png', alt: 'EZ Recipe lo-fi wireframe: saved recipes', width: 393, height: 852 } },
          ]}
        />
        <h3>More hi-fi</h3>
        <PhoneRow
          label="More EZ Recipe hi-fi screens"
          items={[
            { img: { src: '/HiFiHomeApp.png', alt: 'EZ Recipe hi-fi design: home screen', width: 393, height: 852 } },
            { img: { src: '/HiFiSaved.png', alt: 'EZ Recipe hi-fi design: saved recipes', width: 393, height: 852 } },
          ]}
        />
      </ProcessDetails>

      <NextCase
        href="/work/pdf-penguin"
        name="PDF Penguin,"
        line="the tool I built because EZ Recipe needed it."
        img="/pdfpenguinhero.png"
        bg="#4a2a7a"
        position="50% 32%"
      />
    </CaseShell>
  );
}
