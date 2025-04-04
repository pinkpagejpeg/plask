export interface IAddFeedback {
    info: string,
}

export interface IMockFeedback {
    feedback: {
        id: number,
        info: string,
        status: boolean,
        userId: number,
        date: string,
        createdAt: string,
        updatedAt: string,
    }
}