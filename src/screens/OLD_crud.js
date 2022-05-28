import React, { useEffect } from 'react';
import { Button, Card, Input, List } from 'antd';
import Container from '../components/container';
import { AiFillDelete, AiOutlineDelete, AiOutlineForm, AiOutlinePlusCircle, AiOutlineUserAdd  } from 'react-icons/ai';
import { FiDelete, FiEdit, FiEdit2, FiEdit3, FiMessageCircle, FiTrash2, FiUserMinus, FiUserPlus, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getSnapshot } from 'mobx-state-tree';
import { mstUser } from '../mobx';
import { observer } from 'mobx-react';

const USERS = [
  { id: 1, name: "Ahmad", followed: true },
  { id: 1, name: "Abu", followed: false },
  { id: 1, name: "Akmal", followed: true },
  { id: 1, name: "Ridhwan", followed: false }
]
const CrudScreen = observer((props) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    mstUser.fetchUser();
  }, [])

  const UserListingComponent = (props) => {
    return (
      <List 
        style={styles.list}
        dataSource={props.users}
        header={
          <div style={styles.list.headerWrapper}>
            <div style={styles.list.header}>
              <Input placeholder='Search User' style={styles.list.searchBox} />
              <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { props.navigate('/users/new') }}>
                <FiUserPlus size={28} color={'#F24C4C'} />
              </Button>
            </div>
            {/* <div style={styles.list.resultCountLabel}>Showing {USERS.length} results</div> */}
          </div>
        }
        renderItem={(user, index) => {
          return (
            <Card
              bodyStyle={styles.list.cardBody}
            >
              <div style={styles.list.item}>
                <div style={styles.list.item}>
                  {/* <div style={{ marginRight: 10 }}>{index + 1}.</div> */}
                  <div>{user.email}</div>
                </div>
                <div style={styles.list.item}>
                  <Button style={{ padding: 0, lineHeight: 0 }} type='link' onClick={() => { props.navigate('/chat') }}>
                    <FiEdit size={22} color={'#F24C4C'} style={{ marginRight: 15 }} />
                  </Button>
                  <FiTrash2 size={22} color={'#F24C4C'} style={{ marginLeft: 0 }} />
                </div>
              </div>
            </Card>
          )
        }}
      />
    )
  }

  return (
    <Container>
      <div style={styles.content}>
        <UserListingComponent users={getSnapshot(mstUser).users || []} navigate={navigate} />
      </div>
    </Container>
  )
})

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: 10
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

export default CrudScreen;