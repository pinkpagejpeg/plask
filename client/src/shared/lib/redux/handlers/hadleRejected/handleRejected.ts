import { PayloadAction } from "@reduxjs/toolkit"
import { ICommonState } from "../../state"

/**
 * Handles the rejected state for any slice with a common state structure.
 * 
 * @param state - The slice state that conforms to ICommonState.
 * @param action - The rejected action with a string payload (error message).
 */
export const handleRejected = <T extends ICommonState>(state: T, action: PayloadAction<string>) => {
    state.loading = false;
    state.error = action.payload;
};

/**
 * Factory function to create a reusable rejected handler for extraReducers.
 * 
 * @returns A pre-configured handler function for rejected cases.
 */
export const createRejectedHandler = <T extends ICommonState>() => 
    (state: T, action: PayloadAction<string>) => handleRejected(state, action);