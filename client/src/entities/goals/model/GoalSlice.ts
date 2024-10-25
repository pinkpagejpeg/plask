import { createSlice } from "@reduxjs/toolkit"
import { IGoalState } from "./types"

const initialState: IGoalState = {
    goals: null
}

const goalSlice = createSlice({
    name: "goal",
    initialState,
    reducers: {
        setGoals(state, action) {
            state.goals = action.payload
        },
        // setGoalProgress(state, action) {

        // }
    }
})

export const { setGoals } = goalSlice.actions
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