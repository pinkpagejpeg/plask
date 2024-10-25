import { EnhancedStore } from "@reduxjs/toolkit"
import { store } from "../../../app/stores"

// export type AppDispatch = EnhancedStore["dispatch"]
export type AppDispatch = typeof store.dispatch