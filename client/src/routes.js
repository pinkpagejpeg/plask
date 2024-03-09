import Admin from './pages/Admin'
import WelcomePage from './pages/WelcomePage'
import Auth from './pages/Auth'
import { ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, WELCOME_ROUTE } from './utils/consts'

export const authRoutes = [
    {
        path: WELCOME_ROUTE,
        Component: WelcomePage
    },
    // {
    //     path: ADMIN_ROUTE,
    //     Component: Admin
    // }
]

export const publicRoutes = [
    // Добавить главную страницу с общей информацией
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    }
]