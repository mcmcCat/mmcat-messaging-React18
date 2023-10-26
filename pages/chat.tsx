import axios from 'axios';
import { Button, Modal, Input, Form } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ChatContent from '../components/ChatContent';
import UserList from '../components/UserList';
import { changeName } from '../store/store';
import { routerBeforEach } from '../utils/router-beforEach';
import { socket } from '../network/';
import { formatTime } from '../utils/formatTime';

export async function getServerSideProps(context: any) {
  const { token } = context.query;

  try {
    const response = await fetch('http://localhost:3000/user/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userListSSR = await response.json();
    // 将获取到的数据作为 props 返回
    return {
      props: {
        userListSSR,
      },
    };
  } catch (error) {
    console.error(error);

    // 如果发生错误，你也可以返回一个空数据对象
    return {
      props: {
        userListSSR: [],
      },
    };
  }
}

// export default function Chat({ userList }: { userList: any }) {
export default function Chat({ userListSSR }: any) {
  console.log('Chat被渲染', Date.now());
  const router = useRouter();
  const value = useSelector((store: any) => store.username.value);
  const dispatch = useDispatch();

  const [isloading, setIsloading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: '',
      content: '',
      receiver: '',
      sendTime: '',
    },
  ]);
  const [roomMessages, setRoomMessages] = useState([
    {
      sender: '',
      content: '',
      sendTime: '',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [inRoom, setInRoom] = useState(false); // 是否在房间
  const [roomId, setRoomId] = useState('');
  const [RoomUsers, setRoomUsers] = useState(['']);

  const [form] = Form.useForm();

  function showModal() {
    setModalOpen(true);
  }

  function changeMyAvatar() {
    router.push('/avatar');
  }

  function joinRoom(val: any) {
    // 收集过来的 val 是form表单的item项的name属性所组成的对象，
    // console.log(`${value}想要加入房间：`, val.roomId);
    const roomInfo = {
      roomId: val.roomId,
      user: value,
    };
    socket.emit('joinRoom', roomInfo);
    setInRoom(true);
    setRoomId(val.roomId);

    socket.on('sys', (msg, roomId, users) => {
      console.log(msg, roomId, users);

      setRoomUsers([...users]);
      const time = formatTime(new Date());
      let chatScreen = document.querySelector('#chat') as HTMLElement;

      let tip = document.createElement('div');
      tip.className = 'tip';
      tip.innerHTML = `${msg} (${time})`;
      chatScreen.appendChild(tip);
    });
  }

  function leaveRoom() {
    socket.emit('leave');
    // 清空自己的房间信息
    setRoomId('');
    setInRoom(false);
    // 清除自己的房间聊天窗口信息
    setRoomMessages([]);
    socket.off('sys'); //离开房间停止监听sys事件，不然下次进入房间就会同时触发以前的sys，不断叠加
  }

  useEffect(() => {
    routerBeforEach(router);
    dispatch(changeName(localStorage.getItem('username') as string));
  }, []);

  useEffect(() => {
    console.log('chat组件挂载');
    socket.on('connect', () => {
      socket.emit('connection');
      // 其他客户端事件和逻辑
    });
    return () => {
      console.log('chat组件卸载');
      socket.off();
    };
  }, []);

  return !inRoom ? (
    <Container>
      <Button className="addRoom" type="primary" onClick={showModal}>
        加入房间
      </Button>

      <Button
        className="changeAvararButton"
        type="primary"
        onClick={changeMyAvatar}
      >
        更换我的头像
      </Button>
      <ChatScreen>
        <UserList
          userListSSR={userListSSR}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setMessages={setMessages}
          setIsloading={setIsloading}
        ></UserList>
        <ChatContent
          currentUser={currentUser}
          messages={messages}
          isloading={isloading}
          setIsloading={setIsloading}
        ></ChatContent>
        <Modal
          title=""
          centered
          open={modalOpen}
          onOk={form.submit}
          onCancel={() => setModalOpen(false)}
          className="myModal"
        >
          <Form
            form={form}
            // 提交表单且数据验证成功后回调事件
            onFinish={joinRoom}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            className="form"
          >
            <Form.Item
              label="房间号："
              name="roomId"
              className="form-item"
              rules={[{ required: true, message: '请输入房间号' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </ChatScreen>
    </Container>
  ) : (
    <Container>
      <Button className="addRoom" type="primary" onClick={leaveRoom}>
        退出房间
      </Button>
      <ChatScreen>
        <UserList
          inRoom={inRoom}
          RoomUsers={RoomUsers}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setMessages={setMessages}
          setRoomMessages={setRoomMessages}
          setIsloading={setIsloading}
        ></UserList>
        <ChatContent
          inRoom={inRoom}
          roomId={roomId}
          currentUser={currentUser}
          messages={messages}
          roomMessages={roomMessages}
          isloading={isloading}
          setIsloading={setIsloading}
        ></ChatContent>
      </ChatScreen>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
  .changeAvararButton {
    position: absolute;
    top: 3vw;
    right: 1vw;
    z-index: 999;
  }
  .addRoom {
    position: absolute;
    top: 14vw;
    right: 1vw;
    z-index: 999;
  }
`;
const ChatScreen = styled.div`
  width: 75vw;
  height: 80vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
