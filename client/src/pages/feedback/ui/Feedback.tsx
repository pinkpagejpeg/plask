import { FC, useState } from 'react'
import classes from './Feedback.module.scss'
import { Navbar } from '../../../shared/ui'
import { LOGIN_ROUTE } from '../../../shared/config'
import { createFeedback } from '../../../shared/api'
import { useTypedSelector } from '../../../features/hooks'

export const Feedback: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const [info, setInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    const buttonClick = async (e) => {
        e.preventDefault()
        try {
            if (user.id && info) {
                await createFeedback(user.id, info)

                setInfo('')
                alert('Обратная связь отправлена')
            }
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.feedback__wrapper}>
                    <h2 className={classes.plask}>Plask</h2>
                    <form className={classes.feedback__form}>
                        <h3 className={classes.title}>Обратная связь</h3>
                        <textarea className={classes.input}
                            placeholder='Сообщение'
                            value={info}
                            onChange={e => setInfo(e.target.value)}
                            required />
                        <button className={classes.button_light} type="submit" onClick={buttonClick}>Отправить</button>
                    </form>
                </div>
            </div>
        </>
    )
}