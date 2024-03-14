import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import classes from '../styles/Welcome.module.scss'
import { NavLink, Navigate } from 'react-router-dom'
import NavBar from '../components/nav/NavBar'
import { LOGIN_ROUTE } from '../utils/consts'

const Welcome = observer(() => {
    const { user } = useContext(Context)

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    return (
        <>
            <NavBar />
            <div className={classes.container}>
                <div className={classes.welcome__wrapper}>
                    <h2 className={classes.plask}>Plask</h2>
                    <h3 className={classes.title}>Добро пожаловать!</h3>
                    <p className={classes.main_text}>Plask - новый планировщик задач и целей, который поможет вам в организации
                        вашего рабочего и личного времени и соответственно в достижении поставленных
                        целей. Простой и интуитивно понятный интерфейс разработан таким образом,
                        чтобы вы легко смогли в нем разобраться. Однако если у вас возникнут вопросы
                        или предложения по улучшению сервиса, вы можете обратиться к нашей службе
                        поддержки в разделе “Обратная связь”. Успехов в достижении ваших целей!</p>
                    <div className={classes.welcome__mainbox}>
                        <div className={classes.welcome__itembox}>
                            <h3 className={classes.title}>Задачи</h3>
                            <p className={classes.main_text}>Для того чтобы добавит вашу первую задачу, перейдите в раздел
                                “Задачи” или нажмите на кнопку ниже</p>
                            <NavLink className={classes.button_light} to="#">Перейти к задачам</NavLink>

                        </div>
                        <div className={classes.welcome__itembox}>
                            <h3 className={classes.title}>Цели</h3>
                            <p className={classes.main_text}>Для того чтобы добавит вашу первую цель, перейдите в раздел
                                “Цели” или нажмите на кнопку ниже</p>
                            <NavLink className={classes.button_light} to="#">Перейти к целям</NavLink>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
})

export default Welcome;