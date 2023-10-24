import type { NextPage } from 'next';
import styled from 'styled-components';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import picture from '../public/pictures/bc.jpg';
import axios from 'axios';
import { useRouter } from 'next/router';
import { httpHost } from '../network';

const Home: NextPage = () => {
  const router = useRouter();
  interface FormData {
    username: string; //用户名
    password: string; //密码
    confirmedPassword: string; //确认密码
  }

  function passwordIsValid(formData: FormData) {
    return formData.password === formData.confirmedPassword;
  }
  function hasAvatar(username: string) {
    return axios.post(`${httpHost}user/hasavatar`, {
      username,
    });
  }

  async function register(values: FormData) {
    return axios.post(`${httpHost}auth/register`, {
      username: values.username,
      password: values.password,
      avatar: `https://api.multiavatar.com/Binx%${Math.floor(
        Math.random() * 50000,
      )}.png`,
    });
  }

  async function login(values: FormData) {
    const { data: res } = await axios.post(`${httpHost}auth/login`, values);

    if (res === undefined) {
      notification.error({
        message: '登录失败',
        description: '请检查网络设置',
        duration: 2,
      });
      return;
    }
    if (res?.access_token !== undefined) {
      notification['success']({
        message: '成功提示',
        description: '您已经成功登录',
        duration: 2,
      });

      // 把获取到的 token 和 username 存到本地
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('username', values.username);
      let ishasAvatar = await hasAvatar(values.username);

      //没设置头像不给聊天，强制去设置头像，不过头像是注册时去生成随机头像了，一般不会没有头像
      if (ishasAvatar.data) {
        router.push('/chat');
      } else {
        router.push('/avatar');
      }
    } else {
      notification['error']({
        message: '失败提示',
        description: `${res?.msg}`,
        duration: 2,
      });
    }
  }

  const onFinish = async (values: FormData) => {
    if (passwordIsValid(values)) {
      let registerRes = await register(values);
      if (registerRes.data.code == 200 || registerRes.data.code == 1001) {
        login(values);
      }
    } else {
      notification['error']({
        message: '请注意！',
        description: '两次输入密码不一致',
        duration: 2,
      });
    }
  };

  return (
    <Container>
      {/* <img className="background" src={picture.src} alt="" /> */}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        // 提交表单且数据验证成功后回调事件
        onFinish={onFinish}
        autoComplete="off"
        className="form"
      >
        <Form.Item
          label="输入用户名："
          name="username"
          className="form-item"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="请输入密码："
          name="password"
          className="form-item"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="请确认密码："
          name="confirmedPassword"
          className="form-item"
          rules={[{ required: true, message: '请确认密码' }]}
        >
          <Input.Password></Input.Password>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" className="submit-btn">
            登录
          </Button>
        </Form.Item>
        <p>新用户未注册会自动注册并登录</p>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  .form {
    background: #fff;
    width: 30vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 5px 5px 30px #109fb27b;
    //  opacity: 0.8;
    label {
      color: #0e77eede;
      margin-right: 10px;
      font-size: 16px;
    }
  }
  .form-item {
    padding: 10px;
    margin-top: 10px;
  }
  .background {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: -1;
  }
  .submit-btn {
    :hover {
      background: #3f0eeede;
      color: #ffffff;
      border-color: #3f0eeede;
    }
  }
`;

export default Home;
