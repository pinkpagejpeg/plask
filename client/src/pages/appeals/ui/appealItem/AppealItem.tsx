import { FC } from 'react'
import classes from './AppealItem.module.scss'
import { NavLink } from "react-router-dom"
import { replyIcon } from '../../../../shared/assets'
import { IAppealItem } from '../../model'
import { changeAppealStatus } from '../../api'

export const AppealItem: FC<IAppealItem> = ({ feedback }) => {
    const replyHandler = () => {
        try {
            if (feedback.id) {
                changeAppealStatus(feedback.id)
            }
        }
        catch (error) {
            alert(`При изменении статуса обратной связи возникла ошибка: ${error.response.data}`)
        }
    }

    return (
        <tr className={classes.feedback__table_main}>
            <td className={classes.main_text}>{feedback.id}</td>
            <td className={classes.main_text}>{feedback.user.email}</td>
            <td className={classes.main_text}>{feedback.info}</td>
            <td className={classes.main_text}>{feedback.date}</td>
            <td className={classes.main_text}>{feedback.status ? 'Решен' : 'Не решен'}</td>
            <td className={classes.main_text}>
                {!feedback.status &&
                    <NavLink
                        className={classes.feedback__button}
                        to="https://mail.google.com"
                        onClick={replyHandler}
                    >
                        <img src={replyIcon} />
                    </NavLink>
                }
            </td>
        </tr>
    )
}