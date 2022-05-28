import { Button, Card, Tag } from 'antd';
import { getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { FiArrowLeft, FiHome, FiLogOut, FiMessageCircle, FiUser, FiUsers } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { mstAuth } from '../mobx';
import socket from '../socketClient';

const Container = (props) => {
  const navigate = useNavigate();

  const onLogout = () => {
    mstAuth.logOut();
    socket.disconnect();
    navigate('/auth');
  }

  const onGotoHome = () => {
    if (getSnapshot(mstAuth).isLoggedIn) {
      if (props.isAdminScreen) {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } else {
      navigate('/')
    }
  }

  return (
    <div style={styles.base}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>
            {
              props.enableBackButton ?
              (
                <Button style={{ padding: 0, lineHeight: 0 }} type="link" onClick={props.onBackEvent}>
                  <FiArrowLeft color='#fff' size={30} />
                </Button>  
              )
              :
              (
                <Button style={{ padding: 0, lineHeight: 0 }} type="link" onClick={() => { onGotoHome() }}>
                  <FiHome color='#fff' size={30} />
                </Button>
              )
            }
            <div style={{ display: 'flex', alignItems: 'center' }}> 
              <div style={styles.mainTitle}>Todak<b>Chat</b></div>
              {
                props.isAdminScreen ?
                (
                  <Tag color="#293462" style={{ marginTop: 5, marginLeft: 10, borderRadius: 5, borderWidth: 0 }}>Admin</Tag>
                )
                :
                (
                  null
                )
              }
            </div>
            {
              getSnapshot(mstAuth).isLoggedIn ?
              (
                <Button style={{ padding: 0, lineHeight: 0 }} type="link" onClick={() => { onLogout() }}>
                  <FiLogOut color='#fff' size={30} />
                </Button>
              )
              :
              (
                <div></div>
              )
            }
          </div>
          {/* <div>
            <Card
              style={styles.accountInfo.card}
              bodyStyle={{...styles.accountInfo.cardBody, justifyContent: 'space-between'}}
            >
              <div style={styles.accountInfo.cardBody}>
                <FiUser style={styles.accountInfo.image} size={40} />
                <div>
                  <div>Zarul Rahim</div>
                  <div>zarul@gmail.com</div>
                </div>
              </div>
              <FiLogOut size={30} color={'red'} />
            </Card>
          </div> */}
          {/* <div style={styles.menuSelection}>
            <Card bodyStyle={styles.menuSelection.cardBody} onClick={() => { navigate('/crud') }} style={{...styles.menuSelection.card, cursor: 'pointer' }}>
              <div>
                <FiUsers size={36} />
                <div>User Listing</div>
              </div>
            </Card>
            <Card bodyStyle={styles.menuSelection.cardBody} onClick={() => { navigate('/chat') }} style={{...styles.menuSelection.card, marginLeft: 10, cursor: 'pointer' }}>
              <div>
                <FiMessageCircle size={36} />
                <div>In-App Chat</div>
              </div>
            </Card>
          </div> */}
        </div>
        {props.children}
      </div>
    </div>
  )
}

const styles = {
  base: {
    marginTop: 20,
  },
  container: {
    backgroundColor: '#F24C4C',
    width: '500px',
    margin: '0 auto',
    borderRadius: 15,
  },
  content: {
    padding: 10,
    paddingBottom: 0,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 30,
    paddingBottom: 0,
    textAlign: 'center',
  },
  accountInfo: {
    card: {
      borderRadius: 15
    },
    cardBody: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    image: {
      marginRight: 15
    }
  },
  menuSelection: {
    display: 'flex',
    card: {
      width: '100%',
      textAlign: 'center',
      borderRadius: 15,
    },
    cardBody: {
      paddingTop: '15px',
      padding: '10px'
    }
  },
}

export default Container;