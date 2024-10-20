import { FC } from 'react'
import classes from './InfoProsCard.module.scss'

export const InfoProsCard: FC<any> = ({ pros }) => {
    return (
        <div className={classes.pros__wrapper}>
            <img className={classes.pros__image} src={pros.image} />
            <h3 className={classes.title}>{pros.title}</h3>
            <p className={classes.main_text}>{pros.text}</p>
        </div>
    )
}