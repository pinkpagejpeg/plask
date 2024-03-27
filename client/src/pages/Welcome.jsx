import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import classes from '../styles/Welcome.module.scss'
import { NavLink, Navigate } from 'react-router-dom'
import NavBar from '../components/nav/NavBar'
import { FEEDBACK_ROUTE, GOALS_ROUTE, LOGIN_ROUTE, TASKS_ROUTE } from '../utils/consts'
import { useLocation } from 'react-router-dom'
import TaskCheckBox from '../components/UI/buttons/taskCheckbox/TaskCheckbox'
import { getTask } from '../http/taskApi'

const Welcome = observer(() => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get('from');
    const { user, task } = useContext(Context)

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (user._user.id) {
                    const tasks = await getTask(user._user.id);
                    task.setTask(tasks);
                }
            } catch (e) {
                console.error('Ошибка при получении задач:', e);
            }
        };

        fetchTasks();
    }, [task, user])

    return (
        <>
            <NavBar />
            <div className={classes.container}>
                <div className={classes.welcome__wrapper}>
                    <h2 className={classes.plask}>Plask</h2>
                    {((from === 'login') || (from === 'registration')) &&
                        <h3 className={classes.title}>Добро пожаловать!</h3>
                    }
                    {from === 'registration' &&
                        <p className={classes.main_text}>Plask - новый планировщик задач и целей, который поможет вам в
                            организации вашего рабочего и личного времени и соответственно в достижении поставленных
                            целей. Простой и интуитивно понятный интерфейс разработан таким образом, чтобы вы легко
                            смогли в нем разобраться. Однако если у вас возникнут вопросы или предложения по улучшению
                            сервиса, вы можете обратиться к нашей службе поддержки в разделе
                            <NavLink to={FEEDBACK_ROUTE} className={classes.welcome__link}>“Обратная связь”</NavLink>.
                            Успехов в достижении ваших целей!</p>
                    }
                    <div className={classes.welcome__mainbox}>
                        <div className={classes.welcome__itembox}>
                            <h3 className={classes.title}>Задачи</h3>
                            {from === 'registration' ?
                                <>
                                    <p className={classes.main_text}>Для того чтобы добавит вашу первую задачу, перейдите в раздел
                                        “Задачи” или нажмите на кнопку ниже</p>
                                    <h5 className={classes.main_text}>Задачи</h5>
                                    <div className={classes.welcome__tasks}>
                                        <TaskCheckBox label='Зарегистрироваться' сhecked={true} allowEdit={false} />
                                        <TaskCheckBox label='Добавить задачу' сhecked={false} allowEdit={false} />
                                        <TaskCheckBox label='Выполнить задачу' сhecked={false} allowEdit={false} />
                                    </div>
                                </>
                                :
                                <div className={classes.welcome__task_listbox}>
                                    {task._task && task._task.length > 0 ? (
                                        <div className={classes.welcome__task_list}>
                                            {task._task.map((taskItem) => (
                                                <TaskCheckBox key={taskItem.id}
                                                    label={taskItem.info}
                                                    сhecked={taskItem.status}
                                                    taskId={taskItem.id}
                                                    allowEdit={true} />
                                            ))}
                                        </div>
                                    ) : (
                                        <h4 className={classes.title}>Задачи не обнаружены</h4>
                                    )}
                                </div>
                            }
                            <NavLink className={classes.button_light} to={TASKS_ROUTE}>Перейти к задачам</NavLink>
                        </div>

                        <div className={classes.welcome__itembox}>
                            <h3 className={classes.title}>Цели</h3>
                            {from === 'registration' ?
                                <>
                                    <p className={classes.main_text}>Для того чтобы добавит вашу первую цель, перейдите в раздел
                                        “Цели” или нажмите на кнопку ниже</p>
                                    {/* Реализовать проценты */}
                                    <h5 className={classes.main_text}>Начать пользоваться Plask %</h5>
                                    <div className={classes.welcome__tasks}>
                                        <TaskCheckBox label='Зарегистрироваться' сhecked={true} allowEdit={false} />
                                        <TaskCheckBox label='Добавить цель' сhecked={false} allowEdit={false} />
                                        <TaskCheckBox label='Достигнуть цель' сhecked={false} allowEdit={false} />
                                    </div>
                                </>
                                :
                                <div className={classes.welcome__goal_listbox}>
                                    {/* Не доделано */}
                                    <h4 className={classes.title}>Цели не обнаружены</h4>
                                </div>
                            }
                            <NavLink className={classes.button_light} to={GOALS_ROUTE}>Перейти к целям</NavLink>
                        </div>
                    </div>
                    {!(from === 'registration') &&
                        <p className={classes.welcome__bottom}>Если у вас возникнут вопросы или предложения по улучшению сервиса, вы можете обратиться
                            к нашей службе поддержки в разделе <NavLink to={FEEDBACK_ROUTE} className={classes.welcome__bottom_link}>“Обратная связь”</NavLink>.</p>
                    }
                </div>
            </div>
        </>
    );
})

export default Welcome;