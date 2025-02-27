import { useEffect, useState, FC } from 'react'
import classes from './Appeals.module.scss'
import { Navbar } from '../../../shared/ui'
import { AppealItem } from './appealItem'
import { fetchAppeals } from '../api'
import { IAppealItem } from '../model'

export const Appeals: FC = () => {
    const [appeals, setAppeals] = useState<IAppealItem[]>([])

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        const getAppeals = async () => {
            try {
                const { feedbacks } = await fetchAppeals()
                setAppeals(feedbacks)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    alert(`При получении обратной связи возникла ошибка: ${error.message}`)
                } else {
                    alert("При получении обратной связи возникла неизвестная ошибка")
                }
            }
        }

        getAppeals()
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
                            {appeals.map((item) => (
                                <AppealItem
                                    key={item.id}
                                    id={item.id}
                                    info={item.info}
                                    date={item.date}
                                    status={item.status}
                                    userEmail={item.user.email}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}