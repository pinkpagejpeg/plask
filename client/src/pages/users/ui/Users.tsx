import { useEffect, useState, FC } from 'react'
import classes from './Users.module.scss'
import { Navbar } from '../../../shared/ui'
import { UserItem } from './userItem'
import { fetchUsers, addUser } from '../api'

export const Users: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER')
    const [users, setUsers] = useState([]);

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        try {
            const data = await fetchUsers()
            setUsers(data)
        } catch (error) {
            alert(`Ошибка при получении пользователей: ${error.response.data}`)
        }
    }

    const addButtonHandler = (event) => {
        event.preventDefault()
        try {
            addUser({email, password, role})
            setEmail('')
            setPassword('')
            getUsers()
        }
        catch (error) {
            alert(`Ошибка при добавлении пользователя: ${error.response.data}`)
        }
    }

    const emailChangeHandler = (event) => {
        setEmail(event.target.value)
    }

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value)
    }

    const roleChangeHandler = (event) => {
        setRole(event.target.value)
    }

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.user__wrapper}>
                    <h3 className={classes.title}>Пользователи</h3>
                    <form className={classes.user__form} autoComplete='off'>
                        <input
                            className={classes.input}
                            type='email' placeholder='Email'
                            value={email}
                            onChange={emailChangeHandler}
                            autoComplete='off'
                            required />
                        <input
                            className={classes.input}
                            type='password' placeholder='Пароль'
                            value={password}
                            onChange={passwordChangeHandler}
                            autoComplete='off'
                            required />
                        <select
                            className={classes.input}
                            value={role}
                            onChange={roleChangeHandler}
                            required
                        >
                            <option value='USER'>Пользователь</option>
                            <option value='ADMIN'>Администратор</option>
                        </select>
                        <button className={classes.button_light} type="submit" onClick={addButtonHandler}>Добавить пользователя</button>
                    </form>

                    <table className={classes.user__table}>
                        <thead>
                            <tr className={classes.user__table_topline}>
                                <th className={classes.main_text}>ID</th>
                                <th className={classes.main_text}>Email</th>
                                <th className={classes.main_text}>Пароль</th>
                                <th className={classes.main_text}>Роль</th>
                                <th className={classes.main_text}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((item) => (
                                <UserItem key={item.id} user={item} onUserChange={getUsers} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}