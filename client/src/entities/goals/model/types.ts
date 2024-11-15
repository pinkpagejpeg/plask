export interface IGoalState {
    goals: IGoal[] | null,
    goalsLoading: boolean,
    goalsError: string | null,
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