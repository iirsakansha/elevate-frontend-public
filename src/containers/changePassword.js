import {
  Form,
  Input as AntInput,
  Divider,
  Button as AntButton,
  Layout,
  Card,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../redux/auth/authAction";
import { useNavigate } from "react-router-dom";

export const ChangePassword = (props) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isChangePasswordLoading, isChangePasswordError } = useSelector(
    (state) => state.user
  );
  return (
    <div className="pb-8 pt-5 pt-md-8 change_pass_page">
      <Layout>
        <Card
          className="card-stats mb-4 mb-xl-0 px-5 py-4"
          title="Change Password"
          extra={
            <AntButton
              onClick={() => navigate(-1)}
              className="back-button"
              style={{ backgroundColor: '#f3b229', borderColor: '#f3b229' }}
            >
              Back
            </AntButton>
          }
        >
          <Form
            className="wri_form"
            layout="vertical"
            onFinish={(value) => {
              if (!error) {
                dispatch(
                  changePassword({
                    old_password: value.currentPassword,
                    new_password: value.newPassword,
                  })
                );
              }
            }}
            onValuesChange={(changeValue, allValue) => {
              const key = Object.entries(changeValue)[0][0];
              if (
                (key === "newPassword" || key === "confirmPassword") &&
                allValue.confirmPassword
              ) {
                if (allValue.confirmPassword !== allValue.newPassword) {
                  setError("Confirm password doesn't match to the New password.");
                } else {
                  setError(null);
                }
              }
            }}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Current Password is Required",
                },
              ]}
            >
              <AntInput.Password placeholder="Current Password" />
            </Form.Item>
            <Divider />
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "New Password is Required",
                },
              ]}
            >
              <AntInput.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Confirm Password is Required",
                },
              ]}
            >
              <AntInput.Password placeholder="Confirm Password" />
            </Form.Item>
            <AntButton
              className="form_btn"
              htmlType="submit"
              loading={isChangePasswordLoading}
            >
              Change Password
            </AntButton>
            <br />
            <br />
            {(error || isChangePasswordError) && (
              <>
                <div className="alert alert-danger" role="alert">
                  {error || isChangePasswordError}
                </div>
              </>
            )}
          </Form>
        </Card>
      </Layout>
    </div>
  );
};
