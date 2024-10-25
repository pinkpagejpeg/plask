import { createSlice } from "@reduxjs/toolkit"
import { ITaskState } from "./types"

const initialState: ITaskState = {
    tasks: null
}

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setTasks(state, action) {
            state.tasks = action.payload
        },
        // addTask() {

        // }, 
        // editTask () {

        // },
        // removeTask () {

        // }
    }
})

export const { setTasks, } = taskSlice.actions
export default taskSlice.reducer

// import { makeAutoObservable } from 'mobx'

// export default class TaskStore {
//     constructor() {
//         this._task = []
//         makeAutoObservable(this)
//     }

//     setTask(task) {
//         this._task = task
//     }

//     addTaskList(task) {
//         this._task.unshift(task)
//     }

//     editTask(taskId, updatedTask) {
//         this._task = this._task.map(task => {
//             if (task.id === taskId) {
//                 return updatedTask;
//             }
//             return task;
//         });
//     }

//     removeTask(taskId) {
//         this._task = this._task.filter(task => task.id !== taskId);
//     }

//     getTaskByUserId(userId) {
//         return this._task.filter(task => task.userId === userId);
//     }

//     get task() {
//         return this._task
//     }
// }