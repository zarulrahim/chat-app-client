import React, { useEffect, useState } from 'react';
import { Button, Card, Input } from 'antd';
import Container from '../components/container';
import { AiOutlineArrowLeft, AiOutlineSend  } from 'react-icons/ai';
import moment from 'moment';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getSnapshot } from 'mobx-state-tree';
import { mstUser } from '../mobx';
import { io } from 'socket.io-client';
import socket from '../socketClient';

const { TextArea } = Input;

// const CONVOS = [
//   {
//     id: 1,
//     content: "Salam Hi!",
//     sender: "me"
//   },
//   {
//     id: 2,
//     content: "Ye saya?",
//     sender: "Akmal"
//   },
//   {
//     id: 3,
//     content: "Apa khabar?",
//     sender: "me"
//   },
// ]

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
      from: getSnapshot(mstUser).user.get_detail.first_name,
      fromUuid: getSnapshot(mstUser).user.user_uuid,
      timestamp: moment().format("DD/MM/YY h:m")
    }
    if (data.message !== "") {
      socket.emit('send_message', data);
      setMessage("")

      let newConvos = {
        content: data.message,
        sender: data.from,
        uuid: data.fromUuid,
        fromMyself: getSnapshot(mstUser).user.user_uuid === data.fromUuid,
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
        fromMyself: getSnapshot(mstUser).user.user_uuid === data.uuid,
        timestamp: data.timestamp
      }
      setConvos(values => [...values, newConvos])
    })
  }, [socket]);

  return (
    <Container
      enableBackButton={true}
      onBackEvent={() => {
        navigate('/dashboard')
      }}
    >
      <div style={styles.content}>
        <Card 
          style={styles.chatbox.card}
          bodyStyle={styles.chatbox.cardBody}
        >
          {
            convos.map((item, index) => {
              return (
                <Card
                  key={index}
                  style={{
                    ...styles.convos.card, 
                    width: '60%', 
                    position: 'relative',
                    float: item.fromMyself ? 'right' : 'left',
                    borderBottomRightRadius: item.fromMyself ? 0 : 15,
                    borderBottomLeftRadius: item.fromMyself ? 15 : 0,
                    backgroundColor: item.fromMyself ? "#F55353" : "#205375"
                  }}
                  bodyStyle={styles.convos.cardBody}
                >
                  {
                    item.fromMyself ?
                    (
                      null
                    )
                    :
                    (
                      <div><b>{item.sender}</b></div>
                    )
                  }
                  <div>{item.content}</div>
                  <div style={{ fontSize: 12, marginTop: 5, opacity: 0.5 }}>{item.timestamp}</div>
                </Card>
              )
            })
          }
        </Card>
        <div style={{ display: 'flex', alignItems: 'end', marginTop: 10 }}>
          <TextArea
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={styles.chatbox.textArea}
            placeholder="Type a message"
            autoSize={{ minRows: 1, maxRows: 10 }}
          />
          <Button type='link' size='normal' style={{...styles.chatbox.button, marginRight: 0 }} onClick={() => { sendMessage() }}>
            <AiOutlineSend size={25} />
          </Button>
        </div>
        
      </div>
    </Container>
  )
}

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
  convos: {
    card: {
      borderRadius: 15,
      borderWidth: 0,
      marginBottom: 10,
      textAlign: 'left',
    },
    cardBody: {
      padding: 10,
      color: '#fff'
    }
  },
  chatbox: {
    display: 'flex',
    card: {
      width: '100%',
      textAlign: 'center',
      borderRadius: 15,
      borderWidth: 0,
      height: 400,
      overflowY: 'scroll',
      // backgroundImage: 'url("https://res.cloudinary.com/practicaldev/image/fetch/s--WAKqnINn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/tw0nawnvo0zpgm5nx4fp.png")',
      backgroundSize: 'cover'
    },
    cardBody: {
      padding: 10
    },
    button: {
      borderRadius: 50,
      paddingRight: 0,
      lineHeight: 0,
      color: '#fff',
      // height: 0,
      // width: '5%',

    },
    textArea: {
      width: '95%',
      // height: 10,
      // marginRight: 0,
      borderRadius: 10,
      borderWidth: 0,
    }
  },
}

export default ChatScreen;