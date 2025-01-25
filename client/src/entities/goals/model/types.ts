import { ICommonState } from "@redux"

export interface IGoalState extends ICommonState{
    goals: IGoal[] | null,
}

export interface IGoal {
    id: number,
    info: string,
    subgoals: IGoalItem[] | null,
    userId: number,
    progress: number
}

export interface IGoalItem {
    id: number,
    info: string,
    status: boolean,
    goalId: number,
}