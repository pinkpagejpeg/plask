import { Provider } from "react-redux"
import { store } from "../stores"

export const MainProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}