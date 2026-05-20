import { ICommonState } from "@redux"

export interface ITaskState extends ICommonState {
    tasks: ITask[] | null,
    count: number
}

export interface ITask {
    id: number,
    info: string,
    status: boolean,
    userId: number,
}

export interface ITasks  {
    tasks: ITask[],
    count: number
}