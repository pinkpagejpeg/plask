import { useState, FC } from 'react'
import classes from './Navbar.module.scss'
import { burgerMenu } from '../../assets'
import { NavbarMenu } from './navbarMenu'

export const Navbar: FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={classes.menu__wrapper}>
            <button className={classes.menu__button} onClick={toggleMenu}>
                <img src={burgerMenu} alt='Иконка меню' />
            </button>
            <NavbarMenu show={isOpen} setShow={setIsOpen} />
        </div>
    )
}