import { Row, Col, Layout, Button } from "antd";
import { config } from "../config";

import chart_img from "../assets/icons/chart_img.jpg";
import html_img from "../assets/icons/html.png";
import xlsx_img from "../assets/icons/xlsx.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteAnlysisResult } from "../redux/analysis/analysisAction";
import { useHistory } from "react-router";

const responseStatic = {
  folderId: 108,
  "Simulated_EV_Load.xlsx": "media/outputs/109/Simulated_EV_Load.xlsx",
  "EV load_Year 1.png": "media/outputs/109/EV load_Year 1.png",
  "DT_Base_Load.xlsx": "media/outputs/109/DT_Base_Load.xlsx",
  "Base load": "media/outputs/109/Base load.png",
  "Base load_2": "media/outputs/109/Base load_2.png",
  "Base load_3": "media/outputs/109/Base load_3.png",
  "Base load_4": "media/outputs/109/Base load_4.png",
  "Base load_5": "media/outputs/109/Base load_5.png",
  "Base load + EV load (kW) in Year 1":
    "media/outputs/109/Base load + EV load (kW) in Year 1.png",
  "Base load + EV load (kW) in Year 2":
    "media/outputs/109/Base load + EV load (kW) in Year 2.png",
  "Base load + EV load (kW) in Year 3":
    "media/outputs/109/Base load + EV load (kW) in Year 3.png",
  "Base load + EV load (kW) in Year 4":
    "media/outputs/109/Base load + EV load (kW) in Year 4.png",
  "Base load + EV load (kW) in Year 5":
    "media/outputs/109/Base load + EV load (kW) in Year 5.png",
  "summary_table.png": "media/outputs/109/summary_table.png",
  "overshot_1.xlsx": "media/outputs/109/overshot_1.xlsx",
  "overshot_2.xlsx": "media/outputs/109/overshot_2.xlsx",
  "overshot_3.xlsx": "media/outputs/109/overshot_3.xlsx",
  "overshot_4.xlsx": "media/outputs/109/overshot_4.xlsx",
  "overshot_5.xlsx": "media/outputs/109/overshot_5.xlsx",
  "overshot_density.html": "media/outputs/109/overshot_density.html",
  "overshot_density_2.html": "media/outputs/109/overshot_density_2.html",
  "overshot_density_3.html": "media/outputs/109/overshot_density_3.html",
  "overshot_density_4.html": "media/outputs/109/overshot_density_4.html",
  "overshot_density_5.html": "media/outputs/109/overshot_density_5.html",
  "overshot_density_r.html": "media/outputs/109/overshot_density_r.html",
  "overshot_density_2_r.html": "media/outputs/109/overshot_density_2_r.html",
  "overshot_density_3_r.html": "media/outputs/109/overshot_density_3_r.html",
  "overshot_density_4.html": "media/outputs/109/overshot_density_4.html",
  "overshot_density_5_r.html": "media/outputs/109/overshot_density_5_r.html",
  "Base load + ToD EV load.png": "media/outputs/109/Base load + ToD EV load.png",
  "Load_Simulation_ToD_Calculation_Data.xlsx":
    "media/outputs/109/Load_Simulation_ToD_Calculation_Data.xlsx",
  "TOD_Surcharge_Rebate.xlsx": "media/outputs/109/TOD_Surcharge_Rebate.xlsx",
};

export const AnalysisResult = (props) => {

  const { analysisResult } = useSelector(state => state.analysis);
  const AnalysisResultData = JSON.parse(analysisResult)
  const history = useHistory()
  const dispatch = useDispatch()
  // useEffect(() => {
  //   window.addEventListener("beforeunload", function (e) {
  //     dispatch(deleteAnlysisResult({ folderId: AnalysisResultData.id }))
  //   });
  // }, []);

  return (
    <>
      <div className="pb-8 pt-5 pt-md-8 analysis_result_page">
        <Layout>
          <h2 className="page_title text-center">Analysis Result</h2>
          <div className="result_items">
            <div className="items">
              <div className="header-box">
                <h3>Charts</h3>
                <Button className="btn" onClick={() => {
                  dispatch(deleteAnlysisResult({ folderId: AnalysisResultData.id }));
                  history.push('/ev-analysis')
                }}>
                  New Analysis
                </Button>
              </div>

              <Row gutter={[20, 20]} className="main_row">
                {Object.values(AnalysisResultData).map((item) => {
                  if (typeof item === "string" && item.includes(".png")) {
                    const fileUrl = `${config().API_BASE_URL}/${item}`;
                    const files = (item && item?.split("/")) || [];

                    const download = e => {
                      console.log(e.target.href);
                      fetch(fileUrl, {
                        method: "GET",
                        headers: {}
                      })
                        .then(response => {
                          response.arrayBuffer().then(function (buffer) {
                            const url = window.URL.createObjectURL(new Blob([buffer]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", files[files.length - 1]); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                          });
                        })
                        .catch(err => {
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
                            <div

                              className="btn"

                              onClick={download}
                            >
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

                    const download = e => {
                      console.log(e.target.href);
                      fetch(fileUrl, {
                        method: "GET",
                        headers: {}
                      })
                        .then(response => {
                          response.arrayBuffer().then(function (buffer) {
                            const url = window.URL.createObjectURL(new Blob([buffer]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", files[files.length - 1]); //or any other extension
                            document.body.appendChild(link);
                            link.click();
                          });
                        })
                        .catch(err => {
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
                            <div

                              className="btn"

                              onClick={download}
                            >
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
