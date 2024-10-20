import { FC } from 'react'
import classes from './Info.module.scss'
import { InfoHeader } from './infoHeader'
import { InfoHero } from './infoHero'
import { InfoPros } from './infoPros'
import { InfoDemo } from './infoDemo'
import { InfoFaq } from './infoFaq'
import { InfoContacts } from './infoContacts'
import { InfoFooter } from './infoFooter'

export const Info: FC = () => {
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
    )
}