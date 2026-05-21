import { FC, ReactNode } from "react"
import { Navbar } from "../nav"

export const PageLayout: FC<{children: ReactNode}> = ({children}) => {
    return ( 
        <div>
            <Navbar />
            {children}
        </div>
     )
}
