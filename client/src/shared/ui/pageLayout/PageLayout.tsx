import { FC, ReactNode } from "react"
import { Navbar } from "../nav"
import classes from "./PageLayout.module.scss"

interface PageLayoutProps {
    children: ReactNode
    withLogo?: boolean
    title?: string
}

export const PageLayout: FC<PageLayoutProps> = ({
    children,
    withLogo,
    title
}) => {
    return (
        <div>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    {withLogo && <h2 className={classes.plask}>Plask</h2>}
                    {title && <h3 className={classes.title}>{title}</h3>}
                    {children}
                </div>
            </div>
        </div>
    )
}
