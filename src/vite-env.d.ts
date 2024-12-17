/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_LEVELS: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_SECRET_KEY: string;
  readonly VITE_STRIPE_WEBHOOK_SECRET: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@netlify/functions' {
  export interface HandlerEvent {
    body: string | null;
    headers: { [header: string]: string | undefined };
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    queryStringParameters: { [parameter: string]: string | undefined };
    rawUrl: string;
  }

  export interface HandlerResponse {
    statusCode: number;
    body?: string;
    headers?: { [header: string]: string | string[] };
    isBase64Encoded?: boolean;
  }

  export interface Context {
    clientContext: {
      identity: {
        url: string;
        token: string;
      };
      user: {
        email: string;
        sub: string;
      };
    };
  }

  export type Handler = (event: HandlerEvent, context: Context) => Promise<HandlerResponse>;
}

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export type IconType = FC<SVGProps<SVGSVGElement>>;
}