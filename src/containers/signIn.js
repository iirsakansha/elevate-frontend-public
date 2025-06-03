import { Form, Input, Button as AntButton, Layout, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { ReactComponent as AppIcon } from "../assets/icons/app-icon.svg";
import { signInAction } from "../redux/auth/authAction";

export const SignIn = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { isSigninLoading, isSigninError } = useSelector(
    (state) => state.user
  );

  const handleSignIn = (value) => {
    dispatch(
      signInAction(value, () => {
        history.replace("/ev-analysis");
      })
    );
  };
  return (
    <Layout
      fluid
      className="bg-darkyellow h-100vh d-flex align-items-center justify-content-center user_signin_page"
    >
      <div className="signin_container">
        {/* <AppIcon/> */}
        <Card className="w-25 p-4" title={<AppIcon />}>
          <div className="form_title">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account.</p>
          </div>
          <Form
            className="signin_form wri_form"
            autoComplete="off"
            layout="vertical"
            onFinish={handleSignIn}
          >
            <Form.Item
              label="User Id"
              name="username"
              rules={[{ required: true, message: "User Id is Required" }]}
            >
              <Input placeholder="User Id" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is Required" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <AntButton
              htmlType="submit"
              className="form_btn"
              color="info"
              loading={isSigninLoading}
            >
              Sign In
            </AntButton>
            {isSigninError && (
              <>
                <div class="alert alert-danger mt-3" role="alert">
                  {isSigninError}
                </div>
              </>
            )}
          </Form>
        </Card>
      </div>
      {/* </div> */}
    </Layout>
  );
};
