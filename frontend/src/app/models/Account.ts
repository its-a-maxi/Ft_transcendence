export interface Account
{
    id?: number,
    user?: string,
    nickname?: string | null,
    email?: string,
    profilePicture?: string | ArrayBuffer | undefined,
    twoFa?: boolean
};