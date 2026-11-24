import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "./rootReducer"

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: true,
    })
})

declare global {
    type RootState = ReturnType<typeof rootReducer>
    type AppDispatch = typeof store.dispatch
}