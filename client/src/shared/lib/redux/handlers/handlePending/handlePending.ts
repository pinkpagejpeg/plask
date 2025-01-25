import { ICommonState } from "../../state"

/**
 * Handles the rejected state for any slice with a common state structure.
 * 
 * @param state - The slice state that conforms to ICommonState.
 */
export const handlePending = <T extends ICommonState>(state: T) => {
    state.loading = true;
    state.error = null;
}

/**
 * Factory function to create a reusable rejected handler for extraReducers.
 * 
 * @returns A pre-configured handler function for rejected cases.
 */
export const createPendingHandler = <T extends ICommonState>() => 
    (state: T) => handlePending(state);