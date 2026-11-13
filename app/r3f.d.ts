// React Three Fiber 8 adds its elements (<mesh>, <group> …) to the global JSX namespace, but this project's
// React 19 type definitions read element types from React.JSX, so they're added there too
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}
