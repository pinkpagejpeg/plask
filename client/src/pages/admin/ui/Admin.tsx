import { FC, useContext } from 'react'
// import { observer } from 'mobx-react-lite'
// import { Context } from '../main'
import classes from './Admin.module.scss'
import { NavLink, Navigate } from 'react-router-dom'
import { ADMIN_FEEDBACK_ROUTE, ADMIN_USER_ROUTE, LOGIN_ROUTE } from '../../../shared/config'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../../../shared/ui'

export const Admin: FC = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const from = queryParams.get('from')
    // const { user } = useContext(Context)

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />
    // }
    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.admin__wrapper}>
                    <h2 className={classes.plask}>Plask</h2>
                    {((from === 'login') || (from === 'registration')) &&
                        <h3 className={classes.title}>Добро пожаловать!</h3>
                    }
                    {from === 'registration' &&
                        <p className={classes.main_text}>Мы ценим вашу роль в поддержании и оптимизации работы нашего
                            приложения. Мы уверены, что ваш вклад поможет улучшить пользовательский опыт. При появлении
                            вопросов или предложений, можете обратиться на корпоративную линию +7-999-999-9999 или
                            на почту plask_stuff@gmail.com. Мы готовы сотрудничать с вами для достижения общей цели -
                            сделать наше приложение лучше для пользователей.</p>

                    }
                    <div className={classes.admin__mainbox}>
                        {from === 'registration' ?
                            <div className={classes.admin__regbox}>
                                <div className={classes.admin__itembox}>
                                    <h3 className={classes.title}>Пользователи</h3>
                                    <p className={classes.main_text}>Для того чтобы посмотреть информацию о пользователях,
                                        перейдите в раздел “Пользователи” или нажмите на кнопку ниже</p>
                                    <NavLink className={classes.button_light} to={ADMIN_USER_ROUTE}>Перейти к пользователям</NavLink>
                                </div>
                                <div className={classes.admin__itembox}>
                                    <h3 className={classes.title}>Обратная связь</h3>
                                    <p className={classes.main_text}>Для того чтобы посмотреть обратную связь, перейдите
                                        в раздел “Обратная связь” или нажмите на кнопку ниже</p>
                                    <NavLink className={classes.button_light} to={ADMIN_FEEDBACK_ROUTE}>Перейти к обратной связи</NavLink>
                                </div>
                            </div>
                            :
                            <div className={classes.admin__logbox}>
                                <NavLink className={classes.admin__link} to={ADMIN_USER_ROUTE}>Пользователи</NavLink>
                                <NavLink className={classes.admin__link} to={ADMIN_FEEDBACK_ROUTE}>Обратная связь</NavLink>
                            </div>
                        }
                    </div>
                    {!(from === 'registration') &&
                        <p className={classes.admin__bottom}>При появлении вопросов или предложений, можете обратиться
                            на корпоративную линию +7-999-999-9999 или на почту plask_stuff@gmail.com.</p>
                    }
                </div>
            </div>
        </>
    )
}