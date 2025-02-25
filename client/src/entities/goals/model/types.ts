import { ICommonState } from "shared/store"

export interface IGoalState extends ICommonState{
    goals: IGoal[] | null,
    count: number
}

export interface IGoal {
    id: number,
    info: string,
    subgoals: IGoalItem[] | null,
    userId: number,
    progress: number
}

export interface IGoals  {
    goals: IGoal[],
    count: number
}

export interface IGoalItem {
    id: number,
    info: string,
    status: boolean,
    goalId: number,
}

export interface IGoalItems  {
    goalItems: IGoalItem[],
    count: number
}