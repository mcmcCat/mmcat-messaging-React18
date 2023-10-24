import { Button } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { socket } from '../network/';
import { httpHost } from '../network/index';
import { notification, Spin, Input } from 'antd';
import { formatTime } from '../utils/formatTime';

export default function ChatContent({
  inRoom = false,
  roomId = '',
  currentUser = '',
  messages = [
    {
      sender: '',
      content: '',
      receiver: '',
      sendTime: '',
    },
  ],
  roomMessages = [
    {
      sender: '',
      content: '',
      sendTime: '',
    },
  ],
  isloading = true,
  setIsloading = new Function(),
}) {
  const value = useSelector((store: any) => store.username.value);
  const [inputValue, setInputValue] = useState(''); // 初始化输入框的值为空

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value); // 更新输入框的值
  };

  async function sendMessage() {
    const time = formatTime(new Date());
    const message = inputValue;

    if (message.length > 0 && message.length <= 20) {
      setTimeout(() => {
        let chatScreen = document.querySelector('#chat') as HTMLElement;
        chatScreen && chatScreen.scrollTo(0, chatScreen.scrollHeight); // 滚动聊天最底部，设置延迟不然就先滚动再添加信息了
      }, 300);

      // 私聊会与数据库交互存储信息，房间聊天是即时聊天不会存储信息
      if (!inRoom) {
        try {
          await axios.post(`${httpHost}message/send`, {
            sender: value,
            content: message,
            receiver: currentUser,
            sendTime: time,
          });

          socket.emit('sendMessage');
        } catch (err) {
          console.log(err);
        }
      } else {
        socket.emit('sendRoomMessage', [
          {
            sender: value,
            content: message,
            sendTime: time,
          },
        ]);
      }
      setInputValue('');
    } else if (message.length > 20) {
      notification.warning({
        message: '警告提示',
        description: '消息长度不能超过20个字符',
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIsloading(false);
    }, 100);
  }, [messages, roomMessages, setIsloading]);

  return !inRoom ? (
    <Container>
      {currentUser === '' ? (
        <h1 className="welcome">点击左侧用户列表开始聊天</h1>
      ) : (
        <div className="chatContent">
          <div className="roomId">与 {currentUser} 的私人房间</div>
          <div className="content" id="chat">
            {isloading ? (
              <Spin size="large" className="loading" />
            ) : (
              messages.map((message, index) => {
                // 当前聊天对象 === 消息接收方（证明是发送方，所以显示右边）
                return message.receiver === currentUser ? (
                  <div className="chat_box chat_box_own" key={index}>
                    <div>{message.sender}</div>
                    <div>{message.sendTime}</div>
                    <div>{message.content}</div>
                  </div>
                ) : (
                  <div className="chat_box" key={index}>
                    <div>{message.sender}</div>
                    <div>{message.sendTime}</div>
                    <div>{message.content}</div>
                  </div>
                );
              })
            )}
          </div>
          <div className="sender">
            <Input
              className="msg"
              value={inputValue}
              onChange={handleInputChange}
              size="large"
              placeholder="说点什么..."
            />
            <Button type="primary" className="send" onClick={sendMessage}>
              发送消息
            </Button>
          </div>
        </div>
      )}
    </Container>
  ) : (
    <Container>
      <div className="chatContent">
        <div className="roomId">房间：{roomId}</div>
        <div className="content" id="chat">
          {isloading ? (
            <Spin size="large" className="loading" />
          ) : (
            roomMessages.map((message, index) => {
              if (message.sender === '') {
                return null;
              }
              // 当前聊天对象 === 消息接收方（证明是发送方，所以显示右边）
              return message.sender === value ? (
                <div className="chat_box chat_box_own" key={index}>
                  <div>{message.sender}</div>
                  <div>{message.sendTime}</div>
                  <div>{message.content}</div>
                </div>
              ) : (
                <div className="chat_box" key={index}>
                  <div>{message.sender}</div>
                  <div>{message.sendTime}</div>
                  <div>{message.content}</div>
                </div>
              );
            })
          )}
        </div>
        <div className="sender">
          <Input
            className="msg"
            value={inputValue}
            onChange={handleInputChange}
            size="large"
            placeholder="说点什么..."
          />
          <Button type="primary" className="send" onClick={sendMessage}>
            发送消息
          </Button>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 75%;
  height: 100%;
  border-radius: 0 20px 20px 0;
  background: #f7f7f7;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  .chatContent {
    width: 100%;
    height: 100%;
  }
  .welcome {
    font-size: 2vw;
    font-family: '楷体';
    color: #aaa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
    z-index: 1;
  }
  .roomId {
    width: 100%;
    margin: 30px 0;
    text-align: center;
    line-height: 50px;
    color: #168cec;
    font-weight: bold;
    font-family: '微软雅黑';
    font-size: 20px;
  }
  .content {
    width: 100%;
    height: 70%;
    padding-left: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      width: 1px;
      background-color: #0e24cb;
    }
    .tip {
      text-align: center;
      color: #707070;
    }
    position: relative;
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .chat_box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 10px;
      width: calc(100% - 20px);
    }
    .chat_box > div:nth-child(1) {
      padding: 2px 10px;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      color: #515151;
      user-select: none;
    }
    .chat_box > div:nth-child(2) {
      padding: 2px 10px;
      font-size: 12px;
      color: #515151;
      user-select: none;
      height: 0;
      overflow: hidden;
      height: fit-content;
    }
    .chat_box > div:nth-child(3) {
      margin: 2px;
      padding: 10px;
      width: fit-content;
      max-width: calc(100% - 50px);
      font-size: 16px;
      color: #000000;
      background: rgb(255, 255, 255);
      border-radius: 0 15px 0 15px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
    .chat_box_own {
      align-items: flex-end;
    }
    .chat_box_own > div:nth-child(3) {
      color: #000000;
      background: rgb(65, 194, 72);
      border-radius: 15px 0 15px 0;
    }
    /* .left {
      width: 100%;
      height: 10vh;
      font-size: 1.5vw;
      font-family: 'Times New Roman';
      color: #13a7bbde;
      margin-left: 5%;
      border-radius: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .right {
      width: 100%;
      height: 10vh;
      color: #000000;
      background: rgb(255, 255, 255);
      border-radius: 15px 0 15px 0;
      font-size: 1.5vw;
      font-family: 'Times New Roman';
      color: #d2b108d4;
      transform: translateX(-7%);
      display: flex;
      justify-content: flex-end;
      align-items: center;
    } */
  }
  .sender {
    margin: 30px 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .msg {
      width: 80%;
    }
    .send {
      width: 100px;
      height: 40px;
    }
  }
  .chatbgc {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }
  //
`;
// import React from 'react'

// export default function ChatContent(
//   {
//     currentUser = 'yang',
//     setCurrentUser = new Function(),
//     messages = [{
//         sender: '',
//         content: '',
//         receiver: ''
//     }],
//     setMessages = new Function()
// }
// ) {
//   return (
//     <div>ChatContent</div>
//   )
// }
