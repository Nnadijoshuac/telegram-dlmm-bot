// Minimal Node globals and fetch declarations to prevent TS build errors on CI

declare var process: {
  env: Record<string, string | undefined>;
};

declare var console: {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

declare function setInterval(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): any;
declare function clearInterval(id: any): void;

// Node 18+ global fetch
declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;

declare var process: {
  env: Record<string, string | undefined>;
};


