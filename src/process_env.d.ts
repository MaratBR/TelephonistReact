declare global {
  const process: { env: NodeJS.ProcessEnv };

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      VERSION: string;
      API_URL?: string;
    }
  }
}

export {};
