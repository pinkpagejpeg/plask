import { FC } from 'react'
import classes from './InfoFooter.module.scss'
import { twitterLogo, telegramLogo, tiktokLogo } from '../../../../shared/assets'

export const InfoFooter: FC = () => {
    return (
        <footer className={classes.footer__wrapper}>
            <div className={classes.footer__container}>
                <h3 className={classes.title}>Plask</h3>
                <div className={classes.footer__dockbox}>
                    <a className={classes.footer__dock} href="#">Условия</a>
                    <a className={classes.footer__dock} href="#">Конфиденциальность</a>
                    <a className={classes.footer__dock} href="#">Cookies</a>
                </div>
                <div className={classes.footer__socialbox}>
                    <a className={classes.footer__social_link} href="#">
                        <img className={classes.footer__social_logo} src={twitterLogo} alt="Logo Twitter" />
                    </a>
                    <a className={classes.footer__social_link} href="#">
                        <img className={classes.footer__social_logo} src={telegramLogo} alt="Logo Telegram" />
                    </a>
                    <a className={classes.footer__social_link} href="#">
                        <img className={classes.footer__social_logo} src={tiktokLogo} alt="Logo TikTok" />
                    </a>
                </div>
            </div>
        </footer>
    )
}