import { Character } from "./character.interface";

export interface Player {
    playerId: string;
    userName: string;
    email: string;
    emailVerified: boolean;
    charactersId: Array<string>;
    selectedCharactersIds: Array<string>;
    gameRooms: Array<string>;
    currentGameRoom: string;
    photoUrl?: string;
}

export function CreateUser(playerId: string, userName: string, email: string, emailVerified: boolean = false, photoUrl?: string): Player {
    const player: Player = {
        playerId,
        userName,
        email,
        emailVerified,
        charactersId: [],
        selectedCharactersIds: [],
        gameRooms: [],
        currentGameRoom: '',
        photoUrl
    }
    return player;
}
