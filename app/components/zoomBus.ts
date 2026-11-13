// The homepage zoom's state, shared by the DOM (VillageZoom: the click, the labels, the case-study card)
// and the 3D (DollScene, which may load later and reads the latest state when it does):
// p, how far the dive has got (0 the dolls, 1 inside the village), and focus, the house the camera has
// gone to (-1 none)
type State = { p: number; focus: number; hover: number };
let state: State = { p: 0, focus: -1, hover: -1 };
const listeners = new Set<(s: State) => void>();

export const zoomBus = {
  get: () => state,
  set(next: Partial<State>) {
    const s = { ...state, ...next };
    if (s.p === state.p && s.focus === state.focus && s.hover === state.hover) return;
    state = s;
    listeners.forEach((fn) => fn(state));
  },
  on(fn: (s: State) => void) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
};
