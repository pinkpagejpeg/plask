import { createBrowserRouter, RouteObject } from "react-router-dom"
import { publicRoutes, manageRoutes, authRoutes } from "./routes"
import { useTypedSelector } from "../../features/hooks"
import { NotFound } from "../../pages/notFound"

export const router = () => {
    const { user, isAuth } = useTypedSelector(state => state.user);

    let routes: RouteObject[] = [...publicRoutes]

    if (isAuth) {
        routes = [...routes, ...authRoutes]
    }

    if (user !== null && user.role === 'ADMIN') {
        routes = [...routes, ...manageRoutes]
    }

    // routes.push({ 
    //     path: "*", 
    //     element: <NotFound /> 
    // })

    return createBrowserRouter(routes)
}