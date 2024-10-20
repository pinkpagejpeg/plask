import { Info } from '../../pages/info'
import { Admin } from '../../pages/admin'
import { Welcome } from '../../pages/welcome'
import { Auth } from '../../pages/auth'
import { Feedback } from '../../pages/feedback'
import { Goals } from '../../pages/goals'
import { Tasks } from '../../pages/tasks'
import { Profile } from '../../pages/profile'
import { Users } from '../../pages/users'
import { Appeals } from '../../pages/appeals'
import { Subgoals } from '../../pages/subgoals'
import { ADMIN_FEEDBACK_ROUTE, ADMIN_ROUTE, ADMIN_USER_ROUTE, FEEDBACK_ROUTE, GOALS_ITEM_ROUTE, GOALS_ROUTE, INFO_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, REGISTRATION_ROUTE, TASKS_ROUTE, WELCOME_ROUTE } from '../../shared/config'
import { RouteObject } from 'react-router-dom'

export const authRoutes: RouteObject[] = [
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
        Component: Goals
    },
    {
        path: GOALS_ITEM_ROUTE + '/:id',
        Component: Subgoals
    },
    {
        path: TASKS_ROUTE,
        Component: Tasks
    }
]

export const manageRoutes: RouteObject[] = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: ADMIN_USER_ROUTE,
        Component: Users
    },
    {
        path: ADMIN_FEEDBACK_ROUTE,
        Component: Appeals
    }
]

export const publicRoutes: RouteObject[] = [
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