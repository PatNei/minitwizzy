import { FC } from "hono/jsx"
interface NavbarProps {
    username?:string
}


export const Navbar: FC<NavbarProps> = ({username}:NavbarProps ) => {
    return(
    <nav style={"display:flex; min-width:full; justify-content:space-between;"}>
        {username && 
        <>
            <a href="timeline">my timeline</a> | 
            <a href="public-timeline">public timeline</a> | 
            <a href="logout">sign out {username}</a>
        </>
        }
        {!username && 
            <>
                <a href="public_timeline">public timeline</a> | 
                <a href="register">sign up</a> |
                <a href="login">sign in</a>
            </>
         }
    </nav>
    )
}