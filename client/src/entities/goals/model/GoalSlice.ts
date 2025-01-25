import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGoal, IGoalState } from "./types"
import { addGoal, changeGoal, destroyGoal, fetchGoalsByUserId } from "../api"
import { createPendingHandler, createRejectedHandler } from "@redux"

const initialState: IGoalState = {
    goals: null,
    loading: false,
    error: null,
}

const goalSlice = createSlice({
    name: "goal",
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
            // fetchGoalsByUserId
            .addCase(fetchGoalsByUserId.pending, createPendingHandler<IGoalState>())
            .addCase(fetchGoalsByUserId.fulfilled, (state: IGoalState, action: PayloadAction<IGoal[]>) => {
                state.loading = false
                state.goals = action.payload
            })
            .addCase(fetchGoalsByUserId.rejected, createRejectedHandler<IGoalState>())

            // addGoal
            .addCase(addGoal.pending, createPendingHandler<IGoalState>())
            .addCase(addGoal.fulfilled, (state: IGoalState, action: PayloadAction<IGoal>) => {
                state.loading = false
                state.goals = [action.payload, ...state.goals]
            })
            .addCase(addGoal.rejected, createRejectedHandler<IGoalState>())

            // destroyGoal
            .addCase(destroyGoal.pending, createPendingHandler<IGoalState>())
            .addCase(destroyGoal.fulfilled, (state: IGoalState, action: PayloadAction<number>) => {
                state.loading = false
                state.goals = state.goals.filter(goal => goal.id !== action.payload)
            })
            .addCase(destroyGoal.rejected, createRejectedHandler<IGoalState>())

            // changeGoal
            .addCase(changeGoal.pending, createPendingHandler<IGoalState>())
            .addCase(changeGoal.fulfilled, (state: IGoalState, action: PayloadAction<IGoal>) => {
                state.loading = false
                const index = state.goals.findIndex(goal => goal.id === action.payload.id)
                if (index !== -1) {
                    state.goals[index] = {...action.payload}
                }
            })
            .addCase(changeGoal.rejected, createRejectedHandler<IGoalState>())

    }
})

// export const { setFilters } = goalSlice.actions
export default goalSlice.reducer