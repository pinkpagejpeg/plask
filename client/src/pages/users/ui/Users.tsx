import { useEffect, useState, useContext, FC } from 'react'
import classes from './Users.module.scss'
// import { Context } from '../main'
import { Navbar } from '../../../shared/ui'
import { getUsers, createUser } from '../../../shared/api'
import { UserItem } from './userItem'

export const Users: FC = () => {
    // const { user } = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER')
    const [users, setUsers] = useState([]);

    // if (!user) {
    //     return <Navigate to={LOGIN_ROUTE} />;
    // }

    // useEffect(() => {
    //     fetchUsers();
    // }, [])

    // const fetchUsers = async () => {
    //     try {
    //         const users = await getUsers()
    //         setUsers(users)
    //     } catch (e) {
    //         alert(`Ошибка при получении пользователей: ${e.response.data.message}`)
    //     }
    // };

    // const addUser = async (e) => {
    //     e.preventDefault()
    //     try {
    //         let data

    //         data = await createUser(email, password, role)
    //         setEmail('')
    //         setPassword('')
    //         fetchUsers();
    //     }
    //     catch (e) {
    //         alert(e.response.data.message.message)
    //     }
    // }

    return (
        <>
            <Navbar />
            {/* <div className={classes.container}>
                <div className={classes.user__wrapper}>
                    <h3 className={classes.title}>Пользователи</h3>
                    <form className={classes.user__form} autoComplete='off'>
                        <input
                            className={classes.input}
                            type='email' placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete='off'
                            required />
                        <input
                            className={classes.input}
                            type='password' placeholder='Пароль'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete='off'
                            required />
                        <select
                            className={classes.input}
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            required
                        >
                            <option value='USER'>Пользователь</option>
                            <option value='ADMIN'>Администратор</option>
                        </select>
                        <button className={classes.button_light} type="submit" onClick={addUser}>Добавить пользователя</button>
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
                                <UserItem key={item.id} user={item} onUserChange={fetchUsers} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </>
    )
}