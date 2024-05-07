import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { authRoutes, manageRoutes, publicRoutes } from '../../routes'
import { Context } from '../../main'
import NotFound from '../../pages/NotFound'

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
            <Route path="/*" element={<NotFound auth={user.isAuth} role={user._user.role}/>} replace />
        </Routes>
    );
}

export default AppRouter;