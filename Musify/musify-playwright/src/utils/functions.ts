import { Artist } from "./interface";

export class Functions{

    static generateArtists(start: number, end: number) {
        const artists: Artist[] = [];
        for (let i = start; i <= end; i++) {
            artists.push({ id: i, type: 'PERSON', name: `Artist ${i}` });
        }
        return artists;
    }

    static getOtherType(type: string){
        if(type == 'BAND')
            return 'PERSON'
        if(type == 'PERSON')
            return 'BAND'
        return 'invalid type'
    }

    static switchName(name: string){
        if(name == 'Left')
            return 'Right';
        if(name == 'Right')
            return 'Left';
        return 'Right';
    }

    static generateRandomNumber(min: number = 1000, max: number = 9999): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}