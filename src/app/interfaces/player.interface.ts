export interface Player {
    id: string;
    userName: string;
    email: string;
    emailVerified: boolean;
    charactersId: Array<string>;
    photoUrl?: string;
}

export function CreateUser(id: string, userName: string, email: string, emailVerified: boolean = false, photoUrl?: string): Player {
    const player: Player = {
        id,
        userName,
        email,
        emailVerified,
        charactersId: [],
        photoUrl
    }
    return player;
}
