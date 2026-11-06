// Little seasonal touches on the homepage's dolls: in December they wear Santa hats, in October a pumpkin
// stands beside the set. The season is the visitor's own date, worked out before first paint (layout.tsx
// sets data-season on <html>), so the static page never goes stale. To preview one any time, add
// ?season=december or ?season=october to the address (?season=none turns them off).
export type Season = 'december' | 'october';

/** The inline script for <head>: data-season from ?season= or the date */
export const SEASON_SCRIPT = "try{var q=new URLSearchParams(location.search).get('season'),m=new Date().getMonth(),s=q==='december'||q==='christmas'?'december':q==='october'||q==='halloween'?'october':q==='none'?'':m===11?'december':m===9?'october':'';if(s)document.documentElement.dataset.season=s}catch(e){}";

export const currentSeason = (): Season | null => {
  const s = typeof document === 'undefined' ? '' : document.documentElement.dataset.season;
  return s === 'december' || s === 'october' ? s : null;
};
