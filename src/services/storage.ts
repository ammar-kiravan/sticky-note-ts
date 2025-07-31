import {LocalData} from "../types";


class Storage {
    source: 'local';

    constructor({ source = 'local' }: { source?: 'local' } = {}) {
        this.source = source;
    }
    get(keyOrUrl: string, sourceOverride?: 'local'): LocalData | null {
            console.log(`Getting from local storage with key: ${keyOrUrl}`);
            const data = localStorage.getItem(keyOrUrl);
            try {
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('Error parsing local storage data:', e);
                return null;
            }
    }
    save(
        keyOrUrl: string,
        data: LocalData,
        sourceOverride?: 'local',
    ): void | Promise<void> {
            console.log(`Saving to local storage with key: ${keyOrUrl}`);
            console.log(data)
            localStorage.setItem(keyOrUrl, JSON.stringify(data));
    }
}

export const storageService = new Storage();