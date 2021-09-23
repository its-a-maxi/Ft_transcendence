

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

    friends?: Array<UserI>;

    wins?: number;

    defeats?: number;

    coalition?: string;

    user42?: string;
}