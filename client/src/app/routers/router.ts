import { createBrowserRouter, RouteObject } from "react-router-dom"
import { publicRoutes, manageRoutes, authRoutes, errorRoutes } from "./routes"
import { IUser } from "../../entities/users"

export const router = (user: IUser, isAuth: boolean, authLoading: boolean) => {
    let routes: RouteObject[] = [
        ...publicRoutes,
        errorRoutes
    ]

    if (!authLoading && isAuth) {
        routes = [...routes, ...authRoutes]
    }

<<<<<<< HEAD
    if (!authLoading && user !== null && user.role === 'ADMIN') {
=======
    if (user !== null && user.role === 'ADMIN') {
>>>>>>> 9f76c12c39df5042070ca9d1fe95868534b138a6
        routes = [...routes, ...manageRoutes]
    }

    return createBrowserRouter(routes)
}