import { Avatar, Divider, Card, Row, Col, Spin } from "antd";
import { useSelector } from "react-redux";
import ProfileImage from "../assets/icons/profile.png";

export const UserProfile = (props) => {

  const { profile, isProfileLoading } = useSelector((state) => state.profile);

  if (isProfileLoading) {
    return (
      <div className="loader">
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div className="pb-8 pt-5 pt-md-8 userprofile_page">
        <Card className="card-stats mb-4 mb-xl-0 px-5 py-4" title="Profile">
          <div>
            <Row className="user_avatar">
              <Col>
                <Avatar src={ProfileImage} />
                <h2 className="username">Welcome {profile?.username}</h2>
              </Col>
            </Row>
            <div className="profile-info-container">
              <Row className="profile-info">
                <Col>
                  <div>
                    <i class="fa fa-user" aria-hidden="true"></i>
                    <span>Name</span>
                  </div>
                  <div>{profile?.username || "---"}</div>
                </Col>
              </Row>
              <Divider />
              <Row className="profile-info">
                <Col>
                  <div>
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                    <span>Email</span>
                  </div>
                  <div>{profile?.email || "---"}</div>
                </Col>
              </Row>
              <Divider />
              <Row className="profile-info">
                <Col>
                  <div>
                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                    <span>Organization Name</span>
                  </div>
                  <div>World Resources Institute</div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
