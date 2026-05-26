import { useEffect, useState, FC, SetStateAction } from 'react'
import { UserItem } from './userItem'
import { fetchUsers, addUser } from '../api'
import { IUser } from '@/entities/users'
import { PageLayout } from '@/shared/ui'
import classes from './Users.module.scss'

export const Users: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER')
    const [users, setUsers] = useState<IUser[]>([])

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        try {
            const { users } = await fetchUsers()
            setUsers(users)
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При получении пользователей возникла ошибка: ${error.message}`)
            } else {
                alert("При получении пользователей возникла неизвестная ошибка")
            }
        }
    }

    const addButtonHandler = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        try {
            await addUser({ email, password, role })
            setEmail('')
            setPassword('')
            getUsers()
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                alert(`При добавлении пользователя возникла ошибка: ${error.message}`)
            } else {
                alert("При добавлении пользователя возникла неизвестная ошибка")
            }
        }
    }

    const emailChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setEmail(event.target.value)
    }

    const passwordChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setPassword(event.target.value)
    }

    const roleChangeHandler = (event: { target: { value: SetStateAction<string> } }) => {
        setRole(event.target.value)
    }

    return (
        <PageLayout title='Пользователи'>
            <div className={classes.user__wrapper}>
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
        </PageLayout>
    )
}