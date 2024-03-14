import React from 'react'
import classes from './InfoHeader.module.scss'

const InfoHeader = () => {
    return ( 
        <header className={classes.header__wrapper}>
            <nav className={classes.header__nav}>
                <ul className={classes.header__menu}>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#">Преимущества</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#">Демонстрация</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.plask} href="#">Plask</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#">Вопросы</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#">Контакты</a>
                    </li>
                </ul>
            </nav>
        </header>
     );
}
 
export default InfoHeader;