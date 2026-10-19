// "Daily stops": the exit-sign section on the homepage (yellow A / B / C exits).
// The section only renders once at least one city has stops, so this ships empty.
//
// Example:
// export const dailyStops: DailyStopsCity[] = [
//   {
//     city: 'Seattle',
//     note: 'home',
//     stops: [
//       { exit: 'A', what: 'Ramen', spot: 'Name of the shop' },
//       { exit: 'B', what: 'Coffee', spot: 'Name of the café' },
//       { exit: 'C', what: 'Rainy-day walk', spot: 'Name of the route' },
//     ],
//   },
//   {
//     city: 'Japan',
//     note: 'favorite place',
//     stops: [
//       { exit: 'A', what: 'Konbini order', spot: 'The order' },
//       { exit: 'B', what: 'Train line', spot: 'The line' },
//       { exit: 'C', what: 'Neighborhood', spot: 'The neighborhood' },
//     ],
//   },
// ];

export type DailyStop = {
  /** Exit letter shown on the yellow sign, e.g. 'A' */
  exit: string;
  /** What kind of stop, e.g. 'Coffee' */
  what: string;
  /** The actual place or pick */
  spot: string;
};

export type DailyStopsCity = {
  city: string;
  /** Shown after the city name, e.g. 'home' */
  note: string;
  stops: DailyStop[];
};

export const dailyStops: DailyStopsCity[] = [];
