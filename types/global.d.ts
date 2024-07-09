declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      CLIENT_ID: string;
      PUBLIC_KEY: string;
    }
  }
}

export {};
