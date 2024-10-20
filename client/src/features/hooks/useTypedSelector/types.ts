import { EnhancedStore } from "@reduxjs/toolkit"

// export type RootState<IState> = ReturnType<EnhancedStore<IState>["getState"]>
export type RootState = ReturnType<EnhancedStore["getState"]>