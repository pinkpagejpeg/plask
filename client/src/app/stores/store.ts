import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "./rootReducer"
import { thunk } from "redux-thunk"

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: true,
    }).concat(thunk)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch