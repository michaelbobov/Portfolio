// "Off the clock": the small personal column beside "Today" on the homepage.
// The column only renders once this list has entries, so it ships empty. Keep each one short,
// with an optional note on the right (a place, a number, a year).
//
// Example:
// export const offTheClock: OffTheClockItem[] = [
//   { what: 'Climbing in the Cascades', note: 'Weekends' },
//   { what: 'Learning Japanese', note: 'Year two' },
//   { what: 'Making ramen from scratch', note: 'Ongoing' },
// ];

export type OffTheClockItem = {
  /** What it is, e.g. 'Learning Japanese' */
  what: string;
  /** Shown on the right in muted ink, e.g. 'Year two' */
  note?: string;
};

export const offTheClock: OffTheClockItem[] = [];
