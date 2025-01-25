export interface IGoalCheckbox {
    label: string,
    checked: boolean,
    goalItemId: number,
    changeSubgoal: (goalItemId: number, info: string) => void,
    changeSubgoalStatus: (goalItemId: number, status: boolean) => void,
    destroySubgoal: (goalItemId: number) => void,
}