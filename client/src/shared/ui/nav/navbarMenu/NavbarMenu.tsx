import { FC } from 'react'
import classes from './NavbarMenu.module.scss'
import { menuClose, profileIcon, usersIcon, feedbackIcon, logoutIcon, mainIcon, goalsIcon, tasksIcon } from '../../../assets'
import { ADMIN_FEEDBACK_ROUTE, ADMIN_ROUTE, ADMIN_USER_ROUTE, FEEDBACK_ROUTE, GOALS_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, TASKS_ROUTE, WELCOME_ROUTE } from '../../../config'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTypedSelector } from 'shared/store'
// import { setAuthFalse } from '../../../../entities/users'
import { INavbarMenu } from './types'

export const NavbarMenu: FC<INavbarMenu> = ({ show, setShow }) => {
    const { user } = useTypedSelector(state => state.user)
    const navigate = useNavigate()
    // const dispatch = useAppDispatch()
    const rootClasses = [classes.menu__content]

    if (show) {
        rootClasses.push(classes.active)
    }

    const closeMenu = () => {
        setShow(false)
    }

    const logOut = () => {
        localStorage.removeItem('token')
        // dispatch(setAuthFalse())
        navigate(LOGIN_ROUTE)
    }


    return (
        <div className={rootClasses.join(' ')}>
            {user &&
                <div className={classes.menu__wrapper}>
                    <div className={classes.menu__topline}>
                        <div className={classes.menu__topline_info}>
                            <img
                                className={classes.menu__userimage}
                                src={import.meta.env.VITE_API_URL + 'static/' + user.img}
                            />
                            <p className={classes.menu__username}>{user.email}</p>
                        </div>
                        <button className={classes.menu__button_close} onClick={closeMenu}>
                            <img src={menuClose} alt='Иконка для скрытия меню' />
                        </button>
                    </div>

                    <ul className={classes.menu__list}>
                        <li className={classes.menu__item}>
                            <img src={profileIcon} />
                            <NavLink to={PROFILE_ROUTE}>Профиль</NavLink>
                        </li>
                        {user.role === 'USER' &&
                            <li className={classes.menu__item}>
                                <img src={feedbackIcon} />
                                <NavLink to={FEEDBACK_ROUTE}>Обратная связь</NavLink>
                            </li>
                        }
                        <li className={classes.menu__item}>
                            <img src={logoutIcon} />
                            <button onClick={logOut}>Выход</button>
                        </li>
                        {user.role === 'ADMIN' ?
                            <>
                                <li className={classes.menu__item}>
                                    <img src={mainIcon} />
                                    <NavLink to={ADMIN_ROUTE}>Главная</NavLink>
                                </li>
                                <li className={classes.menu__item}>
                                    <img src={feedbackIcon} />
                                    <NavLink to={ADMIN_FEEDBACK_ROUTE}>Обратная связь</NavLink>
                                </li>
                                <li className={classes.menu__item}>
                                    <img src={usersIcon} />
                                    <NavLink to={ADMIN_USER_ROUTE}>Пользователи</NavLink>
                                </li>
                            </>
                            :
                            <>
                                <li className={classes.menu__item}>
                                    <img src={mainIcon} />
                                    <NavLink to={WELCOME_ROUTE}>Главная</NavLink>
                                </li>
                                <li className={classes.menu__item}>
                                    <img src={goalsIcon} />
                                    <NavLink to={GOALS_ROUTE}>Цели</NavLink>
                                </li>
                                <li className={classes.menu__item}>
                                    <img src={tasksIcon} />
                                    <NavLink to={TASKS_ROUTE}>Задачи</NavLink>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            }
        </div>
    )
}