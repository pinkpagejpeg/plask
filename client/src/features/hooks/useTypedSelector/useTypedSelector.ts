import { useSelector } from "react-redux"
import { RootState } from "./types"

export const useTypedSelector = useSelector.withTypes<RootState>()