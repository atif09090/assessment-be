export interface JwtPayload {
    id: string;
    email: string;
}

export interface JwtRefreshPayload {
    id: string;
    email:string;
    version: number;
}