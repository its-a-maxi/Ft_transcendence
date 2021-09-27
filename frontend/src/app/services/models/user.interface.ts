

export interface UserI
{
    id: number;

    nick: string;

    email?: string;

    avatar?: string | undefined;

    authentication?: boolean;

    secret?: string;
    
    isAdmin?: boolean;

    status?: string;

    isBlocked?: boolean;

    friendsId?: Array<number>;

    wins?: number;

    defeats?: number;

    coalition?: string;

    user42?: string;
}