import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import { useNavigate } from 'react-router-dom'
import classes from '../styles/Profile.module.scss'
import NavBar from '../components/nav/NavBar'
import { getUser, updateUserImage, deleteUserImage, deleteUser } from '../http/userApi'
import delete_icon from '../assets/images/delete_icon.png'
import upload_icon from '../assets/images/upload_icon.png'
import { REGISTRATION_ROUTE } from '../utils/consts'
import ProfileInfo from '../components/profile/profileInfo/ProfileInfo'

const Profile = observer(() => {
    const { user } = useContext(Context)
    const [userInfo, setUserInfo] = useState([])
    const navigate = useNavigate()

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        fetchUser()
    }, [user])

    const fetchUser = async () => {
        try {
            if (user._user.id) {
                const data = await getUser(user._user.id)
                setUserInfo(data)
                user.setUserImage(data.img)
            }
        } catch (e) {
            alert('Ошибка при получении информации о пользователе:', e.response.data.message)
        }
    };

    const selectFile = (e) => {
        const file = e.target.files[0]

        if (!file) {
            alert('Файл не загружен')
        }

        changeUserImage(file)
    };

    const changeUserImage = async (file) => {
        try {
            const formData = new FormData()
            formData.append('file', file)

            let data
            data = await updateUserImage(user._user.id, formData)   
            fetchUser()    
        } catch (e) {
            alert(e.response.data.message)
        }
    };

    const destroyUserImage = async () => {
            try {
                let data
                data = await deleteUserImage(user._user.id); 
                fetchUser()        
            } catch (e) {
                alert(e.response.data.message);
            }
    };

    const destroyUser = async () => {
        try {
            const confirmed = window.confirm("Вы уверены, что хотите удалить аккаунт?");
            if (confirmed) {
                let data

                data = await deleteUser(user._user.id)
                user.setUser({})
                user.setIsAuth(false)
                navigate(`${REGISTRATION_ROUTE}`)
            }
        }
        catch (e) {
            alert(e.response.data.message)
        }
    }

    const updateUserStore = (userData) => {
        const updatedUser = user.editUser(user._user.id, userData.email)
        user.setUser(updatedUser)
        fetchUser()
    }

    return (
        <>
            <NavBar />
            <div className={classes.profile__wrapper}>
                <h2 className={classes.plask}>Plask</h2>
                <h3 className={classes.title}>Профиль</h3>
                <div className={classes.profile__mainbox}>
                    <div className={classes.profile__imagebox}>
                        <img src={import.meta.env.VITE_API_URL + 'static/' + user._userImage} />
                        <div className={classes.profile__image_buttons}>
                            <label htmlFor="file-upload" className={classes.profile__image_button}>
                                <img src={upload_icon} alt="Загрузить фото профиля" />
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => selectFile(e)}
                            />
                            <button className={classes.profile__image_button} onClick={destroyUserImage}>
                                <img src={delete_icon} alt='Удалить фото профиля' />
                            </button>
                        </div>
                    </div>
                    <div className={classes.profile__infobox}>
                        <ProfileInfo user={userInfo} updateUser={updateUserStore} />
                        <button className={classes.profile__button_delete} onClick={destroyUser}>
                            Удалить аккаунт
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
})

export default Profile;