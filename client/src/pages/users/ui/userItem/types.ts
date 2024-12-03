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