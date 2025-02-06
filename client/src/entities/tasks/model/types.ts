import { ICommonState } from "shared/store"

export interface ITaskState extends ICommonState {
    tasks: ITask[] | null,
}

export interface ITask {
    id: number,
    info: string,
    status: boolean,
    userId: number,
}