// Minimal local type shims so `tsc --noEmit` can run in restricted environments
// where npm packages are unavailable.

declare namespace React {
  type ReactNode = any;
  type ElementType = any;
  type FC<P = {}> = (props: P) => any;
  type ChangeEvent<T = any> = { target: T };
  type RefObject<T> = { current: T | null };
  type SVGProps<T> = Record<string, any>;
  type ErrorInfo = any;
}

declare module 'react' {
  export = React;
  export as namespace React;
  export const useState: {
    <T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
    <T>(initial: () => T): [T, (value: T | ((prev: T) => T)) => void];
  };
  export const useEffect: (...args: any[]) => any;
  export const useMemo: (...args: any[]) => any;
  export const useRef: <T>(initial: T | null) => React.RefObject<T>;
  export const useCallback: <T extends (...args: any[]) => any>(fn: T, deps: any[]) => T;
  export const memo: <T>(component: T) => T;
  export const lazy: (factory: () => Promise<any>) => any;
  export const Suspense: any;
  export const StrictMode: any;
  export class Component<P = any, S = any> {
    props: P;
    state: S;
    constructor(props: P);
    setState(state: Partial<S>): void;
  }
}

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export const jsx: any;
  export const jsxs: any;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): { render(node: any): void };
}

declare module 'react-markdown';
declare module 'motion/react';
declare module 'lucide-react';

declare module '@capacitor/core' {
  export const Capacitor: { getPlatform: () => string; isNativePlatform: () => boolean };
  export const CapacitorHttp: { request: (options: any) => Promise<any>; post: (options: any) => Promise<any> };
}
declare module '@capacitor/haptics';
declare module '@capacitor/status-bar';
declare module '@google/genai';
declare module 'replicate';

declare module '@huggingface/inference' {
  export class HfInference {
    constructor(apiKey?: string);
    textToImage(args: any): Promise<Blob>;
  }
}

declare const process: {
  env: Record<string, string | undefined>;
};

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
