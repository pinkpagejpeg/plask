import { FC, useEffect, useState } from 'react'
import classes from './Tasks.module.scss'
import { Navbar, TaskCheckbox } from '../../../shared/ui'
import { useAppDispatch, useTypedSelector } from '../../../features/hooks'
import { Navigate } from 'react-router-dom'
import { LOGIN_ROUTE } from '../../../shared/config'
import { fetchTasksByUserId, addTask } from '../../../entities/tasks'

export const Tasks: FC = () => {
    const dispatch = useAppDispatch()
    const { user } = useTypedSelector(state => state.user)
    const { tasks } = useTypedSelector(state => state.task)
    const [info, setInfo] = useState('')

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />
    // }

    useEffect(() => {
        if (user.id) {
            dispatch(fetchTasksByUserId(user.id))
        }
    }, [user])

    const createTask = async (e) => {
        e.preventDefault()
        if (user.id && info) {
            dispatch(addTask({ userId: user.id, info: info }))
            setInfo('')
        }
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.task__wrapper}>
                    <h3 className={classes.title}>Задачи</h3>
                    <div className={classes.task__listbox}>
                        {tasks && tasks.length > 0 ? (
                            <div className={classes.task__list}>
                                {tasks.map((taskItem) => (
                                    <TaskCheckbox
                                        key={taskItem.id}
                                        label={taskItem.info}
                                        checked={taskItem.status}
                                        taskId={taskItem.id}
                                        allowEdit={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <h4 className={classes.title}>Задачи не обнаружены</h4>
                        )}
                    </div>
                    <form className={classes.task__form}>
                        <input className={classes.input}
                            type="text" placeholder="Название"
                            value={info}
                            onChange={e => setInfo(e.target.value)}
                            required />
                        <input className={classes.button_light}
                            type="submit" value="Добавить задачу"
                            onClick={createTask} />
                    </form>
                </div>
            </div>
        </>
    )
}