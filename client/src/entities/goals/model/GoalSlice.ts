import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGoal, IGoalState } from "./types"
import { addGoal, changeGoal, destroyGoal, fetchGoalsByUserId } from "../api"

const initialState: IGoalState = {
    goals: null,
    goalsLoading: false,
    goalsError: null,
}

const handlePending = (state: IGoalState) => {
    state.goalsLoading = true
    state.goalsError = null
}

const handleRejected = (state: IGoalState, action: PayloadAction<string>) => {
    state.goalsLoading = false
    state.goalsError = action.payload
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
            .addCase(fetchGoalsByUserId.pending, handlePending)
            .addCase(fetchGoalsByUserId.fulfilled, (state: IGoalState, action: PayloadAction<IGoal[]>) => {
                state.goalsLoading = false
                state.goals = action.payload
            })
            .addCase(fetchGoalsByUserId.rejected, handleRejected)

            // addGoal
            .addCase(addGoal.pending, handlePending)
            .addCase(addGoal.fulfilled, (state: IGoalState, action: PayloadAction<IGoal>) => {
                state.goalsLoading = false
                state.goals = [action.payload, ...state.goals]
            })
            .addCase(addGoal.rejected, handleRejected)

            // destroyGoal
            .addCase(destroyGoal.pending, handlePending)
            .addCase(destroyGoal.fulfilled, (state: IGoalState, action: PayloadAction<number>) => {
                state.goalsLoading = false
                state.goals = state.goals.filter(goal => goal.id !== action.payload)
            })
            .addCase(destroyGoal.rejected, handleRejected)

            // changeGoal
            .addCase(changeGoal.pending, handlePending)
            .addCase(changeGoal.fulfilled, (state: IGoalState, action: PayloadAction<IGoal>) => {
                state.goalsLoading = false
                const index = state.goals.findIndex(goal => goal.id === action.payload.id)
                if (index !== -1) {
                    state.goals[index] = action.payload
                }
            })
            .addCase(changeGoal.rejected, handleRejected)

    }
})

// export const { setFilters } = goalSlice.actions
export default goalSlice.reducer

// import { makeAutoObservable } from 'mobx'

// export default class GoalStore {
//     constructor() {
//         this._goal = []
//         this._goalProgress = {}
//         makeAutoObservable(this)
//     }

//     setGoal(goal) {
//         this._goal = goal
//     }

//     setGoalProgress(goalId, progress) {
//         this._goalProgress[goalId] = progress;
//     }

//     addGoalList(goal) {
//         this._goal.unshift(goal)
//     }

//     editGoal(goalId, updatedGoal) {
//         this._goal = this._goal.map(goal => {
//             if (goal.id === goalId) {
//                 return updatedGoal;
//             }
//             return goal;
//         });
//     }

//     removeGoal(goalId) {
//         this._goal = this._goal.filter(goal => goal.id !== goalId);
//     }

//     getGoalByUserId(userId) {
//         return this._goal.filter(goal => goal.userId === userId);
//     }

//     getGoalById(goalId) {
//         return this._goal.filter(goal => goal.id === goalId);
//     }

//     get goal() {
//         return this._goal
//     }

//     get goalProgress() {
//         return this._goalProgress;
//     }
// }