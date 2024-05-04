import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import classes from '../styles/Goal.module.scss'
import NavBar from '../components/nav/NavBar'
import { createGoal, getGoals, getGoalProgress } from '../http/goalApi'
import GoalListItem from '../components/goal/goalListItem/GoalListItem'

const Goal = observer(() => {
    const { goal, user } = useContext(Context)
    const [info, setInfo] = useState('')

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                if (user._user.id) {
                    const goals = await getGoals(user._user.id);
                    goal.setGoal(goals);

                    goals.forEach(async (goalItem) => {
                        const goalProgress = await getGoalProgress(goalItem.id);
                        goal.setGoalProgress(goalItem.id, goalProgress.progress);
                    });
                }
            } catch (e) {
                alert('Ошибка при получении целей:', e.response.data.message);
            }
        };

        fetchGoals();
    }, [goal, user])

    const addGoal = async (e) => {
        e.preventDefault()
        try {
            let data

            data = await createGoal(user._user.id, info)

            goal.addGoalList(data)
            goal.setGoalProgress(data.id, 0);
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
                <div className={classes.goal__wrapper}>
                <h3 className={classes.title}>Цели</h3>
                    <div className={classes.goal__listbox}>
                        {goal._goal && goal._goal.length > 0 ? (
                            <div className={classes.goal__list}>
                                {goal._goal.map((goalItem) => (
                                    <GoalListItem key={goalItem.id} title={goalItem.info} goalId={goalItem.id} progress={goal.goalProgress[goalItem.id]} />
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
                            onChange={e => setInfo(e.target.value)}
                            required />
                        <input className={classes.button_light}
                            type="submit" value="Добавить цель"
                            onClick={addGoal} />
                    </form>

                </div>
            </div>
        </>
    );
})

export default Goal;