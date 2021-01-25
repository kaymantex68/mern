import React from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import { useRoutes } from './Routers/routers'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'

function App() {
  const { token, userId, login, logout} = useAuth()
  const isAuth = !!token
  const routes = useRoutes(isAuth)
  
  return (
    <AuthContext.Provider value={{token, userId, login, logout, isAuth}}>
      <Router>
        <div>
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
