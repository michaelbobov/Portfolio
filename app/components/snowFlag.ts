// The three.js snow (Snow3D) is on trial: ?snow=3d turns it on for this tab, ?snow=css turns it back off.
// Until it's chosen, the CSS snow stays. Never with reduced motion (the CSS snow holds still there).
export function wantsSnow3D() {
  if (typeof window === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (typeof OffscreenCanvas === 'undefined') return false;
  const q = new URLSearchParams(location.search).get('snow');
  try {
    if (q === '3d') sessionStorage.setItem('mb-snow3d', '1');
    if (q === 'css') sessionStorage.removeItem('mb-snow3d');
    return sessionStorage.getItem('mb-snow3d') === '1';
  } catch {
    return q === '3d';
  }
}
