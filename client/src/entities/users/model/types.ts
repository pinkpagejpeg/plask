import { ICommonState } from "@redux"

export interface IUserState extends ICommonState {
    user: IUser | null,
    isAuth: boolean,
    loading: boolean,
    error: string | null
}

export interface IUser {
    id: number,
    email: string,
    password: string,
    role: string,
    img: string,
}

export interface IChangeUserReturnedValue {
    id: number,
    email: string,
    role: string,
}