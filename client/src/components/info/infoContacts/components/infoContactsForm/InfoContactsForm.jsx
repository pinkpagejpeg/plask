import React from 'react'
import classes from './InfoContactsForm.module.scss'

const InfoContactsForm = () => {
    return (
        <div className={classes.form__wrapper}>
            <h3 className={classes.title}>Остались вопросы?</h3>
            <form className={classes.form__form}>
                <input type="email" className={classes.input} placeholder="Email" required />
                <textarea className={classes.input} placeholder="Сообщение" required/>
                <input type="submit" className={classes.button_light} value="Отправить" />
            </form>
        </div>
    );
}

export default InfoContactsForm;