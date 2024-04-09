import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../main'
import { useNavigate } from 'react-router-dom'
import classes from '../styles/Profile.module.scss'
import NavBar from '../components/nav/NavBar'
import { getUser, updateUserImage, deleteUser } from '../http/userApi'
import delete_icon from '../assets/images/delete_icon.png'
import upload_icon from '../assets/images/upload_icon.png'
import { REGISTRATION_ROUTE } from '../utils/consts'
import ProfileInfo from '../components/profile/profileInfo/ProfileInfo'

const Profile = observer(() => {
    const { user } = useContext(Context)
    const [userInfo, setUserInfo] = useState({})
    const [img, setImg] = useState('');
    const navigate = useNavigate()

    if (!user) {
        return <Navigate to={LOGIN_ROUTE} />;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (user._user.id) {
                    const data = await getUser(user._user.id);
                    setUserInfo(data)
                    console.log(userInfo)
                }
            } catch (e) {
                console.error('Ошибка при получении задач:', e);
            }
        };

        fetchUser();
    }, [user])

    const selectFile = e => {
        setImg(e.target.files[0]);
        console.log(img)
        changeUserImage()
    };

    const changeUserImage = async (e) => {
        try {
            console.log(img)
            if (!img) {
                return;
            }
            
            const formData = new FormData();
            formData.append('img', img);
            console.log(img)
            let data

            data = await updateUserImage(user._user.id, formData)
            setUserInfo((prevUserInfo) => ({ ...prevUserInfo, img: data.img }));
        } catch (e) {
            alert(e.response.data.message)
        }
    };

    const destroyUser = async () => {
        try {
            const confirmed = window.confirm("Вы уверены, что хотите удалить аккаунт?");
            // console.log(user._user.id)
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

    const updateUserStore = (data) => {
        console.log(data.email)
        const updatedUser = user.editUser(data.email)
        user.setUser(updatedUser)
        setUserInfo(data)
    }

    return (
        <>
            <NavBar />
            <div className={classes.profile__wrapper}>
                <h2 className={classes.plask}>Plask</h2>
                <h3 className={classes.title}>Профиль</h3>
                <div className={classes.profile__mainbox}>
                    <div className={classes.profile__imagebox}>
                        <img src={import.meta.env.VITE_API_URL + 'static/' + userInfo.img} />
                        <div className={classes.profile__image_buttons}>
                            <label htmlFor="file-upload" className={classes.profile__image_button}>
                                <img src={upload_icon} alt="Иконка для загрузки фото профиля" />
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={selectFile}
                            />
                            <button className={classes.profile__image_button} onClick={changeUserImage}>
                                <img src={delete_icon} alt='Иконка для удаления профиля' />
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