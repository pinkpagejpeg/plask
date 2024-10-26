export interface IUserState {
    user: IUser | null,
    isAuth: boolean,
    authLoading: boolean,
}
export interface IUser {
    id: number | null,
    email: string | null,
    password: string | null,
    role: string | null,
    img: string | null,
}