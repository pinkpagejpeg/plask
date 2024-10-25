import { EnhancedStore } from "@reduxjs/toolkit"
import { store } from "../../../app/stores"

// export type RootState<IState> = ReturnType<EnhancedStore<IState>["getState"]>
// export type RootState = ReturnType<EnhancedStore["getState"]>
export type RootState = ReturnType<typeof store.getState>