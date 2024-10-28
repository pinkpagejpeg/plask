import { createBrowserRouter, RouteObject } from "react-router-dom"
import { publicRoutes, manageRoutes, authRoutes, errorRoutes } from "./routes"
import { IUser } from "../../entities/users"

export const router = (user: IUser, isAuth: boolean, authLoading: boolean) => {
    let routes: RouteObject[] = [
        ...publicRoutes,
        errorRoutes
    ]

    if (!authLoading && user && isAuth) {
        routes = [...routes, ...authRoutes]
    }

    if (!authLoading && user && user.role === 'ADMIN') {
        routes = [...routes, ...manageRoutes]
    }

    return createBrowserRouter(routes)
}