export interface ITaskCheckbox {
    label: string,
    checked: boolean,
    taskId: number,
    allowEdit: boolean,
    updateTask?: (taskId: number, info: string) => void,
    updateTaskStatus?: (taskId: number, status: boolean) => void,
    deleteTask?: (taskId: number) => void,
}