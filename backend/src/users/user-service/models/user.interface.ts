

export interface UserI
{
    id: number;

    nick: string;

    email?: string;

    avatar?: string;

    authentication?: boolean;

    secret?: string;
}