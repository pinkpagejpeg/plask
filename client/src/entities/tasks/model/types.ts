export interface ITaskState {
    tasks: ITask[] | null,
}

export interface ITask {
    id: number,
    info: string,
    status: boolean,
    userId: number,
}