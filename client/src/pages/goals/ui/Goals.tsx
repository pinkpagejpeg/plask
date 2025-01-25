import { FC, useEffect, useState } from 'react'
import classes from './Goals.module.scss'
import { Navbar } from '../../../shared/ui'
import { GoalListItem } from './goalListItem'
import { useAppDispatch, useTypedSelector } from '@redux'
import { addGoal, fetchGoalsByUserId } from '../../../entities/goals'

export const Goals: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const { goals } = useTypedSelector(state => state.goal)
    const [info, setInfo] = useState('')
    const dispatch = useAppDispatch()

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        if (user.id) {
            dispatch(fetchGoalsByUserId(user.id))
        }

    }, [user])

    const createButtonHandler = async (event) => {
        event.preventDefault()
        if (user.id && info) {
            dispatch(addGoal({ userId: user.id, info }))
            setInfo('')
        }
    }

    const infoChangeHandler = (event) => {
        setInfo(event.target.value)
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.goal__wrapper}>
                    <h3 className={classes.title}>Цели</h3>
                    <div className={classes.goal__listbox}>
                        {goals && goals.length > 0 ? (
                            <div className={classes.goal__list}>
                                {goals.map((goal) => (
                                    <GoalListItem
                                        key={goal.id}
                                        title={goal.info}
                                        goalId={goal.id}
                                        progress={goal.progress | 0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <h4 className={classes.title}>Задачи не обнаружены</h4>
                        )}
                    </div>
                    <form className={classes.goal__form}>
                        <input className={classes.input}
                            type="text" placeholder="Название"
                            value={info}
                            onChange={infoChangeHandler}
                            required />
                        <input className={classes.button_light}
                            type="submit" value="Добавить цель"
                            onClick={createButtonHandler} />
                    </form>
                </div>
            </div>
        </>
    )
}