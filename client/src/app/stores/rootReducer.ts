import { combineReducers } from "@reduxjs/toolkit"
import { userReducer } from "../../entities/users"

export const rootReducer = combineReducers({
    user: userReducer
})