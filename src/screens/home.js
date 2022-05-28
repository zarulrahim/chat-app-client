import { Card } from 'antd';
import React from 'react';
import { FiLogIn, FiLogOut, FiMessageCircle, FiUser, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Container from '../components/container';

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div style={styles.content}>
        <div style={styles.menuSelection}>
          <Card bodyStyle={styles.menuSelection.cardBody} onClick={() => { navigate('/auth') }} style={{...styles.menuSelection.card, cursor: 'pointer' }}>
            <div>
              <FiLogIn size={36} />
              <div>Enter Now</div>
            </div>
          </Card>
          {/* <Card bodyStyle={styles.menuSelection.cardBody} onClick={() => { navigate('/auth') }} style={{...styles.menuSelection.card, marginLeft: 10, cursor: 'pointer' }}>
            <div>
              <FiMessageCircle size={36} />
              <div>Register</div>
            </div>
          </Card> */}
        </div>
      </div>
    </Container>
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
    padding: 15,
    // paddingBottom: 10,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 0,
    textAlign: 'center'
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

export default HomeScreen;