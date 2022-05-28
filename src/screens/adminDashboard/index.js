import React, { useEffect, useState } from 'react';
import { Button, Card, Input, List, Modal } from 'antd';
import { AiOutlineWarning  } from 'react-icons/ai';
import { FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getSnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import Container from '../../components/container';
import { mstAuth, mstUser } from '../../mobx';
import styles from './index.module.css';

const USERS = [
  { id: 1, name: "Ahmad", followed: true },
  { id: 1, name: "Abu", followed: false },
  { id: 1, name: "Akmal", followed: true },
  { id: 1, name: "Ridhwan", followed: false }
]
const AdminDashboardScreen = observer((props) => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState('default'); // default | register | edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    dob: ""
  })
  
  useEffect(() => {
    mstUser.fetchUser();
  }, [])

  const onChangeScreen = (screen) => {
    setCurrentScreen(screen);
  }

  const onChangeInput = (value, type) => {
    formState[type] = value;
    setFormState(formState);
    console.log("check formState ===> ", formState)
  };

  const onUpdate = () => {
    mstAuth.updateUser(formState)
    .then((response) => {
      alert("User information has been updated!")
    })
    .catch((error) => {
      alert(error);
    })
  };

  const onRemoveUser = (user) => {
    Modal.confirm({
      title: 'User Deletion',
      icon: <AiOutlineWarning size={30} color={'orange'} style={{ marginBottom: 5  }} />,
      content: `Are you sure want to remove ${user.email} ?`,
      okText: 'Yes',
      cancelText: 'No'
    });
  }

  const onSelectUser = (user) => {
    mstUser.fetchSingleUser({ user_uuid: user.user_uuid })
    .then((response) => {
      console.log("check response ===> ", response)
      setFormState({
        first_name: response.get_detail.first_name,
        last_name: response.get_detail.last_name,
        email: response.email,
        password: "",
        phone_number: response.phone_number,
        dob: response.get_detail.dob
      })
      setSelectedUser(response)
      onChangeScreen('edit');
    })
    .catch((error) => {
      alert("Something went wrong. Please try again later");
    })
  }

  const UserListingComponent = (props) => {
    return (
      <List 
        style={customStyles.list}
        dataSource={props.users}
        header={
          <div style={customStyles.list.headerWrapper}>
            <div style={customStyles.list.header}>
              <Input placeholder='Search User' style={customStyles.list.searchBox} />
              <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { onChangeScreen('register') }}>
                <FiUserPlus size={28} color={'#F24C4C'} />
              </Button>
            </div>
          </div>
        }
        renderItem={(user, index) => {
          return (
            <Card
              bodyStyle={customStyles.list.cardBody}
            >
              <div style={customStyles.list.item}>
                <div style={customStyles.list.item}>
                  <div>{user.email}</div>
                </div>
                <div style={customStyles.list.item}>
                  <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { props.onSelectUser(user) }}>
                    <FiEdit size={22} color={'#F24C4C'} style={{ marginRight: 15 }} />
                  </Button>
                  <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { props.onRemoveUser(user) }}>
                    <FiTrash2 size={22} color={'#F24C4C'} style={{ marginRight: 0 }} />
                  </Button>
                </div>
              </div>
            </Card>
          )
        }}
      />
    )
  }

  const UserRegisterComponent = (props) => {
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
          <Button className={styles.primaryBtn} type='link' size='large' onClick={() => { props.onRegister() }}>Add User</Button>
        </div>
      </div>
    )
  }

  const UserEditComponent = (props) => {
    return (
      <div className={styles.login}>
        <div className={styles.flexContainer}>
          <Input defaultValue={props.formState.first_name} className={styles.inputText} size="large" style={{marginRight: 5}} placeholder='First Name' onChange={(e) => { props.onChangeInput(e.target.value, "first_name")  }} />
          <Input defaultValue={props.formState.last_name} className={styles.inputText} size="large" style={{marginLeft: 5}} placeholder='Last Name' onChange={(e) => { props.onChangeInput(e.target.value, "last_name")  }} />
        </div>
        <div className={styles.flexContainer}>
          <Input defaultValue={props.formState.email} className={styles.inputText} size="large" style={{marginRight: 5}} placeholder='Email' onChange={(e) => { props.onChangeInput(e.target.value, "email")  }} />
          <Input defaultValue={props.formState.phone_number} className={styles.inputText} size="large" style={{marginLeft: 5}} placeholder='Phone' onChange={(e) => { props.onChangeInput(e.target.value, "phone_number")  }} />
        </div>
        <div className={styles.flexContainer}>
          <Input defaultValue={props.formState.dob} className={styles.inputText} size="large" placeholder='Date of Birth' />
        </div>
        <div className={styles.flexContainer}>
          <Input className={styles.inputText} size="large" placeholder='Password' onChange={(e) => { props.onChangeInput(e.target.value, "password")  }} />
        </div>
        <div className={styles.flexContainer}>
          <Button className={styles.primaryBtn} type='link' size='large' onClick={() => { props.onUpdate() }}>Update User</Button>
        </div>
      </div>
    )
  }

  return (
    <Container
      isAdminScreen={true}
      enableBackButton={currentScreen !== 'default'}
      onBackEvent={() => onChangeScreen('default')}
    >
      <div style={customStyles.content}>
        {
          currentScreen === 'default' ?
          (
            <UserListingComponent users={getSnapshot(mstUser).users || []} navigate={navigate} onSelectUser={onSelectUser} onRemoveUser={onRemoveUser} />
          )
          : currentScreen === 'register' ?
          (
            <UserRegisterComponent />
          )
          : currentScreen === 'edit' ?
          (
            <UserEditComponent formState={formState} onChangeInput={onChangeInput} onUpdate={onUpdate} />
          )
          :
          (
            null
          )
        }
      </div>
    </Container>
  )
})

const customStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: '15px'
  },
  mainTitle: {
    color: '#fff',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center'
  },
  menuSelection: {
    display: 'flex',
    card: {
      width: '100%',
      textAlign: 'center',
      borderRadius: 15,
    }
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    headerWrapper: {
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 10,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    searchBox: {
      borderRadius: 10,
      marginRight: 20,
      marginBottom: 5
    },
    resultCountLabel: {
      fontSize: 12,
      color: 'lightgrey'
    },
    card: {
      // borderRadius: 10,
      // marginBottom: 5
    },
    cardBody: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }
}

export default AdminDashboardScreen;