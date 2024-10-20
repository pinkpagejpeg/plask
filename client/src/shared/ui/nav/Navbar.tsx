import { useState, useContext, FC } from 'react'
import classes from './NavBar.module.scss'
import { burgerMenu } from '../../assets'
import { NavbarMenu } from './navbarMenu'
// import {Context} from '../../main'

export const Navbar: FC = () => {
    // const { user } = useContext(Context)
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