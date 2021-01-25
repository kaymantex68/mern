import React from 'react'
import classes from './App.module.css'
import logo from './logo.svg'
import { useHttp } from './hooks/http.hook'
function App() {
  const [formData, setFormData] = React.useState(
    {
      email: '',
      password: '',
      name: '',
      phone: ''
    }
  )
  const [response, setResponse] = React.useState(null)
  const { request, loading } = useHttp();

  const HandleClick = () => {
    request({ ...formData }).then(res => {
      setResponse(res.data.message)
    })

  }


  return (
    <div className={classes.app_container}>
      <div className={classes.form_container}>
        <div className={classes.form_box}>
          <img alt="logo" src={logo} className={classes.form_image} />
          <form className={classes.form}>
            <input
              className={classes.form_input_mail}
              name="email" 
              placeholder="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              disabled={loading}
            />
            <input
              className={classes.form_input_password}
              name="password"
              placeholder="пароль, не меньше 6 символов"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              disabled={loading}
            />
            <input
              className={classes.form_input_name}
              name="name"
              placeholder="имя-"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              disabled={loading}
            />
            <input
              className={classes.form_input_phone}
              name="phone"
              placeholder="+7 (xxx) xxx-xx-xx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              disabled={loading}
            />
            <div className={classes.buttons_block}>
              <button className={classes.button_login} disabled={loading}>вход</button>
              <button className={classes.button_register} disabled={loading} onClick={() => HandleClick()}>регистрация</button>
            </div>
            {response && <div className={classes.answer}>{response}</div>}
          </form>

        </div>
      </div>
    </div>
  );
}

export default App;
