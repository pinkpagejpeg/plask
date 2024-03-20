import Info from './pages/Info'
import Admin from './pages/Admin'
import Welcome from './pages/Welcome'
import Auth from './pages/Auth'
import Feedback from './pages/Feedback'
import Goal from './pages/Goal'
import Task from './pages/Task'
import Profile from './pages/Profile'
import { ADMIN_ROUTE, FEEDBACK_ROUTE, GOALS_ROUTE, INFO_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, REGISTRATION_ROUTE, TASKS_ROUTE, WELCOME_ROUTE } from './utils/consts'

export const authRoutes = [
    {
        path: WELCOME_ROUTE,
        Component: Welcome
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: FEEDBACK_ROUTE,
        Component: Feedback
    },
    {
        path: GOALS_ROUTE,
        Component: Goal
    },
    {
        path: TASKS_ROUTE,
        Component: Task
    }

    // {
    //     path: ADMIN_ROUTE,
    //     Component: Admin
    // }
]

export const publicRoutes = [
    {
        path: INFO_ROUTE,
        Component: Info
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
]