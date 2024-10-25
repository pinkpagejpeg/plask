import { combineReducers } from "@reduxjs/toolkit"
import { userReducer } from "../../entities/users"
import { taskReducer } from "../../entities/tasks"
import { goalReducer } from "../../entities/goals"

export const rootReducer = combineReducers({
    user: userReducer,
    task: taskReducer,
    goal: goalReducer,
})