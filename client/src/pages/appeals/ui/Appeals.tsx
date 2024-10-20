import { useEffect, useState, useContext, FC } from 'react'
import classes from './Appeals.module.scss'
// import { Context } from '../main'
import { Navbar } from '../../../shared/ui'
import { getFeedback } from '../../../shared/api'
import { AppealItem } from './appealItem'

export const Appeals: FC = () => {
    // const { user } = useContext(Context)
    const [feedbacks, setFeedbacks] = useState([])


    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const feedbacks = await getFeedback()
                setFeedbacks(feedbacks)
            } catch (e) {
                // alert('Ошибка при получении обратной связи:', e.response.data.message.message)
            }
        };

        fetchFeedbacks();
    }, [])

    return (
        <>
            <Navbar />
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
                                <AppealItem key={item.id} feedback={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}