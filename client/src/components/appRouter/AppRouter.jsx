import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authRoutes, manageRoutes, publicRoutes } from '../../routes'
import { LOGIN_ROUTE } from '../../utils/consts'
import { Context } from '../../main'

const AppRouter = () => {
    const { user } = useContext(Context)

    return (
        <Routes>
            {user.isAuth && authRoutes.map((route) =>
                <Route key={route.path} path={route.path} element={<route.Component />} exact />
            )}
            {user._user.role === 'ADMIN' && manageRoutes.map((route) =>
                <Route key={route.path} path={route.path} element={<route.Component />} exact />
            )}
            {publicRoutes.map((route) =>
                <Route key={route.path} path={route.path} element={<route.Component />} exact />
            )}
            {/* <Route path="/*" element={<Navigate to={LOGIN_ROUTE} />} replace /> */}
            {/* Заменить на 404 редирект */}
        </Routes>
    );
}

export default AppRouter;