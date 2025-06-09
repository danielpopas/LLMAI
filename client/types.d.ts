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
          content: string,
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
      }
    }
  }
}

export {}
