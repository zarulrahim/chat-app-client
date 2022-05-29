import { Card } from 'antd';
import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/container';
import styles from './index.module.css';

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div className={styles.content}>
        <div className={styles.menuSelection}>
          <Card className={styles.menuSelectionCard} bodyStyle={customStyles.menuSelection.cardBody} onClick={() => { navigate('/auth') }}>
            <div>
              <FiLogIn size={36} />
              <div>Enter Now</div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}

const customStyles = {
  menuSelection: {
    cardBody: {
      paddingTop: '15px',
      padding: '10px'
    }
  },
}

export default HomeScreen;