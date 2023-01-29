export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface HTMLAudioElement {
    replay: () => Promise<void>;
  }
}
