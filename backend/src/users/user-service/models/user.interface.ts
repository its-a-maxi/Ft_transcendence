

export interface UserI
{
    id: number;

    nick: string;

    email?: string;

    avatar?: string;

    authentication?: boolean;

    secret?: string;

    blackList?: string[];
    
    isBanned?: boolean;
}