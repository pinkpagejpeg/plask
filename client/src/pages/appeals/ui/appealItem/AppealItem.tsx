import { useEffect, useState, useContext, FC } from 'react'
import classes from './AppealItem.module.scss'
import { NavLink } from "react-router-dom"
import { updateFeedbackStatus } from '../../../../shared/api'
import { replyIcon } from '../../../../shared/assets'


export const AppealItem: FC<any> = ({ feedback }) => {
    // const changeStatus = async (feedbackId) => {
    //     try {
    //         let data

    //         data = await updateFeedbackStatus(feedbackId)
    //     } catch (e) {
    //         alert(e.response.data.message.message)
    //     }
    // }

    return (
        <tr className={classes.feedback__table_main}>
            <td className={classes.main_text}>{feedback.id}</td>
            <td className={classes.main_text}>{feedback.user.email}</td>
            <td className={classes.main_text}>{feedback.info}</td>
            <td className={classes.main_text}>{feedback.date}</td>
            <td className={classes.main_text}>{feedback.status ? 'Решен' : 'Не решен'}</td>
            <td className={classes.main_text}>
                {/* {!feedback.status &&
                    <NavLink className={classes.feedback__button} to="https://mail.google.com" onClick={() => changeStatus(feedback.id)}>
                        <img src={replyIcon} /></NavLink>
                } */}
            </td>
        </tr>
    )
}