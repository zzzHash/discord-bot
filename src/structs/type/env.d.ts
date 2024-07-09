declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      CLIENT_ID: number;
      PUBLIC_KEY: string;
    }
  }
}

export {};
