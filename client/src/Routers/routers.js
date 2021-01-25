import React, { useContext } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import Auth from '../components/Auth'
import { PersonalPage } from '../components/PersonalPage'
import { Any } from '../components/Any'
import { AuthContext } from '../context/AuthContext'
import { NavBar } from '../components/NavBar'


export const useRoutes = (isAuth) => {
    const auth = useContext(AuthContext)
    console.log('auth', auth)


    if (isAuth) {
        return (
            <div>
               <NavBar/>
                <Switch>
                    < Route exact path='/PersonalPage' >
                        <PersonalPage />
                    </Route >
                    < Route exact path='/Any' >
                        <Any />
                    </Route >
                    <Redirect to='/PersonalPage' />
                </Switch>
            </div>
        )
    }


    return (
        <Switch>
            < Route exact path='/' >
                <Auth />
            </Route >
            <Redirect to='/' />
        </Switch >
    )
}


