import React, { useContext, useState } from 'react'
import classes from '../styles/Auth.module.scss'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ADMIN_ROUTE, INFO_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, WELCOME_ROUTE } from '../utils/consts'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { registration, login } from '../http/userApi'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'

const Auth = observer(() => {
    const { user } = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [hcaptchaToken, setHcaptchaToken] = useState('')

    const buttonClick = async (e) => {
        e.preventDefault()
        try {
            if (hcaptchaToken) {
                let data

                if (isLogin) {
                    data = await login(email, password, hcaptchaToken)
                }
                else {
                    data = await registration(email, password, hcaptchaToken)
                }

                user.setUser(data)
                user.setIsAuth(true)
                if (user._user.role === 'ADMIN') {
                    navigate(`${ADMIN_ROUTE}?from=${isLogin ? 'login' : 'registration'}`)
                } else {
                    navigate(`${WELCOME_ROUTE}?from=${isLogin ? 'login' : 'registration'}`)
                }
            }
            else {
                alert('Необходимо пройти капчу')
            }
        }
        catch (e) {
            alert(e.response.data.message.message)
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.auth__wrapper}>
                <h2 className={classes.plask}>Plask</h2>
                <form className={classes.auth__form}>
                    <h3 className={classes.title}>{isLogin ? 'Авторизация' : 'Регистрация'}</h3>
                    <input
                        className={classes.input}
                        type='email' placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required />
                    <input
                        className={classes.input}
                        type='password' placeholder='Пароль'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required />
                    <HCaptcha sitekey='6fd23c34-4ef8-4d2e-90d2-f444b6acaed4' theme="dark" onVerify={(token)=> setHcaptchaToken(token)} />
                    <button className={classes.button_light} type="submit" onClick={buttonClick}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                    {isLogin ?
                        <p className={classes.auth__info}>Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрироваться</NavLink></p>
                        : <p className={classes.auth__info}>Уже есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти</NavLink></p>
                    }
                </form>
                <NavLink to={INFO_ROUTE} className={classes.auth__back}>Вернуться на главную</NavLink>
            </div>
        </div>
    );
})

export default Auth;