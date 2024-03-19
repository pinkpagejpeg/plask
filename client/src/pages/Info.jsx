import React from 'react'
import classes from '../styles/Info.module.scss'
import InfoHeader from '../components/info/infoHeader/InfoHeader';
import InfoHero from '../components/info/infoHero/InfoHero';
import InfoPros from '../components/info/infoPros/InfoPros';
import InfoDemo from '../components/info/infoDemo/InfoDemo';
import InfoFaq from '../components/info/infoFaq/InfoFaq';
import InfoContacts from '../components/info/infoContacts/InfoContacts';
import InfoFooter from '../components/info/infoFooter/InfoFooter';

const Info = () => {
    return (
        <>
            <InfoHeader />
            <InfoHero />
            <div className={classes.container}>
                <InfoPros />
                <InfoDemo />
                <InfoFaq />
                <InfoContacts />
            </div>
            <InfoFooter />
        </>
    );
}

export default Info;