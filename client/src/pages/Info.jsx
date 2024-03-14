import React from 'react'
import classes from '../styles/Info.module.scss'
import InfoHeader from '../components/info/infoHeader/InfoHeader';
import InfoHero from '../components/info/infoHero/InfoHero';

const Info = () => {
    return (
        <>
            <InfoHeader />
            <InfoHero />
            <div className={classes.container}>

                {/* Контент */}

                {/* Подвал */}
            </div>
        </>
    );
}

export default Info;