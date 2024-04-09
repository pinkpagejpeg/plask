import React, { useEffect, useState, useContext } from 'react'
import classes from '../styles/AdminUser.module.scss'
import { Context } from '../main'
import NavBar from '../components/nav/NavBar'
import { getUsers, createUser } from '../http/userApi'
import AdminUserItem from '../components/admin/adminUser/AdminUserItem'

const AdminUser = () => {
    const { user } = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER')
    const [users, setUsers] = useState([]);

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers()
                setUsers(users)
            } catch (e) {
                console.error('Ошибка при получении задач:', e)
            }
        };

        fetchUsers();
    }, [users])

    const addUser = async (e) => {
        e.preventDefault()
        try {
            let data

            data = await createUser(email, password, role)
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <>
            <NavBar />
            <div className={classes.container}>
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
                                <AdminUserItem key={item.id} user={item}/>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminUser;