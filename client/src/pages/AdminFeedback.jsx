import React, { useEffect, useState, useContext } from 'react'
import classes from '../styles/AdminFeedback.module.scss'
import { Context } from '../main'
import NavBar from '../components/nav/NavBar'
import { NavLink } from 'react-router-dom'
import { getFeedback, updateFeedbackStatus } from '../http/feedbackApi'
import reply_icon from '../assets/images/reply_icon.png'

const AdminFeedback = () => {
    const { user } = useContext(Context)
    const [feedbacks, setFeedbacks] = useState([]);


    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const feedbacks = await getFeedback()
                console.log(feedbacks)
                setFeedbacks(feedbacks)
            } catch (e) {
                console.error('Ошибка при получении задач:', e)
            }
        };

        fetchFeedbacks();
    }, [])

    const changeStatus = async (feedbackId) => {
        try {
            let data

            data = await updateFeedbackStatus(feedbackId)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <>
            <NavBar />
            <div className={classes.container}>
                <div className={classes.feedback__wrapper}>
                    <h3 className={classes.title}>Обратная связь</h3>
                    <table className={classes.feedback__table}>
                        <thead>
                            <tr className={classes.feedback__table_topline}>
                                <th className={classes.main_text}>ID</th>
                                <th className={classes.main_text}>Пользователь</th>
                                <th className={classes.main_text}>Сообщение</th>
                                <th className={classes.main_text}>Дата</th>
                                <th className={classes.main_text}>Статус</th>
                                <th className={classes.main_text}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback) => (
                                <tr className={classes.feedback__table_main} key={feedback.id}>
                                    <td className={classes.main_text}>{feedback.id}</td>
                                    <td className={classes.main_text}>{feedback.user.email}</td>
                                    <td className={classes.main_text}>{feedback.info}</td>
                                    <td className={classes.main_text}>{feedback.date}</td>
                                    <td className={classes.main_text}>{feedback.status ? 'Решен' : 'Не решен'}</td>
                                    <td className={classes.main_text}>
                                        {!feedback.status &&
                                        <NavLink className={classes.feedback__button} to="https://mail.google.com" onClick={() => changeStatus(feedback.id)}>
                                            <img src={reply_icon} /></NavLink>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminFeedback;