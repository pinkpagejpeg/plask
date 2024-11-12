import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ITask, ITaskState } from "./types"
import { addTask, destroyTask, fetchTasksByUserId } from "../api"

const initialState: ITaskState = {
    tasks: null,
    tasksLoading: false,
    tasksError: null,
}

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        // setFilters(state, action) {
        //     state.tasks = action.payload
        // },
        // setSearchQuery(state, action) {
        //     state.tasks = action.payload
        // },
    },
    extraReducers: (builder) => {
        builder
            // fetchTasksByUserId
            .addCase(fetchTasksByUserId.pending, (state) => {
                state.tasksLoading = true
            })
            .addCase(fetchTasksByUserId.fulfilled, (state, action: PayloadAction<ITask[]>) => {
                state.tasksLoading = false
                state.tasks = action.payload
            })
            .addCase(fetchTasksByUserId.rejected, (state, action: PayloadAction<string>) => {
                state.tasksLoading = false
                state.tasksError = action.payload
            })
            // Add task
            .addCase(addTask.pending, (state) => {
                state.tasksLoading = true
            })
            .addCase(addTask.fulfilled, (state, action: PayloadAction<ITask>) => {
                state.tasksLoading = false
                state.tasks.push(action.payload)
            })
            .addCase(addTask.rejected, (state, action: PayloadAction<string>) => {
                state.tasksLoading = false
                state.tasksError = action.payload
            })
            // Change task

            // Change task status

            // Destroy task
            .addCase(destroyTask.pending, (state)=> {
                state.tasksLoading = true
            })
            .addCase(destroyTask.fulfilled, (state, action: PayloadAction<number>)=> {
                state.tasksLoading = false
                state.tasks.splice(action.payload, 1)
            })
            .addCase(destroyTask.rejected, (state, action: PayloadAction<string>)=> {
                state.tasksLoading = false
                state.tasksError = action.payload
            })
    },
})

// export const { setFilters } = taskSlice.actions
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