import { FC } from 'react'
import classes from './InfoProsCard.module.scss'
import { IInfoProsCard } from '../../../model'

export const InfoProsCard: FC<IInfoProsCard> = ({ pros }) => {
    return (
        <div className={classes.pros__wrapper}>
            <img className={classes.pros__image} src={pros.image} />
            <h3 className={classes.title}>{pros.title}</h3>
            <p className={classes.main_text}>{pros.text}</p>
        </div>
    )
}