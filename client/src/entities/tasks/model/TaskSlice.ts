import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ITask, ITaskState } from "./types"
import { addTask, changeTask, changeTaskStatus, destroyTask, fetchTasksByUserId } from "../api"

const initialState: ITaskState = {
    tasks: null,
    tasksLoading: false,
    tasksError: null,
}

const handlePending = (state: ITaskState) => {
    state.tasksLoading = true
    state.tasksError = null
}

const handleRejected = (state: ITaskState, action: PayloadAction<string>) => {
    state.tasksLoading = false
    state.tasksError = action.payload
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
            .addCase(fetchTasksByUserId.pending, handlePending)
            .addCase(fetchTasksByUserId.fulfilled, (state: ITaskState, action: PayloadAction<ITask[]>) => {
                state.tasksLoading = false
                state.tasks = action.payload
            })
            .addCase(fetchTasksByUserId.rejected, handleRejected)

            // Add task
            .addCase(addTask.pending, handlePending)
            .addCase(addTask.fulfilled, (state: ITaskState, action: PayloadAction<ITask>) => {
                state.tasksLoading = false
                state.tasks.push(action.payload)
            })
            .addCase(addTask.rejected, handleRejected)

            // Change task
            .addCase(changeTask.pending, handlePending)
            .addCase(changeTask.fulfilled, (state: ITaskState, action: PayloadAction<ITask>) => {
                state.tasksLoading = false
                state.tasks[action.payload.id] = action.payload
            })
            .addCase(changeTask.rejected, handleRejected)

            // Change task status
            .addCase(changeTaskStatus.pending, handlePending)
            .addCase(changeTaskStatus.fulfilled, (state: ITaskState, action: PayloadAction<ITask>) => {
                state.tasksLoading = false
                state.tasks[action.payload.id] = action.payload
            })
            .addCase(changeTaskStatus.rejected, handleRejected)

            // Destroy task
            .addCase(destroyTask.pending, handlePending)
            .addCase(destroyTask.fulfilled, (state: ITaskState, action: PayloadAction<number>) => {
                state.tasksLoading = false
                state.tasks.splice(action.payload, 1)
            })
            .addCase(destroyTask.rejected, handleRejected)
    },
})

// export const { setFilters } = taskSlice.actions
export default taskSlice.reducer