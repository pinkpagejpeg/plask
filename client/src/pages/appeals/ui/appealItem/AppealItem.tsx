import { FC, useState } from 'react'
import classes from './AppealItem.module.scss'
import { NavLink } from "react-router-dom"
import { replyIcon } from '../../../../shared/assets'
import { IAppealItemComponent } from '../../model'
import { changeAppealStatus } from '../../api'

export const AppealItem: FC<IAppealItemComponent> = ({ id, info, date, status, userEmail }) => {
    const[appealStatus, setAppealStatus] = useState(status)

    const handleCheckboxChange = () => {
        setAppealStatus(!appealStatus)
        replyHandler()
    }

    const replyHandler = () => {
        try {
            if (id) {
                changeAppealStatus(id, !appealStatus)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При изменении статуса обратной связи возникла ошибка: ${error.message}`)
            } else {
                alert("При изменении статуса обратной связи возникла неизвестная ошибка")
            }
        }
    }

    return (
        <tr className={classes.feedback__table_main}>
            <td className={classes.main_text}>{id}</td>
            <td className={classes.main_text}>{userEmail}</td>
            <td className={classes.main_text}>{info}</td>
            <td className={classes.main_text}>{date}</td>
            <td className={classes.main_text}>{appealStatus ? 'Решен' : 'Не решен'}</td>
            <td className={classes.main_text}>
                {!appealStatus &&
                    <NavLink
                        className={classes.feedback__button}
                        to="https://mail.google.com"
                        onClick={handleCheckboxChange}
                    >
                        <img src={replyIcon} />
                    </NavLink>
                }
            </td>
        </tr>
    )
}