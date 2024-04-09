import React, { useState, useEffect, useContext } from 'react'
import classes from './NavBarMenu.module.scss'
import menu_close from '../../../assets/images/menu_close.svg'
import { Context } from '../../../main'
import { ADMIN_FEEDBACK_ROUTE, ADMIN_ROUTE, ADMIN_USER_ROUTE, FEEDBACK_ROUTE, GOALS_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, TASKS_ROUTE, WELCOME_ROUTE } from '../../../utils/consts'
import { NavLink, useNavigate } from 'react-router-dom'
import { getUser } from '../../../http/userApi'
import profile_icon from '../../../assets/images/profile_icon.png'
import users_icon from '../../../assets/images/users_icon.png'
import feedback_icon from '../../../assets/images/feedback_icon.png'
import logout_icon from '../../../assets/images/logout_icon.png'
import main_icon from '../../../assets/images/main_icon.png'
import goals_icon from '../../../assets/images/goals_icon.png'
import tasks_icon from '../../../assets/images/tasks_icon.png'

const NavMenu = ({ show, setShow }) => {
    const { user } = useContext(Context)
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()
    const rootClasses = [classes.menu__content]

    if (show) {
        rootClasses.push(classes.active)
    }

    const closeMenu = () => {
        setShow(false);
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (user._user.id) {
                    const data = await getUser(user._user.id);
                    setUserInfo(data)
                }
            } catch (e) {
                console.error('Ошибка при получении задач:', e);
            }
        };

        fetchUser();
    }, [user])

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        navigate(LOGIN_ROUTE)
    }


    return (
        <div className={rootClasses.join(' ')}>
            <div className={classes.menu__wrapper}>
                <div className={classes.menu__topline}>
                    <div className={classes.menu__topline_info}>
                        <img className={classes.menu__userimage} src={import.meta.env.VITE_API_URL + 'static/' + userInfo.img} />
                        <p className={classes.menu__username}>{user._user.email}</p>
                    </div>
                    <button className={classes.menu__button_close} onClick={closeMenu}>
                        <img src={menu_close} alt='Иконка для скрытия меню' />
                    </button>
                </div>

                <ul className={classes.menu__list}>
                    <li className={classes.menu__item}>
                        <img src={profile_icon} />
                        <NavLink to={PROFILE_ROUTE}>Профиль</NavLink>
                    </li>
                    {user._user.role === 'USER' &&
                        <li className={classes.menu__item}>
                            <img src={feedback_icon} />
                            <NavLink to={FEEDBACK_ROUTE}>Обратная связь</NavLink>
                        </li>
                    }
                    <li className={classes.menu__item}>
                        <img src={logout_icon} />
                        <button onClick={() => logOut()}>Выход</button>
                    </li>
                    {user._user.role === 'ADMIN' ?
                        <>
                            <li className={classes.menu__item}>
                                <img src={main_icon} />
                                <NavLink to={ADMIN_ROUTE}>Главная</NavLink>
                            </li>
                            <li className={classes.menu__item}>
                                <img src={feedback_icon} />
                                <NavLink to={ADMIN_FEEDBACK_ROUTE}>Обратная связь</NavLink>
                            </li>
                            <li className={classes.menu__item}>
                                <img src={users_icon} />
                                <NavLink to={ADMIN_USER_ROUTE}>Пользователи</NavLink>
                            </li>
                        </>
                        :
                        <>
                            <li className={classes.menu__item}>
                                <img src={main_icon} />
                                <NavLink to={WELCOME_ROUTE}>Главная</NavLink>
                            </li>
                            <li className={classes.menu__item}>
                                <img src={goals_icon} />
                                <NavLink to={GOALS_ROUTE}>Цели</NavLink>
                            </li>
                            <li className={classes.menu__item}>
                                <img src={tasks_icon} />
                                <NavLink to={TASKS_ROUTE}>Задачи</NavLink>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </div>
    );
}

export default NavMenu;