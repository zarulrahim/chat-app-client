import { Button, Input } from 'antd';
import axios from 'axios';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/container';
import { mstAuth, mstUser } from '../../mobx';
import styles from './index.module.css';

const AuthScreen = observer((props) => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState("login");
  const [loginType, setLoginType] = useState("normal"); // normal | admin
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    dob: ""
  })

  useEffect(() => {
    if (getSnapshot(mstAuth).isLoggedIn) {
      navigate('/dashboard')
    }
    // mstUser.fetchUser();
  }, [getSnapshot(mstAuth).isLoggedIn])

  const onChangeInput = (value, type) => {
    formState[type] = value;
    setFormState(formState);
    console.log("check formState ===> ", formState)
  };

  const onLogin = (_loginType) => {
    const params = {
      email: formState.email,
      password: formState.password
    }
    if (_loginType === "admin") {
      mstAuth.adminLogin(params)
      .then((_adminLoginResponse) => {
        mstUser.fetchSingleUser(_adminLoginResponse.user)
        .then((_fetchSingleUserResponse) => {
          navigate('/admin/dashboard');
        })
        .catch((error) => {
          alert("Something went wrong. Please try again later");
        })
      })
      .catch((error) => {
        alert("User does not exist. Please contact admin for registration");
      })
    } else {
      mstUser.fetchUser()
      .then((_fetchUserResponse) => {
        mstAuth.normalLogin(params, _fetchUserResponse)
        .then((_normalLoginResponse) => {
          mstUser.fetchSingleUser(_normalLoginResponse)
          .then((_fetchSingleUserResponse) => {
            navigate('/dashboard');
          })
        })
        .catch((error) => {
          alert("User does not exist. Please contact admin for registration")
        })
      })
      .catch((error) => {
        alert("Something went wrong. Please try again later")
      })
    }    
  };

  const onRegister = () => {
    const params = formState
    mstAuth.register(params);
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
      <div className={styles.login}>
        <Input className={styles.inputText} size="large" placeholder='Email' onChange={(e) => { props.onChangeInput(e.target.value, "email")  }} />
        {
          loginType === 'admin' ?
          (
            <Input className={styles.inputText} type="password" size="large" placeholder='Password' onChange={(e) => { props.onChangeInput(e.target.value, "password")  }} />
          )
          :
          (
            null
          )
        }
        <div className={styles.flexContainer}>
          <Button className={styles.primaryBtn} type='link' size='large' style={{marginRight: 5 }} onClick={() => { props.onLogin(loginType) }}>Login</Button>
          {
            loginType === 'normal' ?
            (
              <Button className={styles.secondaryBtn} type='link' size='large' style={{marginLeft: 5 }} onClick={() => { setLoginType("admin") }}>Admin Login</Button>
            )
            :
            (
              <Button className={styles.secondaryBtn} type='link' size='large' style={{marginLeft: 5 }} onClick={() => { setLoginType("normal") }}>Back to Normal Login</Button>
            )
          }
           {/* <Button className={styles.secondaryBtn} type='link' size='large' style={{marginLeft: 5 }} onClick={() => { onSwitchScreen("register") }}>Create an account</Button> */}
        </div>
      </div>
    )
  };

  const RegisterComponent = (props) => {
    return (
      <div className={styles.login}>
        <div className={styles.flexContainer}>
          <Input className={styles.inputText} size="large" style={{marginRight: 5}} placeholder='First Name' onChange={(e) => { props.onChangeInput(e.target.value, "first_name")  }} />
          <Input className={styles.inputText} size="large" style={{marginLeft: 5}} placeholder='Last Name' onChange={(e) => { props.onChangeInput(e.target.value, "last_name")  }} />
        </div>
        <div className={styles.flexContainer}>
          <Input className={styles.inputText} size="large" style={{marginRight: 5}} placeholder='Email' onChange={(e) => { props.onChangeInput(e.target.value, "email")  }} />
          <Input className={styles.inputText} size="large" style={{marginLeft: 5}} placeholder='Phone' onChange={(e) => { props.onChangeInput(e.target.value, "phone_number")  }} />
        </div>
        <div className={styles.flexContainer}>
          <Input className={styles.inputText} size="large" placeholder='Date of Birth' />
        </div>
        <div className={styles.flexContainer}>
          <Input className={styles.inputText} size="large" placeholder='Password' onChange={(e) => { props.onChangeInput(e.target.value, "password")  }} />
        </div>
        <div className={styles.flexContainer}>
          <Button className={styles.primaryBtn} type='link' size='large' style={{marginRight: 5 }} onClick={() => { props.onRegister() }}>Register</Button>
          <Button className={styles.secondaryBtn} type='link' size='large' style={{marginLeft: 5 }} onClick={() => { props.onSwitchScreen("login") }}>Back to Login</Button>
        </div>
      </div>
    )
  };

  return (
    <Container
      isAdminScreen={loginType === 'admin'}
    >
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
})

export default AuthScreen;