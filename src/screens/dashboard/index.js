import React, { useEffect, useState } from 'react';
import { Button, Card, Input, List, Tabs } from 'antd';
import Container from '../../components/container';
import { FiMessageCircle, FiRadio, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { mstUser } from '../../mobx';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import socket from '../../socketClient';
import { colors } from '../../themes';
import styles from './index.module.css';

const { TabPane } = Tabs;

const DashboardScreen = observer((props) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [connectedUsers, setConnectedUsers] = useState([])

  useEffect(() => {
    mstUser.fetchUser()
    .then((response) => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (getSnapshot(mstUser).chatUser.user_uuid !== undefined) {
      socket.auth = {
        uuid: getSnapshot(mstUser).chatUser.user_uuid,
        email: getSnapshot(mstUser).user.email,
      }
      socket.connect();
      socket.emit("trigger_user_update");
    }
  }, [getSnapshot(mstUser).chatUser.user_uuid !== undefined])

  useEffect(() => {
    socket.on('connected_users', (users) => {
      console.log("check connected users ===> ", users)
      setConnectedUsers(users)
    })
  }, [socket])

  const onChangeRoomId = (value) => {
    setRoomId(value)
  };

  const isOnline = (uuid) => {
    // console.log("check uuid ===> ",)
    return connectedUsers.find(user => user.uuid === uuid);
  }

  const onGotoChat = (type, target) => {
    if (type === 'group') {
      console.log("check roomId ==> ", target)
      if (target !== null) {
        navigate('/group' + '/' + target);
      }
    } else {
      if (target.uuid !== null) {
        mstUser.fetchSingleUser({ user_uuid: target.uuid })
        .then((response) => {
          mstUser.updateChatTargetUser(response)
          navigate('/chat' + '/' + target.userID);
        })
        .catch((error) => {
          alert(error);
        })
      }
    }
  };

  return (
    <Container
      enableBackButton
      onBackEvent={() => {
        navigate('/admin/dashboard')
        socket.disconnect();
      }}
    >
      {
        isLoading ?
        (
          <div className={styles.content}>
            <div>Loading...</div>
          </div>
        )
        :
        (
          <div className={styles.content}>
            <div className={styles.accountInfo}>
              <Card
                className={styles.card}
                bodyStyle={{...customStyles.accountInfo.cardBody, justifyContent: 'space-between'}}
              >
                <div className={styles.wrapper}>
                  <FiUser className={styles.icon}  size={40} />
                  <div>
                    <div>{`${getSnapshot(mstUser).chatUser.get_detail?.first_name} ${getSnapshot(mstUser).chatUser.get_detail?.last_name}`}</div>
                    <div>{`${getSnapshot(mstUser).chatUser.email}`}</div>
                  </div>
                </div>
              </Card>
            </div>
            <Tabs className={styles.tabs} defaultActiveKey="1" centered>
              <TabPane className={styles.privateChat} tab={`Private (${getSnapshot(mstUser).users.filter(user => user.email !== getSnapshot(mstUser).chatUser.email).length})`} key="1">
              <List 
                className={styles.list}
                dataSource={getSnapshot(mstUser).users.filter(user => user.email !== getSnapshot(mstUser).chatUser.email) || []}
                renderItem={(user, index) => {
                  return (
                    <Card
                      className={styles.card}
                      bodyStyle={customStyles.list.cardBody}
                    >
                      <div className={styles.listItemWrapper}>
                        <div className={styles.listItem}>
                          <div>
                            <div>{user.email}</div>
                            {
                              isOnline(user.user_uuid) ? 
                              (
                                <div className={styles.onlineIndicatorWrapper}>
                                  <FiRadio size={18} color={'green'} />
                                  <div className={styles.onlineIndicator}>Online</div>
                                </div>
                              )
                              :
                              (
                                <div className={styles.offlineIndicatorWrapper}>
                                  <FiRadio size={18} color={'grey'} />
                                  <div className={styles.offlineIndicator}>Offline</div>
                                </div>
                              )
                            }
                          </div>
                        </div>
                        <div className={styles.listItem}>
                          <Button className={styles.button} disabled={!isOnline(user.user_uuid)} type='link' onClick={() => { onGotoChat("private", connectedUsers.find(u => u.uuid === user.user_uuid)) }}>
                            <FiMessageCircle size={22} color={isOnline(user.user_uuid) ? colors.primary : colors.disabled} style={{ marginRight: 0 }} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                }}
              />
              </TabPane>
              <TabPane className={styles.groupChat} tab="Group" key="2">
                <div className={styles.wrapper}>
                  <div className={styles.content}>
                    <Input placeholder='Enter Room ID' className={styles.searchBox}  onChange={(e) => { onChangeRoomId(e.target.value) }} />
                    <Button className={styles.button} type="primary" onClick={() => { onGotoChat("group", roomId) }}>Join</Button>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        )
      }
    </Container>
  )
})

const customStyles = {
  accountInfo: {
    cardBody: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
  },
  list: {
    cardBody: {
      paddingTop: 10,
      paddingBottom: 10,
    },
  }
}

export default DashboardScreen;