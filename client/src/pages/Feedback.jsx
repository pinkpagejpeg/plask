import React, { useContext, useState } from 'react'
import classes from '../styles/Feedback.module.scss'
import NavBar from '../components/nav/NavBar';
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import { LOGIN_ROUTE } from '../utils/consts';
import { createFeedback } from '../http/feedbackApi';

const Feedback = observer(() => {
    const { user } = useContext(Context)
    const [info, setInfo] = useState('')

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    const buttonClick = async (e) => {
        e.preventDefault()
        try {
            let data

            data = await createFeedback(user._user.id, info)

            setInfo('')
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <>
            <NavBar />
            <div className={classes.container}>
                <div className={classes.feedback__wrapper}>
                    <h2 className={classes.plask}>Plask</h2>
                    <form className={classes.feedback__form}>
                        <h3 className={classes.title}>Обратная связь</h3>
                        <textarea className={classes.input} 
                        placeholder='Сообщение'
                        value={info}
                        onChange={e => setInfo(e.target.value)}
                        required/>
                        <button className={classes.button_light} type="submit" onClick={buttonClick}>Отправить</button>
                    </form>
                </div>
            </div>
        </>
    );
})

export default Feedback;