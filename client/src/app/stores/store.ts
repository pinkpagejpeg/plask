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

declare global {
    type RootState = ReturnType<typeof rootReducer>
    type AppDispatch = typeof store.dispatch
}