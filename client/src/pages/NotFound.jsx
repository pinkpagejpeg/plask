import React from 'react'
import classes from '../styles/NotFound.module.scss'
import { NavLink } from 'react-router-dom'
import { ADMIN_ROUTE, INFO_ROUTE, WELCOME_ROUTE } from '../utils/consts'

const NotFound = ({ auth, role }) => {
    return (
        <div className={classes.notfound__wrapper}>
            <h2 className={classes.title}>Cтраница не найдена</h2>
            <h2 className={classes.notfound__error}>404</h2>
            <NavLink className={classes.button_light}
                to={auth ? (role === 'ADMIN' ? ADMIN_ROUTE : WELCOME_ROUTE) : INFO_ROUTE}>Вернуться на главную</NavLink>
        </div>
    );
}

export default NotFound;