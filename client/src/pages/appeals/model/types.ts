export interface IAppealItem {
    feedback: {
        id: number,
        info: string,
        date: string,
        status: boolean
        user: {
            email: string,
        },
        userId: number,
    }
}