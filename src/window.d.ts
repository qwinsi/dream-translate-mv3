interface Window {
    scribbleTmp: string;
    dictionarySounds: Record<string, string>;
    lastHistory: string;
    _Audio: Audio;
    audioSrc: {url: string, blob: Blob};
    isFirefox: boolean;
    isPopup: boolean;
    textTmp: string;
    // content.js
    textRepeat: string;
    dmxUpdateDate: number;
    _MxDialog: any;
}