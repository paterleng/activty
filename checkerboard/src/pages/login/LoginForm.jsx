import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex,notification } from 'antd';
import { useNavigate,Link } from 'react-router-dom';
import { UseAuth } from '../../App';
import { loginUser } from '../../apis/manage';



const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = UseAuth();
  const onFinish = async (values) => {
    const response = await loginUser(values)
    console.log(response)
    if (response.code === 200) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); 
      navigate('/',{resp:response});
    } else {
        notification.warning({
            message: response.data.code,
            description: response.data.msg,
        });
    }
  };
  return (
      <Form
        name="login"
        initialValues={{
          remember: true,
        }}
        style={{
          // maxWidth: 560,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入账号!',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            {location.pathname === '/login' && (
            <Link to="/register">没有账号？去注册</Link>
            )}
          </Flex>
        </Form.Item>
        
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
        </Form>

  );
};

export default LoginForm;