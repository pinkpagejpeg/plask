import React, { useState } from 'react'
import classes from '../styles/Auth.module.scss'
import { useLocation } from 'react-router';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { NavLink } from 'react-router-dom';
import { registration, login } from '../http/userApi';

const Auth = () => {
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const buttonClick = async () => {

        try {
            if (isLogin) {
                const response = await login(email, password)
                console.log(response)
            }
            else {
                const response = await registration(email, password)
                console.log(response)
            }   
        }
        catch(e) {
            console.log(e)
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
                    <button className={classes.button_light} type="submit" onClick={buttonClick}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                    {isLogin ?
                        <p className={classes.auth__info}>Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрироваться</NavLink></p>
                        : <p className={classes.auth__info}>Уже есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войти</NavLink></p>
                    }
                </form>
                <a href='#' className={classes.auth__back}>Вернуться на главную</a>
            </div>
        </div>
    );
}

export default Auth;