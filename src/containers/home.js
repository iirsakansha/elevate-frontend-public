import React from "react";
import { Route, Link, useHistory } from "react-router-dom";
import routes from "../routes.js";

import { ReactComponent as AppIcon } from "../assets/icons/app-icon.svg";
import { UserProfile } from "./userProfile.js";
import { ChangePassword } from "./changePassword.js";
import { Divider, Layout, Menu } from "antd";
import { Row, Col } from "antd";

import ProfileImage from "../assets/icons/profile.png";
import { useDispatch, useSelector } from "react-redux";
import { signOutAction } from "../redux/auth/authAction.js";
import { useEffect } from "react";
import { getProfile } from "../redux/profile/profileAction.js";
import { AnalysisResult } from "./analysis-result.js";
import { deleteAnlysisResult } from "../redux/analysis/analysisAction.js";

const { Sider, Content, Header } = Layout;

export const Home = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const profile = useSelector((state) => state.profile.profile);
  const { analysisResult } = useSelector(state => state.analysis);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route
          path={prop.path}
          exact={prop.exact}
          component={prop.component}
          key={key}
        />
      );
    });
  };

  return (
    <>
      <Layout>
        <Sider>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <AppIcon />
          </div>
          <Divider />
          <Menu>
            <Menu.Item>
              <Link to="/ev-analysis">Ev-Analysis</Link>
            </Menu.Item>

            <Menu.Item>
              <Link to="/user-profile">Profile</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/change-password">Change Password</Link>
            </Menu.Item>
            <Menu.Item>
              <div className="logout_link"
                onClick={() => {
                  // if (analysisResult.folderId == null) {
                  //   dispatch(deleteAnlysisResult(analysisResult.folderId))
                  // }
                  dispatch(
                    signOutAction(() => {
                      history.push("/signin");
                    })
                  );
                }}
              >
                Logout
              </div>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <Row>
              <Col xs={20} md={19}>
                <p className="header_title">ELEVATE (Estimate Load of Electric Vehicles And Tariff Elasticity)</p>
              </Col>
              <Col span={4} md={5}>
                <div className="header_avatar">
                  <div className="user_avatar">
                    <img
                      src={ProfileImage}
                      alt="User Avatar"
                      title="User Image"
                    />
                  </div>
                  <p className="user_name">{profile?.username}</p>
                  {/* <p className="user_name">{new Intl.DateTimeFormat().format(profile?.last_login)}</p> */}
                </div>
              </Col>
            </Row>
          </Header>
          <Content>
            <div className="bg-darkyellow" style={{ height: "100%" }}>
              {getRoutes(routes)}
              <Route exact path="/user-profile" component={UserProfile} />
              <Route exact path="/change-password" component={ChangePassword} />
              <Route exact path="/analysis-result" component={AnalysisResult} />
            </div>
          </Content>
        </Layout>
      </Layout>
      {/* <Sidebar
            {...props}
            routes={routes}
            logo={<AppIcon/>}
        />
        <div className="main-content" ref={mainContent}>
            <AdminNavbar
                {...props}
                brandText={"EV-Tool"}

            />
            <Switch>
                
            </Switch>
        </div> */}
    </>
  );
};
