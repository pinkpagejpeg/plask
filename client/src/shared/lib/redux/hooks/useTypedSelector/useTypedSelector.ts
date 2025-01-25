import { RootState } from "app/stores"
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector