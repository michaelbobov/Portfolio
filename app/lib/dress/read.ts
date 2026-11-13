import OpenAI from 'openai';
import sharp from 'sharp';
import { FABRICS, KINDS, PATTERNS, SLOTS, cleanOutfit, type Outfit, type Slot } from '@/app/data/outfit';

// Reading his photo: a vision model picks, for each piece of clothing it can actually see, the nearest
// garment in the doll's catalogue (data/outfit), with its real colours, pattern and material. Nothing
// is painted or generated; the doll's 3D clothes are built from this list (Outfit3D).
const MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-6.1-sol';

/** The photo as a JPEG at most 1536 px, turned upright, with its metadata (location too) dropped */
export const preparePhoto = (input: Buffer) =>
  sharp(input).rotate().resize(1536, 1536, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();

export type Reading = { ok: boolean; problem: string; outfit: Outfit; keep: Slot[] };

const ALL_KINDS = SLOTS.flatMap((s) => [...KINDS[s]]);
const CATALOGUE = SLOTS.map((s) => `${s}: ${KINDS[s].join(', ')}`).join('\n');

const PROMPT = `This is a photo of Michael showing what he's wearing today. His portfolio has a small 3D doll of him that wears the same outfit, built from a fixed catalogue of garments. For each piece of clothing or accessory you can clearly see, pick the nearest garment in the catalogue:

${CATALOGUE}

For each:
- kind: the nearest catalogue kind (an overshirt or shacket is a jacket; a fleece zip-up is a jacket in fleece; a cardigan is a sweater worn open; a quarter-zip is a sweater; chinos and cargos are trousers; any sneaker or trainer is sneakers; loafers and dress shoes are boots).
- color: the garment's main colour as #rrggbb, sampled from the photo, corrected for the lighting (a white T-shirt in shade is still near white).
- color2: a clearly visible second colour (stripes, check, a cap's brim, a shoe's sole, sunglasses' lenses), or null.
- pattern: solid, stripes (horizontal bands), vstripes (vertical stripes, as on a striped shirt), check, knit (visible ribbing or cable), or denim.
- fabric: what it's made of, judging by how it looks: ${FABRICS.join(', ')}. (Glasses and sunglasses are acetate or metal.)
- open: true if a jacket, coat, vest or shirt is worn open, unzipped or unbuttoned.
- extra: true for a pompom on a beanie, or a hood on a hoodie or jacket.
- label: a short plain description for a caption, e.g. "navy puffer jacket, worn open". No brands; never copy text or logos.

Rules:
- Only what you can actually see. Never guess at anything out of frame, hidden, or too blurry to tell. Skip anything with no catalogue match (a watch, a bag).
- At most one garment per slot (the outermost visible one for top and outer), and up to three accessories.
- keep: every slot among head, top, outer, bottom, shoes that the photo doesn't show at all (out of frame or hidden), so the doll keeps what it already wears there. A slot he visibly isn't wearing (a bare head, no jacket) is not in keep.
- If there's no person, or the clothes can't be made out, set ok to false and say why in problem, in one short sentence. Otherwise ok is true and problem is "".`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'problem', 'garments', 'keep'],
  properties: {
    ok: { type: 'boolean' },
    problem: { type: 'string' },
    garments: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['kind', 'color', 'color2', 'pattern', 'fabric', 'open', 'extra', 'label'],
        properties: {
          kind: { type: 'string', enum: ALL_KINDS },
          color: { type: 'string' },
          color2: { type: ['string', 'null'] },
          pattern: { type: 'string', enum: [...PATTERNS] },
          fabric: { type: 'string', enum: [...FABRICS] },
          open: { type: 'boolean' },
          extra: { type: 'boolean' },
          label: { type: 'string' },
        },
      },
    },
    keep: { type: 'array', items: { type: 'string', enum: ['head', 'top', 'outer', 'bottom', 'shoes'] } },
  },
};

export async function readOutfit(photo: Buffer): Promise<Reading> {
  const res = await new OpenAI().responses.create({
    model: MODEL,
    input: [{
      role: 'user',
      content: [
        { type: 'input_text', text: PROMPT },
        { type: 'input_image', image_url: `data:image/jpeg;base64,${photo.toString('base64')}`, detail: 'high' },
      ],
    }],
    text: { format: { type: 'json_schema', name: 'outfit', strict: true, schema: SCHEMA } },
  });
  const raw = JSON.parse(res.output_text) as { ok?: boolean; problem?: string; garments?: unknown; keep?: unknown };
  const outfit = cleanOutfit(raw.garments);
  return {
    ok: !!raw.ok,
    problem: typeof raw.problem === 'string' ? raw.problem : '',
    outfit,
    keep: (Array.isArray(raw.keep) ? raw.keep : []).filter((s): s is Slot => SLOTS.includes(s) && !outfit.some((g) => g.slot === s)),
  };
}
