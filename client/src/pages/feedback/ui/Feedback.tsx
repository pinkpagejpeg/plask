import { FC, useState } from 'react'
import classes from './Feedback.module.scss'
import { Navbar } from '../../../shared/ui'
import { useTypedSelector } from 'shared/store'
import { addFeedback } from '../api'

export const Feedback: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const [info, setInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    const buttonHandler = async (event) => {
        event.preventDefault()
        try {
            if (user && info) {
                const data = await addFeedback({ info })
                setInfo('')

                if (data) {
                    alert('Обратная связь отправлена')
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При отправке обратной связи возникла ошибка: ${error.message}`)
            } else {
                alert("При отправке обратной связи возникла неизвестная ошибка")
            }
        }
    }

    const infoChangeHandler = (event) => {
        setInfo(event.target.value)
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
                            onChange={infoChangeHandler}
                            required />
                        <button className={classes.button_light} type="submit" onClick={buttonHandler}>Отправить</button>
                    </form>
                </div>
            </div>
        </>
    )
}