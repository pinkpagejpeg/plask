import { Provider } from "react-redux"
import { store } from "../stores"
import { ReactNode } from "react"

interface MainProviderProps {
    children: ReactNode
}

export const MainProvider = ({ children }: MainProviderProps) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}