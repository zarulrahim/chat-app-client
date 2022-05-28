import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/container';
import { mstAuth, mstUser } from '../mobx';

const AuthScreen = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("login");
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    dob: ""
  })

  useEffect(() => {
    // mstUser.fetchUser();
  })

  const onChangeInput = (value, type) => {
    formState[type] = value;
    setFormState(formState);
    console.log("check formState ===> ", formState)
  };

  const onLogin = () => {
    const params = {
      email: formState.email,
      password: formState.password
    }
    navigate('/dashboard');
    // mstAuth.login(params);
    // console.log("check formState onLogin ===> ", params)
  };

  const onRegister = () => {
    const params = formState
    mstAuth.register(params);
    // console.log("check formState onRegister ===> ", formState)
  }

  const onSwitchScreen = (screen) => {
    setCurrentScreen(screen)
    setFormState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      dob: ""
    })
  }

  const LoginComponent = (props) => {
    return (
      <div style={styles.login}>
        <Input size="large" style={styles.login.input} placeholder='Email' onChange={(e) => { props.onChangeInput(e.target.value, "email")  }} />
        <Input type="password" size="large" style={styles.login.input} placeholder='Password' onChange={(e) => { props.onChangeInput(e.target.value, "password")  }} />
        <div style={{ display: 'flex' }}>
        <Button type='link' size='large' style={{...styles.login.button, marginRight: 5 }} onClick={() => { props.onLogin() }}>Login</Button>
          <Button type='link' size='large' style={{...styles.login.button, backgroundColor: '#ff7e7e', marginLeft: 5 }} onClick={() => { onSwitchScreen("register") }}>Create an account</Button>
        </div>
      </div>
    )
  };

  const RegisterComponent = (props) => {
    return (
      <div style={styles.login}>
        <div style={{ display: 'flex' }}>
          <Input size="large" style={{...styles.login.input, marginRight: 5}} placeholder='First Name' onChange={(e) => { props.onChangeInput(e.target.value, "first_name")  }} />
          <Input size="large" style={{...styles.login.input, marginLeft: 5}} placeholder='Last Name' onChange={(e) => { props.onChangeInput(e.target.value, "last_name")  }} />
        </div>
        <div style={{ display: 'flex' }}>
          <Input size="large" style={{...styles.login.input, marginRight: 5}} placeholder='Email' onChange={(e) => { props.onChangeInput(e.target.value, "email")  }} />
          <Input size="large" style={{...styles.login.input, marginLeft: 5}} placeholder='Phone' onChange={(e) => { props.onChangeInput(e.target.value, "phone_number")  }} />
        </div>
        <div style={{ display: 'flex' }}>
          <Input size="large" style={styles.login.input} placeholder='Date of Birth' />
        </div>
        <div style={{ display: 'flex' }}>
          <Input size="large" style={styles.login.input} placeholder='Password' onChange={(e) => { props.onChangeInput(e.target.value, "password")  }} />
        </div>
        <div style={{ display: 'flex' }}>
          <Button type='link' size='large' style={{...styles.login.button, marginRight: 5 }} onClick={() => { props.onRegister() }}>Register</Button>
          <Button type='link' size='large' style={{...styles.login.button, backgroundColor: '#ff7e7e', marginLeft: 5 }} onClick={() => { props.onSwitchScreen("login") }}>Back to Login</Button>
        </div>
      </div>
    )
  };

  return (
    <Container>
      {
        currentScreen === 'login' ?
        (
          <LoginComponent onSwitchScreen={onSwitchScreen} onChangeInput={onChangeInput} onLogin={onLogin} />
        )
        :
        (
          <RegisterComponent onSwitchScreen={onSwitchScreen} onChangeInput={onChangeInput} onRegister={onRegister} />
        )
      }
    </Container>
  )
}

const styles = {
  login: {
    padding: 15,
    input: {
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 0, 
    },
    button: {
      width: '100%',
      borderRadius: 10,
      backgroundColor: '#293462',
      lineHeight: 0,
      color: '#fff',
      // borderWidth: 0,
    }
  }
}

export default AuthScreen;