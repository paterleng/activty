import { Button, Form, Input,Row,Col } from 'antd';
import { Link } from 'react-router-dom';
import api from '../apis/api'; 

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {                                                                                                                                                                                                                                                                                                                                 
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};



const RegisterForm = () => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const response = await api.post('user/register', values);
    console.log(response)
  };
 
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="nickname"
        label="昵称"
        tooltip="请输入你的昵称"
        rules={[
          {
            required: true,
            message: '请输入你的昵称!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="密码"/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '再次输入密码!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('与第一次输入不匹配!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Row justify="end">
        <Col>
          {location.pathname === '/register' && (
            <Link to="/login">已有账号，去登录</Link>
          )}
        </Col>
      </Row> 
       
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
        

      </Form.Item>
    </Form>
  );
};
export default RegisterForm;