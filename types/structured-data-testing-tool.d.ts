declare module 'structured-data-testing-tool' {
  export function parse(url: string): Promise<{
    passed: boolean;
    warnings?: any[];
    errors?: any[];
  }>;
}