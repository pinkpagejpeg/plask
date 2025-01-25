import { createBrowserRouter, RouteObject } from "react-router-dom"
import { publicRoutes, manageRoutes, authRoutes, errorRoutes } from "./routes"
import { IUser } from "../../entities/users"

export const router = (user: IUser, isAuth: boolean, loading: boolean) => {
    let routes: RouteObject[] = [
        ...publicRoutes,
        errorRoutes
    ]

    if (!loading && user && isAuth) {
        routes = [...routes, ...authRoutes]
    }

    if (!loading && user && user.role === 'ADMIN') {
        routes = [...routes, ...manageRoutes]
    }

    return createBrowserRouter(routes)
}