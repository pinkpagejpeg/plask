import { ICommonState } from "@redux"

export interface IUserState extends ICommonState {
    user: IUser | null,
    isAuth: boolean,
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