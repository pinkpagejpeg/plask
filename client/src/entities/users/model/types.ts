import { ICommonState } from "shared/store"

export interface IUserState extends ICommonState {
    user: IUser | null,
    isAuth: boolean,
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