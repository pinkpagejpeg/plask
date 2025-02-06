export interface IAddUser {
    email: string,
    password: string,
    role: string,
}

export interface IChangeUser {
    userId: number,
    email: string,
    password: string,
    role: string,
}

export interface IUserItem {
    user: {
        id: number,
        email: string,
        password: string,
        role: string,
        img: string,
    },
    onUserChange: () => Promise<void>
}