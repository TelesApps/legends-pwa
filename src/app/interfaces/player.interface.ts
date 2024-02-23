import { Character } from "./character.interface";

export interface Player {
    playerId: string;
    playerStatus: 'visitor' | 'player' | 'gameMaster';
    userName: string;
    email: string;
    emailVerified: boolean;
    charactersId: Array<string>;
    selectedCharactersIds: Array<string>;
    gameRooms: Array<string>;
    currentGameRoom: string;
    photoUrl?: string;
}

export function CreateUser(
    playerId: string, userName: string, email: string, emailVerified: boolean = false, photoUrl?: string, playerStatus = 'visitor'): Player {
    const player: Player = {
        playerId,
        playerStatus: playerStatus as 'visitor' | 'player' | 'gameMaster',
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
