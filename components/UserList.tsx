import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { socket } from '../network/';
import { httpHost } from '../network';
import { Avatar } from 'antd';

export default function UserList({
  userListSSR = [],
  inRoom = false,
  RoomUsers = [''],
  currentUser = '', // currentUser 相当于 当前聊天对象
  setCurrentUser = new Function(),
  setMessages = new Function(),
  setRoomMessages = new Function(),
  setIsloading = new Function(),
}) {
  console.log('UserLsit被渲染',Date.now());

  const value: string = useSelector((store: any) => store.username.value);
  const [Users, setUsers] = useState([
    {
      username: '',
      avatar: '',
    },
  ]);

  async function setCurrentChater(user: any) {
    console.log(`选择了 ${user} 与您进行聊天`);
    setTimeout(() => {
      let chatScreen = document.querySelector('#chat') as HTMLElement;
      chatScreen && chatScreen.scrollTo(0, chatScreen.scrollHeight); // 滚动聊天最底部，设置延迟不然就先滚动再添加信息了
    }, 300);
    setCurrentUser(user);
  }

  function getCurentMessages() {
    axios
      .post(`${httpHost}message/list`, {
        username: value,
        currentChater: currentUser,
      })
      .then((res) => {
        setMessages(res.data.data.messageList);
      });
    setTimeout(() => {
      let chatScreen = document.querySelector('#chat') as HTMLElement;
      chatScreen && chatScreen.scrollTo(0, chatScreen.scrollHeight); // 滚动聊天最底部，设置延迟不然就先滚动再添加信息了
    }, 300);
  }

  function getRoomMessages(data: any) {
    setTimeout(() => {
      let chatScreen = document.querySelector('#chat') as HTMLElement;
      chatScreen && chatScreen.scrollTo(0, chatScreen.scrollHeight); // 滚动聊天最底部，设置延迟不然就先滚动再添加信息了
    }, 300);
    console.log('发送了房间信息');

    setRoomMessages((oldData: any) => {
      return [...oldData, ...data];
    });
  }

  useEffect(() => {
    setIsloading(true);
    if (currentUser !== '') {
      getCurentMessages();
    }
  }, [currentUser]);

  // async function getUserList() {
  //   try {
  //     const { data: res } = await axios.get(`${httpHost}user/all`);
  //     setUsers(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  // useEffect(() => {
  //   getUserList();
  // }, []);
  useEffect(() => {
    console.log(userListSSR);
    setUsers(userListSSR);
  }, []);

  useEffect(() => {
    socket.on('showMessage', getCurentMessages);
    socket.on('sendRoomMessage', getRoomMessages);

    return () => {
      socket.off('showMessage');
      socket.off('sendRoomMessage');
    };
  });

  return !inRoom ? (
    <Container>
      {Users.map((user, index) => {
        if (user.username == value) {
          return;
        }
        return (
          <div
            className="userCard"
            onClick={() => setCurrentChater(user.username)}
            key={index}
          >
            <Avatar className="avatar" src={user.avatar}></Avatar>
            <p className="username">{user.username}</p>
          </div>
        );
      })}
      {Users.map((user, index) => {
        if (user.username == value) {
          return (
            <Avatar key={index} className="myAvatar" src={user.avatar}></Avatar>
          );
        }
      })}
    </Container>
  ) : (
    <Container>
      {Users.map((user, index) => {
        if (RoomUsers.includes(user.username)) {
          return (
            <div className="userCard" key={index}>
              <Avatar className="avatar" src={user.avatar}></Avatar>
              <p className="username">{user.username}</p>
            </div>
          );
        }
      })}
      {Users.map((user, index) => {
        if (user.username == value) {
          return (
            <Avatar key={index} className="myAvatar" src={user.avatar}></Avatar>
          );
        }
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 35%;
  height: 100%;
  /* background-color: #946127c5; */
  border-radius: 20px 0 0 20px;
  background: #f7f7f7;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  margin-right: 5px;

  ::-webkit-scrollbar {
    width: 4px;
    background-color: grey;
  }
  .myAvatar {
    position: fixed;
    right: 10px;
    top: 6vw;
    z-index: 100;
    width: 7vw;
    height: 7vw;
  }
  .userCard {
    width: 90%;
    height: 20%;
    border-bottom: 1px solid #5a4d4daa;
    justify-content: space-around;
    align-items: center;
    display: flex;
    .avatar {
      width: 7vw;
      height: 7vw;
    }
    .username {
      font-size: 20px;
      color: #e67f09;
    }
    transition: all 0.5s;
    :hover {
      cursor: pointer;
      .username {
        font-weight: bold;
        color: #1d0b04dd;
      }
    }
  }
`;

function data(data: any, user: string): (...args: any[]) => void {
  throw new Error('Function not implemented.');
}
// import React from 'react'
// import styled from 'styled-components'

// export default function UserList(
//     {
//         currentUser = '',
//         setCurrentUser = new Function(),
//         messages = [{
//             sender: '',
//             content: '',
//             receiver: ''
//         }],
//         setMessages = new Function()
//     }
// ) {
//   return (
//       <div>{currentUser}</div>
//   )
// }
