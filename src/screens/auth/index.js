import { Button, Input } from 'antd';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/container';
import { mstAuth } from '../../mobx';
import styles from './index.module.css';

const AuthScreen = observer((props) => {
  const navigate = useNavigate();
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
      navigate('/admin/dashboard')
    }
  }, [getSnapshot(mstAuth).isLoggedIn])

  const onChangeInput = (value, type) => {
    formState[type] = value;
    setFormState(formState);
    // console.log("check formState ===> ", formState)
  };

  const onLogin = () => {
    const params = {
      email: formState.email,
      password: formState.password
    }
    mstAuth.adminLogin(params)
    .then((_adminLoginResponse) => {
      mstAuth.fetchSingleUser(_adminLoginResponse.user)
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
  };

  const LoginComponent = (props) => {
    return (
      <div className={styles.login}>
        <Input className={styles.inputText} size="large" placeholder='Email' onChange={(e) => { props.onChangeInput(e.target.value, "email")  }} />
        <Input.Password className={styles.inputText} type="password" size="large" placeholder='Password' onChange={(e) => { props.onChangeInput(e.target.value, "password")  }} />
        <div className={styles.flexContainer}>
          <Button className={styles.primaryBtn} type='link' size='large' onClick={() => { props.onLogin() }}>Login</Button>
        </div>
      </div>
    )
  };

  return (
    <Container
      isAdminScreen={true}
    >
      <LoginComponent onChangeInput={onChangeInput} onLogin={onLogin} />
    </Container>
  )
})

export default AuthScreen;