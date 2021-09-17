

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
}