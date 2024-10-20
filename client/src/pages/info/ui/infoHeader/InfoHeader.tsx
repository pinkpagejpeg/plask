import { FC } from 'react'
import classes from './InfoHeader.module.scss'

export const InfoHeader: FC = () => {
    return (
        <header className={classes.header__wrapper}>
            <nav className={classes.header__nav}>
                <ul className={classes.header__menu}>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#pros">Преимущества</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#demo">Демонстрация</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.plask} href="#">Plask</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#faq">Вопросы</a>
                    </li>
                    <li className={classes.header__item}>
                        <a className={classes.main_text} href="#contacts">Контакты</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}