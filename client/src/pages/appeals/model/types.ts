export interface IAppealItem {
        id: number,
        info: string,
        date: string,
        status: boolean
        user: {
            email: string,
        },
        userId: number,
}

export interface IAppealItemComponent {
    id: number,
    info: string,
    date: string,
    status: boolean
    userEmail: string,
}