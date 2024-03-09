import React, { useState, useContext } from 'react'
import classes from './NavBar.module.scss'
import burger_menu from '../../assets/images/burger_menu.svg'
import NavBarMenu from './components/NavBarMenu'
import {Context} from '../../main'

const NavBar = () => {
    const { user } = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={classes.menu__wrapper}>
            <button className={classes.menu__button} onClick={toggleMenu}>
                <img src={burger_menu} alt='Иконка меню' />
            </button>

            <NavBarMenu show={isOpen} setShow={setIsOpen} />

        </div>
    );
}

export default NavBar;