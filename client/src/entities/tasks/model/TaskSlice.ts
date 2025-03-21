import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ITask, ITasks, ITaskState } from "./types"
import { addTask, changeTask, changeTaskStatus, destroyTask, fetchTasksByUserId } from "../api"
import { createPendingHandler, createRejectedHandler } from "shared/store"

const initialState: ITaskState = {
    tasks: null,
    count: 0,
    loading: false,
    error: null,
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
            .addCase(fetchTasksByUserId.pending, createPendingHandler<ITaskState>())
            .addCase(fetchTasksByUserId.fulfilled, (state: ITaskState, action: PayloadAction<ITasks>) => {
                state.loading = false
                state.tasks = action.payload.tasks
                state.count = action.payload.count
            })
            .addCase(fetchTasksByUserId.rejected, createRejectedHandler<ITaskState>())

            // Add task
            .addCase(addTask.pending, createPendingHandler<ITaskState>())
            .addCase(addTask.fulfilled, (state: ITaskState, action: PayloadAction<ITask>) => {
                state.loading = false
                if (state.tasks) {
                    state.tasks = [action.payload, ...state.tasks]
                }
            })
            .addCase(addTask.rejected, createRejectedHandler<ITaskState>())

            // Change task
            .addCase(changeTask.pending, createPendingHandler<ITaskState>())
            .addCase(changeTask.fulfilled, (state: ITaskState, action: PayloadAction<ITask>) => {
                state.loading = false
                if (state.tasks) {
                    const index = state.tasks.findIndex(task => task.id === action.payload.id)
                    if (index !== -1) {
                        state.tasks[index] = { ...action.payload }
                    }
                }
            })
            .addCase(changeTask.rejected, createRejectedHandler<ITaskState>())

            // Change task status
            .addCase(changeTaskStatus.pending, createPendingHandler<ITaskState>())
            .addCase(changeTaskStatus.fulfilled, (state: ITaskState, action: PayloadAction<ITask>) => {
                state.loading = false
                if (state.tasks) {
                    const index = state.tasks.findIndex(task => task.id === action.payload.id)
                    if (index !== -1) {
                        state.tasks[index] = { ...action.payload }
                    }
                }
            })
            .addCase(changeTaskStatus.rejected, createRejectedHandler<ITaskState>())

            // Destroy task
            .addCase(destroyTask.pending, createPendingHandler<ITaskState>())
            .addCase(destroyTask.fulfilled, (state: ITaskState, action: PayloadAction<number>) => {
                state.loading = false
                if (state.tasks) {
                    state.tasks = state.tasks.filter(task => task.id !== action.payload)
                }
            })
            .addCase(destroyTask.rejected, createRejectedHandler<ITaskState>())
    },
})

// export const { setFilters } = taskSlice.actions
export default taskSlice.reducer