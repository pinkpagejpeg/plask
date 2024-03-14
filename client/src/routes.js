import Info from './pages/Info'
import Admin from './pages/Admin'
import Welcome from './pages/Welcome'
import Auth from './pages/Auth'
import { ADMIN_ROUTE, INFO_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, WELCOME_ROUTE } from './utils/consts'

export const authRoutes = [
    {
        path: WELCOME_ROUTE,
        Component: Welcome
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
    },
    {
        path: INFO_ROUTE,
        Component: Info
    }
]