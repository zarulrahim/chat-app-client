import React, { useEffect, useState } from 'react';
import { Button, Card, Input, List, Tabs } from 'antd';
import Container from '../components/container';
import { FiCircle, FiEdit, FiLogOut, FiMessageCircle, FiRadio, FiUser, FiUserMinus, FiUserPlus, FiXCircle } from 'react-icons/fi';
import { IoEllipse, IoMdAddCircle  } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { mstAuth, mstUser } from '../mobx';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import socket from '../socketClient';

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
    if (getSnapshot(mstUser).user.user_uuid !== undefined) {
      socket.auth = {
        uuid: getSnapshot(mstUser).user.user_uuid,
        email: getSnapshot(mstUser).user.email,
      }
      socket.connect();
      socket.emit("trigger_user_update");
    }
  }, [getSnapshot(mstUser).user.user_uuid !== undefined])

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

  const onGotoChat = (type, targetId) => {
    if (type === 'group') {
      console.log("check roomId ==> ", targetId)
      if (targetId !== null) {
        navigate('/group' + '/' + targetId, { state: { targetId: targetId } });
      }
    } else {
      if (targetId !== null) {
        navigate('/chat' + '/' + targetId, { state: { targetId: targetId } });
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div style={styles.content}>
          <div>Loading...</div>
        </div>
      </Container>
    )
  } else {
    return (
      <Container>
        <div style={styles.content}>
          <div>
            <Card
              style={styles.accountInfo.card}
              bodyStyle={{...styles.accountInfo.cardBody, justifyContent: 'space-between'}}
            >
              <div style={styles.accountInfo.cardBody}>
                <FiUser style={styles.accountInfo.image} size={40} />
                <div>
                  <div>{`${getSnapshot(mstUser).user.get_detail?.first_name} ${getSnapshot(mstUser).user.get_detail?.last_name}`}</div>
                  <div>{`${getSnapshot(mstUser).user.email}`}</div>
                </div>
              </div>
              {/* <Button style={{ padding: 0, lineHeight: 0  }} onClick={() => { mstAuth.logOut(); navigate('/auth')  }} type="link"><FiLogOut size={30} color={'red'} /></Button> */}
            </Card>
          </div>
          <Tabs style={{ backgroundColor: '#fff', borderRadius: 15 }} defaultActiveKey="1" centered>
            <TabPane tab={`Private (${getSnapshot(mstUser).users.filter(user => user.email !== getSnapshot(mstUser).user.email).length})`} key="1">
            <List 
              style={styles.list}
              dataSource={getSnapshot(mstUser).users.filter(user => user.email !== getSnapshot(mstUser).user.email) || []}
              /* header={
                <div style={styles.list.headerWrapper}>
                  <div style={styles.list.header}>
                    <Input placeholder='Search User' style={styles.list.searchBox} />
                    <FiUserPlus size={28} />
                  </div>
                </div>
              } */
              renderItem={(user, index) => {
                return (
                  <Card
                    style={{ borderTopWidth: 0  }}
                    bodyStyle={styles.list.cardBody}
                  >
                    <div style={styles.list.item}>
                      <div style={styles.list.item}>
                        {/* <div style={{ marginRight: 10 }}>{index + 1}.</div> */}
                        <div>
                          <div>{user.email}</div>
                          {
                            isOnline(user.user_uuid) ? 
                            (
                              <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                                <FiRadio size={18} color={'green'} />
                                <div style={{ color: 'green', marginLeft: 5, fontSize: 12 }}>Online</div>
                              </div>
                            )
                            :
                            (
                              <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                                <FiRadio size={18} color={'grey'} />
                                <div style={{ color: 'grey', marginLeft: 5, fontSize: 12 }}>Offline</div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                      <div style={styles.list.item}>
                        <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { onGotoChat("private", connectedUsers.find(u => u.uuid === user.user_uuid).userID) }}>
                          <FiMessageCircle size={22} color={'#F24C4C'} style={{ marginRight: 0 }} />
                        </Button>
                        {/*
                          !user.followed ?
                          (
                            <FiUserPlus size={22} color={'#F24C4C'} style={{ marginLeft: 0 }} />
                          )
                          :
                          (
                            <>
                              <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { navigate('/chat') }}>
                                <FiMessageCircle size={22} color={'#F24C4C'} style={{ marginRight: 0 }} />
                              </Button>
                              <FiUserMinus size={22} color={'#F24C4C'} style={{ marginLeft: 0 }} />
                            </>
                          )
                          */}
                      </div>
                    </div>
                  </Card>
                )
              }}
            />
            </TabPane>
            <TabPane tab="Group" key="2">
            <div style={styles.list.headerWrapper}>
              <div style={{...styles.list.header, marginBottom: 15 }}>
                <Input placeholder='Enter Room ID' style={{...styles.list.searchBox, marginBottom: 0, marginRight: 10 }} onChange={(e) => { onChangeRoomId(e.target.value) }} />
                <Button style={{ borderRadius: 10, lineHeight: 0 }} type="primary" onClick={() => { onGotoChat("group", roomId) }}>Join</Button>
              </div>
              {/* <div style={styles.list.resultCountLabel}>Showing {USERS.length} results</div> */}
            </div>
            </TabPane>
          </Tabs>
        </div>
      </Container>
    )
  }

})

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: 15
  },
  mainTitle: {
    color: '#fff',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center'
  },
  accountInfo: {
    card: {
      borderRadius: 15,
      marginBottom: 10
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
    }
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    paddingTop: 0,
    headerWrapper: {
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 0,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    searchBox: {
      borderRadius: 10,
      // marginRight: 30,
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

export default DashboardScreen;