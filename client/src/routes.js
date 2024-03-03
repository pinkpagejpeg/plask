import Admin from './pages/Admin'
import WelcomPage from './pages/WelcomePage'
import Auth from './pages/Auth'
import { ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, WELCOME_ROUTE } from './utils/consts'

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: WELCOME_ROUTE,
        Component: WelcomPage
    }
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