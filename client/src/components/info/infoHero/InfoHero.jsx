import React from 'react'
import classes from './InfoHero.module.scss'
import { NavLink } from 'react-router-dom';
import { REGISTRATION_ROUTE } from '../../../utils/consts';
import scroll from '../../../assets/images/scroll.svg'

const InfoHero = () => {
    return ( 
        <div className={classes.hero__backgroung}>
            <div className={classes.hero__infobox}>
                <h1 className={classes.plask}>Plask - сфокусируйтесь на важном</h1>
                <NavLink to={REGISTRATION_ROUTE} className={classes.button_light}>Начать</NavLink>
                <img className={classes.hero__scroll} src={scroll}/>
            </div>
        </div>
     );
}
 
export default InfoHero;