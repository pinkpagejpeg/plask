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

export interface IMockAppeal {
    id: number,
    info: string,
    status: boolean,
    userId: number,
    date: string,
    createdAt: string,
    updatedAt: string,
}