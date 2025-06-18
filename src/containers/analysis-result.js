import { Row, Col, Layout, Button } from "antd";
import { config } from "../config";

import chart_img from "../assets/icons/chart_img.jpg";
import html_img from "../assets/icons/html.png";
import xlsx_img from "../assets/icons/xlsx.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteAnlysisResult } from "../redux/analysis/analysisAction";
import { useNavigate } from "react-router";

export const AnalysisResult = (props) => {
  const { analysisResult } = useSelector((state) => state.analysis);
  const AnalysisResultData =
    typeof analysisResult === "string"
      ? JSON.parse(analysisResult)
      : analysisResult || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <div className="pb-8 pt-5 pt-md-8 analysis_result_page">
        <Layout>
          <h2 className="page_title text-center">Analysis Result</h2>
          <div className="result_items">
            <div className="items">
              <div className="header-box">
                <h3>Charts</h3>
                <Button
                  className="btn form_btn"
                  onClick={() => {
                    dispatch(
                      deleteAnlysisResult({ folderId: AnalysisResultData.id })
                    );
                    navigate("/templates");
                  }}
                >
                  New Analysis
                </Button>
              </div>

              <Row gutter={[20, 20]} className="main_row">
                {Object.values(AnalysisResultData).map((item) => {
                  if (typeof item === "string" && item.includes(".png")) {
                    const fileUrl = `${config().API_BASE_URL}/${item}`;
                    const files = (item && item?.split("/")) || [];

                    const download = (e) => {
                      fetch(fileUrl, {
                        method: "GET",
                        headers: {},
                      })
                        .then((response) => {
                          response.arrayBuffer().then(function (buffer) {
                            const url = window.URL.createObjectURL(
                              new Blob([buffer])
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute(
                              "download",
                              files[files.length - 1]
                            ); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    };

                    return (
                      <>
                        <Col
                          xs={{ span: 24 }}
                          md={{ span: 12 }}
                          xl={{ span: 6 }}
                        >
                          <div className="box">
                            <img src={fileUrl} />
                            <h4 className="item_name">
                              {files[files.length - 1]}
                            </h4>
                            <div className="btn" onClick={download}>
                              Download
                            </div>
                          </div>
                        </Col>
                      </>
                    );
                  }
                  return null;
                })}
              </Row>
            </div>

            <div className="items">
              <h3>HTML Files</h3>
              <Row gutter={[20, 20]} className="main_row html_file">
                {Object.values(AnalysisResultData).map((item) => {
                  if (typeof item === "string" && item.includes(".html")) {
                    const fileUrl = `${config().API_BASE_URL}/${item}`;
                    const files = (item && item?.split("/")) || [];

                    const download = (e) => {
                      fetch(fileUrl, {
                        method: "GET",
                        headers: {},
                      })
                        .then((response) => {
                          response.arrayBuffer().then(function (buffer) {
                            const url = window.URL.createObjectURL(
                              new Blob([buffer])
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute(
                              "download",
                              files[files.length - 1]
                            ); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    };
                    return (
                      <>
                        <Col
                          xs={{ span: 24 }}
                          md={{ span: 12 }}
                          xl={{ span: 4 }}
                        >
                          <div className="box html">
                            <img src={html_img} />
                            <h4 className="item_name">
                              {files[files.length - 1]}
                            </h4>
                            <div className="btn" onClick={download}>
                              Download
                            </div>
                          </div>
                        </Col>
                      </>
                    );
                  }
                  return null;
                })}
              </Row>
            </div>

            <div className="items">
              <h3>Excel Files</h3>
              <Row gutter={[20, 20]} className="main_row xlsx_file">
                {Object.values(AnalysisResultData).map((item) => {
                  if (typeof item === "string" && item.includes(".xlsx")) {
                    const fileUrl = `${config().API_BASE_URL}/${item}`;
                    const files = (item && item?.split("/")) || [];
                    return (
                      <>
                        <Col
                          xs={{ span: 24 }}
                          md={{ span: 12 }}
                          xl={{ span: 4 }}
                        >
                          <div className="box xlsx">
                            <img src={xlsx_img} />
                            <h4 className="item_name">
                              {files[files.length - 1]}
                            </h4>
                            <a
                              className="btn"
                              href={fileUrl}
                              download="download"
                            >
                              Download
                            </a>
                          </div>
                        </Col>
                      </>
                    );
                  }
                  return null;
                })}
              </Row>
            </div>
          </div>

          {/* </Card> */}
        </Layout>
      </div>
    </>
  );
};