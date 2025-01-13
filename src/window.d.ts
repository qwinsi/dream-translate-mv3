interface Window {
    scribbleTmp: string;
    dictionarySounds: Record<string, string>;
    lastHistory: string;
    _Audio: Audio;
    audioSrc: {url: string, blob: Blob};
    isFirefox: boolean;
}