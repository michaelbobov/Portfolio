import Image from 'next/image';

// The hero's station photos, in STATIONS order (Seattle, Tokyo). Both are open-air platforms with
// a yellow edge line and tracks receding into the distance, cropped alike so the two cities read
// as nearly the same shape. Shown in black and white (a static CSS filter). StationSign swaps the
// layers. Credits are in the homepage footer (Footer.tsx), as the licences require.
const PHOTOS = [
  {
    src: '/stations/seattle-mount-baker.jpg',
    alt: 'Mount Baker light rail station platform in Seattle, in black and white',
    position: '30% 55%',
  },
  {
    src: '/stations/tokyo-ikebukuro.jpg',
    alt: 'Yamanote Line platform at Ikebukuro Station in Tokyo, in black and white',
    position: '56% 55%',
  },
];

export default function HeroPhotos() {
  return (
    <div className="wf-photos">
      {PHOTOS.map((p, i) => (
        <div
          key={p.src}
          className={`wf-photo${i === 0 ? ' is-on' : ''}`}
          data-station-photo={i}
          aria-hidden={i === 0 ? undefined : true}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            className="wf-photo-img object-cover"
            style={{ objectPosition: p.position }}
          />
        </div>
      ))}
    </div>
  );
}
