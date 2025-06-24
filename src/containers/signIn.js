import { Form, Input, Button as AntButton, Layout, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as AppIcon } from "../assets/icons/app-icon.svg";
import { signInAction } from "../redux/auth/authAction";
import { useEffect, useState } from "react";
import { ApiService } from "../../src/api/index";

export const SignIn = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [form] = Form.useForm();
  const { isSigninLoading, isSigninError } = useSelector((state) => state.user);

  const [initialValues, setInitialValues] = useState({ username: "", password: "" });

  useEffect(() => {
    if (token) {
      const decodeToken = async () => {
        try {
          const response = await ApiService.decodeToken(token);
          const { username, password } = response.data;
          setInitialValues({ username, password });
          form.setFieldsValue({ username, password });
        } catch (err) {
          console.error("Failed to decode token:", err);
        }
      };
      decodeToken();
    }
  }, [token, form]);

  const handleSignIn = (value) => {
    dispatch(
      signInAction(value, () => {
        navigate("/ev-analysis", { replace: true });
      })
    );
  };

  return (
    <Layout className="bg-darkyellow h-100vh d-flex align-items-center justify-content-center user_signin_page">
      <div className="signin_container">
        <Card className="w-25 p-4" title={<AppIcon />}>
          <div className="form_title">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account.</p>
          </div>
          <Form
            form={form} // Bind form instance
            className="signin_form wri_form"
            autoComplete="off"
            layout="vertical"
            onFinish={handleSignIn}
            initialValues={initialValues} // Set initial values for form fields
          >
            <Form.Item
              label="User Id"
              name="username"
              rules={[{ required: true, message: "User Id is Required" }]}
            >
              <Input placeholder="User Id" disabled={!!token} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is Required" }]}
            >
              <Input.Password placeholder="Password" disabled={!!token} />
            </Form.Item>
            <AntButton htmlType="submit" className="form_btn" loading={isSigninLoading}>
              Sign In
            </AntButton>
            {isSigninError && (
              <div className="alert alert-danger mt-3" role="alert">
                {isSigninError}
              </div>
            )}
          </Form>
        </Card>
      </div>
    </Layout>
  );
};