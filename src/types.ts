export type Note = {
    id: string;
    initialX: number;
    initialY: number;
    zIndex: number;
    initWidth: number | undefined;
    initHeight: number | undefined;
};

export type LocalData = Note[] | null;
