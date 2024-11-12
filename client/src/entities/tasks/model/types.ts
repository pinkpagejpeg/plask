export interface ITaskState {
    tasks: ITask[] | null,
    tasksLoading: boolean,
    tasksError: string | null,
}

export interface ITask {
    id: number,
    info: string,
    status: boolean,
    userId: number,
}