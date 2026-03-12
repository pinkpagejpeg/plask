import { FC, SetStateAction, useEffect, useState } from 'react'
import classes from './Goals.module.scss'
import { Navbar } from '../../../shared/ui'
import { GoalListItem } from './goalListItem'
import { useAppDispatch, useTypedSelector } from 'shared/store'
import { addGoal, fetchGoalsByUserId } from '../../../entities/goals'
import { searchIcon } from '../../../shared/assets'

export const Goals: FC = () => {
    const { user } = useTypedSelector(state => state.user)
    const { goals } = useTypedSelector(state => state.goal)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [info, setInfo] = useState('')
    const dispatch = useAppDispatch()

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        if (user) {
            dispatch(fetchGoalsByUserId((debouncedSearch) ? { search: debouncedSearch } : undefined))
        }

    }, [dispatch, user, debouncedSearch])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const createButtonHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        try {
            if (user && info) {
                dispatch(addGoal({ info }))
                setInfo('')
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При добавлении цели возникла ошибка: ${error.message}`)
            } else {
                alert("При добавлении цели возникла неизвестная ошибка")
            }
        }
    }

    const infoChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setInfo(event.target.value)
    }

    const searchChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setSearch(event.target.value)
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.goal__wrapper}>
                    <h3 className={classes.title}>Цели</h3>

                    <div className={classes.goal__tools}>
                        <div className={classes.goal__search}>
                            <img className={classes.goal__searchIcon}
                                src={searchIcon}
                                alt='Иконка для поиска задач' />

                            <input className={classes.input}
                                type="text"
                                placeholder="Поиск"
                                value={search}
                                onChange={searchChangeHandler} />
                        </div>
                    </div>

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