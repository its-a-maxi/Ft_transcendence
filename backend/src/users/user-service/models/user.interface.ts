

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
}