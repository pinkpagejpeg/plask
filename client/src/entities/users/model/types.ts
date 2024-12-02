export interface IUserState {
    user: IUser | null,
    isAuth: boolean,
    authLoading: boolean,
    authError: string | null
}
export interface IUser {
    id: number | null,
    email: string | null,
    // password: string | null,
    role: string | null,
    img: string | null,
}

export interface IChangeUserReturnedValue {
    id: number,
    email: string,
    role: string,
}