import React, { useState, useContext } from 'react'
import classes from './NavBarMenu.module.scss'
import menu_close from '../../../assets/images/menu_close.svg'
import {Context} from '../../../main'
import { LOGIN_ROUTE } from '../../../utils/consts'
import { useNavigate } from 'react-router-dom'

const NavMenu = ({ show, setShow }) => {
    const { user } = useContext(Context);
    const navigate = useNavigate()
    const rootClasses = [classes.menu__content]
    if (show) {
        rootClasses.push(classes.active)
    }

    const closeMenu = () => {
        setShow(false);
    }

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        console.log(user.isAuth)
        navigate(LOGIN_ROUTE)
    }


    return (
        <div className={rootClasses.join(' ')}>
            <div className={classes.menu__wrapper}>
                <div>
                    <p>{user._user.email}</p>
                    <button className={classes.menu__button_close} onClick={closeMenu}>
                        <img src={menu_close} alt='Иконка для скрытия меню' />
                    </button>
                </div>

                <ul className="burger-menu__list">
                    <li className="burger-menu__item">
                        <img />
                        Профиль
                    </li>
                    <li className="burger-menu__item">
                        <img />
                        Обратная связь
                    </li>
                    <li className="burger-menu__item">
                        <img />
                        <button onClick={() => logOut()}>Выход</button>
                    </li>
                    <li className="burger-menu__item">
                        <img />
                        Главная
                    </li>
                    <li className="burger-menu__item">
                        <img />
                        Цели
                    </li>
                    <li className="burger-menu__item">
                        <img />
                        Задачи
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NavMenu;