export interface GameRoom {
    gameRoomId: string;
    gameRoomName: string;
    isGamePublic: boolean;
    gameRoomPassword?: string;
    gameMasterId: string;
    playersId: Array<string>;
    charactersId: Array<string>;
    playersAlloted: number;
    charactersPerPlayerAlloted?: number;
    totalCharactersAlloted?: number;
    currentRound: number;
    totalRounds?: number;
    roundCountDown?: number;
    charactersTurnOrder: Array<string>;
    currentCharacterTurn: string;
    currentCharacterTurnIndex: number;
    isTurnTimerOn: boolean;
    turnTimerSeconds?: number;
}

export function CreateGameRoomObject(): GameRoom {
    return {
        gameRoomId: '',
        gameRoomName: '',
        isGamePublic: false,
        gameRoomPassword: null,
        gameMasterId: '',
        playersId: [],
        charactersId: [],
        playersAlloted: 4,
        charactersPerPlayerAlloted: 1,
        totalCharactersAlloted: null,
        currentRound: 0,
        totalRounds: 0,
        roundCountDown: null,
        charactersTurnOrder: [],
        currentCharacterTurn: '',
        currentCharacterTurnIndex: 0,
        isTurnTimerOn: false,
        turnTimerSeconds: null
    }
} 

