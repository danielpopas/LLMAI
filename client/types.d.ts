// client/types.d.ts
declare global {
  interface Window {
    puter?: {
      auth: {
        isSignedIn: () => Promise<boolean>
        signIn: () => Promise<unknown>
      }
      ai: {
        chat: (
          content: string | Array<{
            role: string;
            content: string | Array<{
              type: string;
              text?: string;
              source?: {
                type: string;
                media_type: string;
                data: string;
              };
            }>;
          }>,
          imageOrTestModeOrOptions?: string | File | Blob | boolean | { model?: string; stream?: boolean },
          testModeOrOptions?: boolean | { model?: string; stream?: boolean },
          options?: { model?: string; stream?: boolean }
        ) => Promise<
          | {
              message?: {
                content?: Array<{ text?: string }>
              }
            }
          | string
        >
        txt2speech: (
          text: string,
          options?: { voice?: string }
        ) => Promise<Blob>
        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>
      }
    }
  }
}

export {}
