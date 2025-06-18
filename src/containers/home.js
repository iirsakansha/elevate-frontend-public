import React, { useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import routes from "../routes.js";
import { ReactComponent as AppIcon } from "../assets/icons/app-icon.svg";
import { ReactComponent as DownArrow } from "../assets/icons/downarrow.svg";
import { Divider, Layout, Menu, Dropdown } from "antd";
import { Row, Col } from "antd";
import ProfileImage from "../assets/icons/profile.png";
import { useDispatch, useSelector } from "react-redux";
import { signOutAction } from "../redux/auth/authAction.js";
import { getProfile } from "../redux/profile/profileAction.js";

const { Sider, Content, Header } = Layout;

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile.profile);
  const { analysisResult } = useSelector((state) => state.analysis);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  const getRoutes = () => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ));
  };

  const handleLogout = () => {
    dispatch(
      signOutAction(() => {
        navigate("/signin");
      })
    );
  };

  const avatarMenu = (
    <Menu>
      <Menu.Item key="user-profile">
        <Link to="/user-profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="change-password">
        <Link to="/change-password">Change Password</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Sider>
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <AppIcon />
        </div>
        <Divider />
        <Menu>
          <Menu.Item key="templates">
            <Link to="/templates">EV Scenarios</Link>
          </Menu.Item>
          <Menu.Item key="ev-analysis">
            <Link to="/ev-analysis">Analysis</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header>
          <Row>
            <Col xs={20} md={19}>
              <p className="header_title">
                ELEVATE (Estimate Load of Electric Vehicles And Tariff Elasticity)
              </p>
            </Col>
            <Col span={4} md={5}>
              <div className="avatar-dropdown-trigger">
                <Dropdown overlay={avatarMenu} trigger={["click"]}>
                  <div className="header_avatar">
                    <div className="user_avatar">
                      <img src={ProfileImage} alt="User Avatar" title="User Image" />
                    </div>
                    <div className="line">
                      <p className="user_name">{profile?.username}</p>
                      <DownArrow />
                      </div>
                  </div>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>
        <Content>
          <div className="bg-darkyellow" style={{ height: "100%" }}>
            <Routes>{getRoutes()}</Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};