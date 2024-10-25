export interface IGoalState {
    goals: IGoal[] | null,
}

export interface IGoal {
    id: number,
    info: string,
    subgoals: IGoalItem[] | null,
    userId: number,
}

export interface IGoalItem {
    id: number,
    info: string,
    status: boolean,
    goalId: number,
}