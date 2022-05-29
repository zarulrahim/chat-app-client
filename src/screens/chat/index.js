import React, { useEffect, useState } from 'react';
import { Button, Card, Input } from 'antd';
import Container from '../../components/container';
import { AiOutlineSend  } from 'react-icons/ai';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { getSnapshot } from 'mobx-state-tree';
import { mstUser } from '../../mobx';
import socket from '../../socketClient';
import styles from './index.module.css';

const { TextArea } = Input;

const ChatScreen = (props) => {
  const navigate = useNavigate();
  const { target_id } = useParams();
  const [message, setMessage] = useState("");
  const [convos, setConvos] = useState([]);

  useEffect(() => {
    if (props.type === 'group') {
      socket.emit('join_room', target_id);
    }
  }, [target_id])

  const sendMessage = () => {
    const data = {
      message: message,
      room: target_id,
      to: target_id,
      from: getSnapshot(mstUser).chatUser.get_detail.first_name,
      fromUuid: getSnapshot(mstUser).chatUser.user_uuid,
      timestamp: moment().format("DD/MM/YY h:m")
    }
    if (data.message !== "") {
      socket.emit('send_message', data);
      setMessage("")

      let newConvos = {
        content: data.message,
        sender: data.from,
        uuid: data.fromUuid,
        fromMyself: getSnapshot(mstUser).chatUser.user_uuid === data.fromUuid,
        timestamp: data.timestamp
      }
      setConvos(values => [...values, newConvos])
    } else {
      console.log("No message sent");
    }
  };  

  useEffect(() => {
    socket.on("receive_message", (data) => {
      let newConvos = {
        content: data.message,
        sender: data.from,
        uuid: data.uuid,
        fromMyself: getSnapshot(mstUser).chatUser.user_uuid === data.uuid,
        timestamp: data.timestamp
      }
      setConvos(values => [...values, newConvos])
    })
  }, [socket]);

  return (
    <Container
      headerTitle={props.type === "group" ? `Room #${target_id}` : `${getSnapshot(mstUser).chatTargetUser.get_detail.first_name}`}
      enableBackButton={true}
      onBackEvent={() => {
        navigate(-1);
      }}
    >
      <div className={styles.content}>
        <Card 
          className={styles.chatboxCard}
          bodyStyle={customStyles.chatboxCard.cardBody}
        >
          {
            convos.map((item, index) => {
              return (
                <Card
                  className={`${styles.convosCard} ${item.fromMyself ? styles.convosCardFromMyself : styles.convosCardFromOthers}`}
                  key={index}
                  bodyStyle={{...customStyles.convosCard.cardBody}}
                >
                  <div className={`${styles.convosBody} ${item.fromMyself ? styles.convosBodyFromMyself : styles.convosBodyFromOthers}`}>
                    {
                      item.fromMyself ?
                      (
                        null
                      )
                      :
                      (
                        <div className={styles.senderName} ><b>{item.sender}</b></div>
                      )
                    }
                    <div>{item.content}</div>
                    <div className={styles.chatTimestamp}>{item.timestamp}</div>
                  </div>
                </Card>
              )
            })
          }
        </Card>
        <div className={styles.messageBox}>
          <TextArea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={styles.textArea}
            placeholder="Type a message"
            autoSize={{ minRows: 1, maxRows: 10 }}
          />
          <Button type='link' size='normal' className={styles.button} onClick={() => { sendMessage() }}>
            <AiOutlineSend size={25} />
          </Button>
        </div>
        
      </div>
    </Container>
  )
}

const customStyles = {
  convosCard: {
    cardBody: {
      padding: 10,
      color: '#fff'
    }
    
  },
  chatboxCard: {
    cardBody: {
      padding: 10
    },
  },
}

export default ChatScreen;