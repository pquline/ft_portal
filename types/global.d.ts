declare module 'minimatch' {
  function minimatch(path: string, pattern: string, options?: any): boolean;
  export = minimatch;
}

declare module 'minimatch/*' {
  const content: any;
  export = content;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}
