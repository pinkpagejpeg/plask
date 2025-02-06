import { FC, SetStateAction, useState } from 'react'
import classes from './Auth.module.scss'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ADMIN_ROUTE, INFO_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, WELCOME_ROUTE } from '../../../shared/config'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { registration, login } from '../../../shared/api'
import { useAppDispatch } from 'shared/store'
import { fetchUserById } from '../../../entities/users'

export const Auth: FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [hcaptchaToken, setHcaptchaToken] = useState('')
    const dispatch = useAppDispatch()

    const authButtonHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        try {
            if (hcaptchaToken) {
                let data

                if (isLogin) {
                    data = await login(email, password, hcaptchaToken)
                }
                else {
                    data = await registration(email, password, hcaptchaToken)
                }

                dispatch(fetchUserById(data.id))

                if (data.role === 'ADMIN') {
                    navigate(`${ADMIN_ROUTE}?from=${isLogin ? 'login' : 'registration'}`)
                } else {
                    navigate(`${WELCOME_ROUTE}?from=${isLogin ? 'login' : 'registration'}`)
                }
            } else {
                alert('Необходимо пройти капчу')
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При получении информации о пользователе возникла ошибка: ${error.message}`)
            } else {
                alert("При получении информации о пользователе возникла неизвестная ошибка")
            }
        }
    }

    const emailChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setEmail(event.target.value)
    }

    const passwordChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setPassword(event.target.value)
    }

    const verifyCaptchaHandler = (token: string) => {
        setHcaptchaToken(token)
    }

    return (
        <div className={classes.container}>
            <div className={classes.auth__wrapper}>
                <h2 className={classes.plask}>Plask</h2>
                <form className={classes.auth__form}>
                    <h3 className={classes.title}>
                        {isLogin ? 'Авторизация' : 'Регистрация'}
                    </h3>
                    <input
                        className={classes.input}
                        type='email' placeholder='Email'
                        value={email}
                        onChange={emailChangeHandler}
                        required />
                    <input
                        className={classes.input}
                        type='password' placeholder='Пароль'
                        value={password}
                        onChange={passwordChangeHandler}
                        required />
                    <HCaptcha
                        sitekey='6fd23c34-4ef8-4d2e-90d2-f444b6acaed4'
                        theme="dark"
                        onVerify={verifyCaptchaHandler}
                    />
                    <button className={classes.button_light} type="submit" onClick={authButtonHandler}>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                    {isLogin ?
                        <p className={classes.auth__info}>
                            Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрироваться</NavLink>
                        </p>
                        : <p className={classes.auth__info}>
                            Уже есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти</NavLink>
                        </p>
                    }
                </form>
                <NavLink to={INFO_ROUTE} className={classes.auth__back}>Вернуться на главную</NavLink>
            </div>
        </div>
    )
}