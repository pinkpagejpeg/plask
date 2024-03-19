import React from 'react'
import classes from './InfoProsCard.module.scss'

const InfoProsCard = (props) => {
    return ( 
        <div className={classes.pros__wrapper}>
            <img className={classes.pros__image} src={props.pros.image} />
            <h3 className={classes.title}>{props.pros.title}</h3>
            <p className={classes.main_text}>{props.pros.text}</p>
        </div>
     );
}
 
export default InfoProsCard;