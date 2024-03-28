import React, { useEffect, useState, useContext } from 'react'
import classes from '../styles/AdminFeedback.module.scss'
import { Context } from '../main'
import NavBar from '../components/nav/NavBar'
import { getFeedback } from '../http/feedbackApi'
import AdminFeedbackItem from '../components/admin/adminFeedback/AdminFeedbackItem'

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
                setFeedbacks(feedbacks)
            } catch (e) {
                console.error('Ошибка при получении задач:', e)
            }
        };

        fetchFeedbacks();
    }, [])

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
                            {feedbacks.map((item) => (
                                <AdminFeedbackItem key={item.id} feedback={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminFeedback;