import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import classes from './PersonalPage.module.css'
import {Link} from 'react-router-dom'


export const NavBar = () => {
    const { logout } = useContext(AuthContext)
    return (
        <div className={classes.personal_page_container}>
            <button onClick={() => logout()}>выход</button>
            <Link to='/Any'>Any</Link>
            <Link to='/PersonalPage'>PersonalPage</Link>
        </div>
    )
}