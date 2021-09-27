

export interface UserI
{
    id: number;

    nick: string;

    email?: string;

    avatar?: string;

    status?: string;

    authentication?: boolean;

    secret?: string;

    blackList?: string[];
    
    isBanned?: boolean;

    isAdmin?: boolean;

    wins?: number;

    defeats?: number;

    coalition?: string;

    user42?: string;

    friendsId?: number[];
}