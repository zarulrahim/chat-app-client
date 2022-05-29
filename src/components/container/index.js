import { Button, Card, Tag } from 'antd';
import { getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { FiArrowLeft, FiHome, FiLogOut } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { mstAuth } from '../../mobx';
import { colors } from '../../themes';
import styles from './index.module.css';

const Container = (props) => {
  const navigate = useNavigate();

  const onLogout = () => {
    mstAuth.adminLogout()
    .then((response) => {
      navigate('/auth');
    })
    .catch((error) => {
      navigate('/auth');
    })
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
    <div className={styles.base}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            {
              props.enableBackButton ?
              (
                <Button className={styles.button} type="link" onClick={props.onBackEvent}>
                  <FiArrowLeft color='#fff' size={30} />
                </Button>  
              )
              :
              (
                <Button className={styles.button} type="link" onClick={() => { onGotoHome() }}>
                  <FiHome color='#fff' size={30} />
                </Button>
              )
            }
            <div className={styles.header}> 
              {
                props.headerTitle ?
                (
                  <div className={styles.mainTitle}><b>{props.headerTitle}</b></div>
                )
                :
                (
                  <div className={styles.mainTitle}>Todak<b>Chat</b></div>
                )
              }
              {
                props.isAdminScreen ?
                (
                  <Tag color={colors.secondary} className={styles.tag}>Admin</Tag>
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
                <Button className={styles.button} type="link" onClick={() => { onLogout() }}>
                  <FiLogOut color='#fff' size={30} />
                </Button>
              )
              :
              (
                <div></div>
              )
            }
          </div>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default Container;