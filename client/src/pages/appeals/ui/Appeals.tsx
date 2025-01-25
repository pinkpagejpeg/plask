import { useEffect, useState, FC } from 'react'
import classes from './Appeals.module.scss'
import { Navbar } from '../../../shared/ui'
import { AppealItem } from './appealItem'
import { fetchAppeals } from '../api'

export const Appeals: FC = () => {
    const [appeals, setAppeals] = useState([])

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        const getAppeals = async () => {
            try {
                const data = await fetchAppeals()
                setAppeals(data)
            } catch (error) {
                alert(`Ошибка при получении обратной связи: ${error.response.data}`)
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
                                <AppealItem key={item.id} feedback={item} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}