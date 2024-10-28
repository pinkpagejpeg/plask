import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAppDispatch, useTypedSelector } from '../../features/hooks'
import { useEffect, useMemo } from 'react'
import { fetchUserById } from '../../entities/users'
import { check } from '../../shared/api'

export const AppRouter = () => {
    const { user, isAuth, authLoading, authError } = useTypedSelector((state) => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        check().then((data) => {
            dispatch(fetchUserById(data.id))
        })
    }, [])

    const currentRouter = useMemo(() => router(user, isAuth, authLoading), [user, isAuth, authLoading])

    if (authLoading) {
        return <h3>Загрузка...</h3>
    }

    if (authError) {
        return <h3>{authError}</h3>
    }

    return (
        <RouterProvider router={currentRouter}></RouterProvider >
    )
}