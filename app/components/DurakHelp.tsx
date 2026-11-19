import { PlayingCard } from '@/app/components/DurakCards';

// "How to play" for the Durak game: the rules in short steps, with two small examples of beating a card.

const c = (r: number, s: 'S' | 'H' | 'D' | 'C') => ({ r, s, id: `help${r}${s}` });

export default function DurakHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="dk-help" role="region" aria-labelledby="dk-help-title">
      <div className="dk-help-in">
        <h2 id="dk-help-title">How to play Durak</h2>
        <p className="dk-sub">Durak means “fool”. Get rid of all your cards: whoever’s left holding any is the fool.</p>

        <ol className="dk-steps">
          <li><b>The deal.</b> 36 cards, 6 to ace, six each. The card turned up under the deck shows the <b>trump</b> suit. Trumps beat every other suit. Whoever holds the lowest trump goes first.</li>
          <li><b>Attack.</b> The attacker plays a card. The player after them has to defend.</li>
          <li><b>Defend.</b> Beat each card with a higher card of the same suit, or with any trump. A trump can only be beaten by a higher trump.</li>
          <li><b>Throw in.</b> Once a card is down, the attacker can add more cards of <i>any rank already on the table</i>. With three or more players, everyone except the defender can pitch in, in turn. No more than six cards in a bout (five in the first), and never more than the defender can answer.</li>
          <li><b>Taking.</b> If you can’t beat a card, or won’t, press <b>Take</b>. You pick up everything on the table and miss your turn to attack.</li>
          <li><b>Beaten.</b> If every card is beaten and nobody adds more, the cards are discarded, and the defender attacks next.</li>
          <li><b>Draw up.</b> After each bout everyone draws back to six: the attacker first, the defender last.</li>
          <li><b>Going out.</b> Once the deck is gone, anyone who runs out of cards is safe. The last one holding cards is the durak.</li>
        </ol>

        <div className="dk-examples" aria-label="Examples, with spades as trumps">
          <figure>
            <div className="dk-ex"><PlayingCard c={c(7, 'H')} /><span aria-hidden="true">beaten by</span><PlayingCard c={c(9, 'H')} /></div>
            <figcaption>Same suit, higher card.</figcaption>
          </figure>
          <figure>
            <div className="dk-ex"><PlayingCard c={c(14, 'D')} /><span aria-hidden="true">beaten by</span><PlayingCard c={c(6, 'S')} /></div>
            <figcaption>Any trump (here spades) beats any other suit.</figcaption>
          </figure>
        </div>

        <p className="dk-note">Tip: keep your trumps and high cards for later, and throw in the small ones.</p>
        <button type="button" className="dk-btn is-go" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
