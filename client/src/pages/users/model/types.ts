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
        id: number | null,
        email: string | null,
        password: string | null,
        role: string | null,
        img: string | null,
    },
    onUserChange: () => Promise<void>
}