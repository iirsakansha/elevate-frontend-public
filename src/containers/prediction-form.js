import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Upload,
  Button as AntdButton,
  Select,
  Steps,
  Layout,
  Row,
  Col,
  notification,
  DatePicker,
  TimePicker,
  Popover,
} from "antd";
import "./style.css";


import { ReactComponent as FileUploadIcon } from "../assets/icons/file-upload.svg";
import { ReactComponent as FileDownloadIcon } from "../assets/icons/file-download.svg";
import { Helpers } from "../helpers";
import { Prompt, useHistory } from "react-router";
import { ApiService } from "../api";
import { config } from "../config";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getAnalysisResult } from "../redux/analysis/analysisAction";

import Loading from "../assets/icons/loading.gif";
import Info_icon from "../assets/icons/info_icon.png";
import sempleExcelFile from "../assets/sempleFile/DT_Data_Upload.xls";

const { Option } = Select;
const { Step } = Steps;

const mockFile = {
  file: {
    status: "done",
    response: {
      file: "/media/FileUpload/DT_Data_Upload.96f49e0c3591ee87bb15.xls",
      id: 3,
    },
  },
};

const prefilledData = {
  loadCategory: 4,
  isLoadSplit: "no",
  isLoadSplitFile: mockFile,
  categoryData: [
    { category: "commercial", specifySplit: 20, salesCAGR: 3 },
    { category: "agricultural", specifySplit: 20, salesCAGR: 4 },
    { category: "industrial", specifySplit: 30, salesCAGR: 8 },
    { category: "residential", specifySplit: 30, salesCAGR: 9 },
  ],
  numOfvehicleCategory: 4,
  "vehicleCategoryData": [
    {
      "vehicleCategory": "car",
      "n": 1500,
      "f": 2,
      "c": 70,
      "p": 380,
      "e": 70,
      "r": 90,
      "k": 20,
      "l": 15,
      "g": 250,
      "h": 250,
      "s": 95,
      "u": 8,
      "CAGR_V": 5,
      "baseElectricityTariff": 6
    },
    {
      "vehicleCategory": "bus",
      "n": 800,
      "f": 1,
      "c": 400,
      "p": 390,
      "e": 80,
      "r": 120,
      "k": 25,
      "l": 17,
      "g": 360,
      "h": 360,
      "s": 95,
      "u": 8,
      "CAGR_V": 10,
      "baseElectricityTariff": 7
    },
    {
      "vehicleCategory": "2-wheeler",
      "n": 600,
      "f": 4,
      "c": 3,
      "p": 5,
      "e": 60,
      "r": 70,
      "k": 10,
      "l": 25,
      "g": 80,
      "h": 80,
      "s": 95,
      "u": 8,
      "CAGR_V": 9,
      "baseElectricityTariff": 8
    },
    {
      "vehicleCategory": "3-wheeler",
      "n": 500,
      "f": 3,
      "c": 9,
      "p": 150,
      "e": 85,
      "r": 80,
      "k": 15,
      "l": 27,
      "g": 120,
      "h": 120,
      "s": 95,
      "u": 8,
      "CAGR_V": 7,
      "baseElectricityTariff": 5
    }
  ],
  resolution: 30,
  BR_F: 80,
  sharedSavaing: 20,
  sum_pk_cost: 8,
  sum_zero_cost: 6,
  sum_op_cost: 4,
  win_pk_cost: 7,
  win_zero_cost: 5,
  win_op_cost: 3,
  summerDate: [moment("2024-03-01"), moment("2024-06-30")],
  winterDate: [moment("2024-12-01"), moment("2025-02-28")],
  s_pks: moment("10:00", "HH:mm"),
  s_pke: moment("10:00", "HH:mm"),
  s_sx: 20,
  s_ops: moment("02:00", "HH:mm"),
  s_ope: moment("10:00", "HH:mm"),
  s_rb: 15,
  w_pks: moment("09:00", "HH:mm"),
  w_pke: moment("04:00", "HH:mm"),
  w_sx: 15,
  w_ops: moment("10:00", "HH:mm"),
  w_ope: moment("09:00", "HH:mm"),
  w_rb: 10,
};

const initOptions = [
  { title: "Commercial", value: "commercial", isSelected: false },
  { title: "Agricultural", value: "agricultural", isSelected: false },
  { title: "Industrial", value: "industrial", isSelected: false },
  { title: "Residential", value: "residential", isSelected: false },
  { title: "Public", value: "public", isSelected: false },
  { title: "Others", value: "others", isSelected: false },
];

const initCategories = [
  { title: "Car", value: "car", isSelected: false },
  { title: "Bus", value: "bus", isSelected: false },
  { title: "2 Wheeler", value: "2-wheeler", isSelected: false },
  { title: "3 Wheeler", value: "3-wheeler", isSelected: false },
  { title: "Others", value: "others", isSelected: false },
];
const staepsInfo = [
  { title: "Consumer base electric load details" },
  { title: "Specify electric vehicle details" },
  { title: "Managed charging analysis" },
  { title: "Managed charging analysis" },
];

const content = (msg) => (
  <div>
    <p>{msg}</p>
  </div>
);
const vehicleCategoryQuestions = [
  { title: "Vehicle Category" },
  { title: "Number of vehicles" },
  { title: "Frequency of charging per day" },
  { title: "Battery capacity (kWh)" },
  { title: "Required charging power of vehicle (kW)" },
  { title: "Charging efficiency (%)" },
  { title: "Vehicle range (km)" },
  { title: <span>Average charging start time (Min) <Popover content={() => content("“For 8:00 AM (8 hours * 60 minutes), please enter 480. For 8 PM (20:00 hours * 60 minutes),please enter 1200. For 3:30 PM (15:30 hours * 60 minutes), please enter 930")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span> },
  { title: "Standard deviation of charging start time (Min)" },
  { title: "Average daily trip length (km)" },
  { title: "Standard deviation of average daily trip length (km)" },
  { title: "Average possible ending state of charge (%)" },
  { title: "Standard Deviation of Ending State of Charge (%)" },
  { title: <span>Electric vehicle sales CAGR (%) <Popover content={() => content("Rate at which the relevant category of electricity vehicles’ number is growing")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span> },
  { title: <span>Base electricity tariff (INR/ kWh) <Popover content={() => content("Electricity tariff paid by the relevant category of electric vehicle consumers to the local utility")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span> },
];

export const PredictionForm = () => {
  const { isanalysisLoading, isanalysisError } = useSelector((state) => state.analysis);
  const { profile } = useSelector((state) => state.profile);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState(initOptions);
  const [vehiCategoryOptions, setVehiCategoryOptions] = useState(initCategories);
  const [loadSplit, setLoadSplit] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  const stepperSize = 4; // Moved before useEffect

  const uploadProps = {
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls",
    maxCount: 1,
    action: `${config().API_BASE_URL}/api/file-upload/`,
    headers: { Authorization: `Token ${Helpers.getCookie("idToken")}` },
    showUploadList: { showDownloadIcon: false, showRemoveIcon: false },
    beforeUpload: (file) => {
      setTimeout(() => {
        notification.success({
          message: "File Uploaded Successfully",
          placement: "bottomRight",
        });
        form1.setFieldsValue({ isLoadSplitFile: mockFile });
      }, 500);
      return false;
    },
  };

  const resetCategoryOptions = () => {
    setCategoryOptions((prevValue) =>
      prevValue.map((value) => ({ ...value, isSelected: false }))
    );
  };

  const resetVehicleCategoryOptions = () => {
    setVehiCategoryOptions((prevValue) =>
      prevValue.map((value) => ({ ...value, isSelected: false }))
    );
  };

  const updateCategoryOptions = (category) => {
    setCategoryOptions((prevValue) =>
      prevValue.map((value) => ({
        ...value,
        isSelected: value.value === category ? true : value.isSelected,
      }))
    );
  };

  const updateVehicleCategoryOptions = (category) => {
    setVehiCategoryOptions((prevValue) =>
      prevValue.map((value) => ({
        ...value,
        isSelected: value.value === category ? true : value.isSelected,
      }))
    );
  };

  const handleFormSubmit = async () => {
    try {
      if (currentStep < stepperSize - 1) {
        if (currentStep === 0) {
          if (!error) {
            await form1.validateFields().then((value) => {
              if (!value.isLoadSplitFile?.file?.response?.file) {
                setError("Data File is not uploaded");
              } else {
                setFormData({ ...formData, form1: value });
                setCurrentStep(currentStep + 1);
              }
            });
          }
        } else if (currentStep === 1) {
          if (!error) {
            await form2.validateFields().then((value) => {
              setFormData({ ...formData, form2: value });
              setCurrentStep(currentStep + 1);
            }).catch((err) => {
              console.error("Form 2 validation failed:", err);
              setError("Form 2 validation failed. Check console for details.");
              throw err; // Stop automation if validation fails
            });
          }
        } else {
          await form3.validateFields().then((value) => {
            setFormData({ ...formData, form3: value });
            setCurrentStep(currentStep + 1);
          }).catch((err) => {
            console.error("Form 3 validation failed:", err);
            setError("Form 3 validation failed. Check console for details.");
            throw err;
          });
        }
      } else {
        if (!error) {
          await form4.validateFields().then(async (value) => {
            setFormData({ ...formData, form4: value });

            const convertCategoryData = (data) =>
              data.map((item) => ({
                ...item,
                specifySplit: parseFloat(item.specifySplit),
                salesCAGR: parseFloat(item.salesCAGR),
              }));

            const convertVehicleData = (data) =>
              data.map((vehicle) => {
                const converted = { vehicleCategory: vehicle.vehicleCategory };
                Object.keys(vehicle).forEach((key) => {
                  if (key !== "vehicleCategory") {
                    converted[key] = parseFloat(vehicle[key]);
                  }
                });
                return converted;
              });

            const loadCategoryInt = parseInt(formData.form1?.loadCategory || value.loadCategory, 10);
            const resolutionInt = parseInt(formData.form3?.resolution || value.resolution, 10);
            const sharedSavaingInt = parseInt(formData.form3?.sharedSavaing || value.sharedSavaing, 10);
            const sum_pk_cost = parseInt(formData.form3?.sum_pk_cost || value.sum_pk_cost, 10);
            const sum_zero_cost = parseInt(formData.form3?.sum_zero_cost || value.sum_zero_cost, 10);
            const sum_op_cost = parseInt(formData.form3?.sum_op_cost || value.sum_op_cost, 10);
            const win_pk_cost = parseInt(formData.form3?.win_pk_cost || value.win_pk_cost, 10);
            const win_zero_cost = parseInt(formData.form3?.win_zero_cost || value.win_zero_cost, 10);
            const win_op_cost = parseInt(formData.form3?.win_op_cost || value.win_op_cost, 10);

            const combinedData = {
              ...formData.form1,
              ...formData.form2,
              ...formData.form3,
              ...value,
              categoryData: convertCategoryData(formData.form1?.categoryData || []),
              vehicleCategoryData: convertVehicleData(formData.form2?.vehicleCategoryData || []),
              loadCategory: loadCategoryInt,
              resolution: resolutionInt,
              sharedSavaing: sharedSavaingInt,
              sum_pk_cost,
              sum_zero_cost,
              sum_op_cost,
              win_pk_cost,
              win_zero_cost,
              win_op_cost,
              date1_start: moment(value.summerDate?.[0]).format("MMM-DD"),
              date1_end: moment(value.summerDate?.[1]).format("MMM-DD"),
              date2_start: moment(value.winterDate?.[0]).format("MMM-DD"),
              date2_end: moment(value.winterDate?.[1]).format("MMM-DD"),
              s_pks: moment(value.s_pks).format("HH:mm"),
              s_pke: moment(value.s_pke).format("HH:mm"),
              w_pks: moment(value.w_pks).format("HH:mm"),
              w_pke: moment(value.w_pke).format("HH:mm"),
              s_ops: moment(value.s_ops).format("HH:mm"),
              s_ope: moment(value.s_ope).format("HH:mm"),
              w_ops: moment(value.w_ops).format("HH:mm"),
              w_ope: moment(value.w_ope).format("HH:mm"),
              isLoadSplitFile: formData.form1?.isLoadSplitFile?.file?.response?.file || null,
              fileId: formData.form1?.isLoadSplitFile?.file?.response?.id || null,
            };

            dispatch(
              getAnalysisResult(combinedData, () => {
                console.log("Dispatched getAnalysisResult");
                history.push("/analysis-result");
              }, (err) => {
                setError(err.message || "Analysis failed");
              })
            );
          }).catch((err) => {
            console.error("Form 4 validation failed:", err);
            setError("Form 4 validation failed. Check console for details.");
            throw err;
          });
        }
      }
    } catch (err) {
      console.error("handleFormSubmit error:", err);
    }
  };

  useEffect(() => {
    form1.setFieldsValue({
      loadCategory: prefilledData.loadCategory,
      isLoadSplit: prefilledData.isLoadSplit,
      isLoadSplitFile: prefilledData.isLoadSplitFile,
      categoryData: prefilledData.categoryData,
    });
    form2.setFieldsValue({
      numOfvehicleCategory: prefilledData.numOfvehicleCategory,
      vehicleCategoryData: prefilledData.vehicleCategoryData,
    });
    form3.setFieldsValue({
      resolution: prefilledData.resolution,
      BR_F: prefilledData.BR_F,
      sharedSavaing: prefilledData.sharedSavaing,
      sum_pk_cost: prefilledData.sum_pk_cost,
      sum_zero_cost: prefilledData.sum_zero_cost,
      sum_op_cost: prefilledData.sum_op_cost,
      win_pk_cost: prefilledData.win_pk_cost,
      win_zero_cost: prefilledData.win_zero_cost,
      win_op_cost: prefilledData.win_op_cost,
    });
    form4.setFieldsValue({
      summerDate: prefilledData.summerDate,
      winterDate: prefilledData.winterDate,
      s_pks: prefilledData.s_pks,
      s_pke: prefilledData.s_pke,
      s_sx: prefilledData.s_sx,
      s_ops: prefilledData.s_ops,
      s_ope: prefilledData.s_ope,
      s_rb: prefilledData.s_rb,
      w_pks: prefilledData.w_pks,
      w_pke: prefilledData.w_pke,
      w_sx: prefilledData.w_sx,
      w_ops: prefilledData.w_ops,
      w_ope: prefilledData.w_ope,
      w_rb: prefilledData.w_rb,
    });

    prefilledData.categoryData.forEach((item) => updateCategoryOptions(item.category));
    prefilledData.vehicleCategoryData.forEach((item) => updateVehicleCategoryOptions(item.vehicleCategory));
    setLoadSplit(prefilledData.isLoadSplit);

    const autoSubmit = async () => {
      for (let step = 0; step < stepperSize; step++) {
        console.log(`Submitting step ${step}`);
        await handleFormSubmit();
        console.log(`Completed step ${step}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased delay
      }
    };
    if (process.env.NODE_ENV === "test") {
      autoSubmit().catch((err) => {
        console.error("Auto-submit failed:", err);
        setError("Automation failed. Check console for details.");
      });
    }
  }, []);

  return (
    <>
      {isanalysisLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "black",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "#f7f7f7",
            fontWeight: "500",
            fontSize: "30px",
            textShadow: "0 0 0 0",
          }}
        >
          <img src={Loading} />
          <div className="row">
            <div className="col-md-12 text-center">
              <h3 className="animate-charcter">Please wait for the results</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-8 pt-5 pt-md-8 ev_analysis_page">
          <Layout className="card-stats mb-4 mb-xl-0 px-5 py-4" title="Ev-Analysis Form">
            <Steps current={currentStep} className="form-steps">
              {staepsInfo.map((data, i) => (
                <Step title={data.title} key={i + 1} />
              ))}
            </Steps>
            {/* Your Form JSX remains unchanged */}
            {currentStep === 0 && (
              <Form
                className="wri_form"
                autoComplete="off"
                layout="vertical"
                form={form1}
                onFinish={(value) => {
                  setFormData((prevValue) => ({ ...prevValue, form1: value }));
                  setCurrentStep((prevValue) => prevValue + 1);
                }}
                onValuesChange={(changeValues, allValues) => {
                  const data = Object.entries(changeValues);
                  if (data[0][0] === "categoryData" || data[0][0] === "isLoadSplit" || data[0][0] === "loadCategory") {
                    resetCategoryOptions();
                  }
                  if (
                    (data[0][0] === "loadCategory" || data[0][0] === "isLoadSplit") &&
                    +allValues.loadCategory < 7 &&
                    +allValues.loadCategory > 0 &&
                    allValues.isLoadSplit
                  ) {
                    form1.setFieldsValue({
                      categoryData: new Array(+allValues.loadCategory).fill({}),
                    });
                    if (data[0][0] === "isLoadSplit") {
                      setLoadSplit(data[0][1]);
                    }
                  }
                  if (data[0][0] === "categoryData") {
                    allValues.categoryData.forEach((item) => {
                      if (item.category) updateCategoryOptions(item.category);
                    });
                    let issplitDataChanged = false;
                    changeValues.categoryData.forEach((item) => {
                      if (item.specifySplit) {
                        issplitDataChanged = true;
                        return;
                      }
                    });
                    if (issplitDataChanged) {
                      setError(null);
                      let splitData = 0;
                      allValues.categoryData.forEach((item) => {
                        if (item.specifySplit && item.specifySplit <= 100 && item.specifySplit >= 0)
                          splitData = +splitData + +item.specifySplit;
                      });
                      if (splitData !== 100) {
                        setError("Sum of Load Split of all Category must be 100");
                      }
                    }
                  }
                }}
              >
                <Row gutter={[20]}>
                  <Col span={12}>
                    <Form.Item
                      label="How many categories of electricity consumers are present in the area of study?"
                      name="loadCategory"
                      rules={[{ required: true, message: "Load category is required" }, () => ({
                        validator(_, value) {
                          if (value && (value > 6 || value < 1)) {
                            return Promise.reject("Load category must be 1-6");
                          }
                          return Promise.resolve();
                        },
                      })]}
                    >
                      <Input type="number" min={1} disabled={isanalysisLoading} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Do you have separate electricity load data for each of these consumers?"
                      name="isLoadSplit"
                      rules={[{ required: true, message: "Load category is required" }]}
                    >
                      <Select disabled={isanalysisLoading}>
                        <Option value="yes" disabled>Yes</Option>
                        <Option value="no">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {loadSplit && loadSplit === "no" && (
                  <Row gutter={20} className="uploadfield_row" style={{ marginBottom: "2rem" }}>
                    <Col span={24}>
                      <span className="ant-download ant-download-select">
                        <a href={sempleExcelFile} download><FileDownloadIcon />Download sample file</a>
                      </span>
                      <Form.Item
                        className="upload_field"
                        label="Upload the electricity load data file"
                        name="isLoadSplitFile"
                        rules={[{ required: true, message: "Please, upload a file" }]}
                      >
                        <Upload {...uploadProps} disabled={isanalysisLoading}>
                          <FileUploadIcon />
                          <p className="upload_field_text">The file format could be Excel/CSV.</p>
                          <AntdButton className="form_btn">Upload File</AntdButton>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                <Form.List name="categoryData">
                  {(fields) => (
                    <>
                      {fields.map((field, index) => (
                        <Row gutter={20} className="split_row" key={field.key}>
                          <Col xs={24} md={8}>
                            <Form.Item
                              className="form-list-label"
                              label={index === 0 ? "Select category" : null}
                              name={[field.name, "category"]}
                              fieldKey={[field.fieldKey, "category"]}
                              rules={[{ required: true, message: "Category is Required" }]}
                            >
                              <Select placeholder="Select Category" disabled={isanalysisLoading}>
                                {categoryOptions.map((option) => (
                                  <Option key={option.value} value={option.value} disabled={option.isSelected}>
                                    {option.title}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            {loadSplit && loadSplit === "no" && (
                              <Form.Item
                                className="form-list-label"
                                label={index === 0 ? (
                                  <span>Specify electricity load share (%) <Popover content={() => content("Total values across all categories should equal 100")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span>
                                ) : null}
                                name={[field.name, "specifySplit"]}
                                fieldKey={[field.fieldKey, "specifySplit"]}
                                rules={[
                                  { required: true, message: "Split Percentage is Required" },
                                  Helpers.morethanZeroValidator("Split Percentage"),
                                ]}
                              >
                                <Input type="number" suffix="%" disabled={isanalysisLoading} />
                              </Form.Item>
                            )}
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item
                              className="form-list-label"
                              label={index === 0 ? (
                                <span>Electricity demand CAGR (%) <Popover content={() => content("Rate at which the electricity demand of the relevant category is growing")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span>
                              ) : null}
                              name={[field.name, "salesCAGR"]}
                              fieldKey={[field.fieldKey, "salesCAGR"]}
                              rules={[
                                { required: true, message: "Sales CAGR is Required" },
                                Helpers.morethanZeroValidator("Sales CAGR"),
                              ]}
                            >
                              <Input type="number" suffix="%" disabled={isanalysisLoading} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              </Form>
            )}
            {currentStep === 1 && (
              <>
                <Form
                  className="wri_form"
                  autoComplete="off"
                  form={form2}
                  layout="vertical"
                  initialValues={{
                    numOfvehicleCategory: 4,
                    vehicleCategoryData: [{}, {}, {}, {}],
                  }}
                  onFinish={(value) => {
                    setFormData((prevValue) => ({
                      ...prevValue,
                      form2: value,
                    }));
                    setCurrentStep((prevValue) => prevValue + 1);
                  }}
                  onValuesChange={(changeValues, allValues) => {
                    const data = Object.entries(changeValues);
                    if (
                      data[0][0] === "numOfvehicleCategory" ||
                      data[0][0] === "vehicleCategoryData"
                    ) {
                      resetVehicleCategoryOptions();
                    }
                    if (
                      data[0][0] === "numOfvehicleCategory" &&
                      +data[0][1] > 0 &&
                      +data[0][1] < 6
                    ) {
                      const categoryNum = +data[0][1];

                      form2.setFieldsValue({
                        vehicleCategoryData: new Array(categoryNum).fill({}),
                      });
                    } else if (data[0][0] === "vehicleCategoryData") {
                      allValues.vehicleCategoryData.forEach((item) => {
                        if (item.vehicleCategory) {
                          updateVehicleCategoryOptions(item.vehicleCategory);
                        }
                      });
                    }
                  }}
                >
                  {/* default 2 field */}
                  <Row gutter={[20]}>
                    <Col span={12} md={24} lg={12}>
                      <Form.Item
                        label="How many categories of electric vehicles are present 
                        in the area of study?"
                        name="numOfvehicleCategory"
                        rules={[
                          {
                            required: true,
                            message: "Vehicle Category is Required",
                          },
                          () => ({
                            validator(_, value) {
                              if (value && value !== 4) {
                                return Promise.reject(
                                  "Vehicle Category must be between 1-5"
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Input
                          placeholder="How many categories of electric vehicles are present 
                          in the area of study?"
                          type="number"
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[10]} className="split_row_2">
                    <Col md={12} lg={8} xl={6}>
                      <div className="Category_label_row">
                        <Row>
                          {vehicleCategoryQuestions.map((item, index) => {
                            return (
                              <Col span={24} key={index}>
                                <h4 className="lablerequired">{item.title}</h4>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    </Col>
                    <Col md={12} lg={16} xl={18}>
                      <div className="Category_main_row">
                        <Form.List name="vehicleCategoryData">
                          {(fields, { add, remove }) => {
                            return fields.map((field) => {
                              return (
                                // <Col md={{ span: 14 }} lg={{ span: 18 }}>
                                //   <div className="Category_main_row">
                                <Row>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "vehicleCategory"]}
                                      fieldKey={[
                                        field.fieldKey,
                                        "vehicleCategory",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vehicle Category is Required",
                                        },
                                      ]}
                                    >
                                      <Select
                                        placeholder="Vehicle Category"
                                        disabled={isanalysisLoading}
                                      >
                                        {vehiCategoryOptions.map((option) => (
                                          <Option
                                            value={option.value}
                                            disabled={option.isSelected}
                                          >
                                            {option.title}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "n"]}
                                      fieldKey={[field.fieldKey, "n"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Number of vehicles Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "f"]}
                                      fieldKey={[field.fieldKey, "f"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Frequency of charging per day Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "c"]}
                                      fieldKey={[field.fieldKey, "c"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Battery capacity(kWh) Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>

                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "p"]}
                                      fieldKey={[field.fieldKey, "p"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Required charging power of vehicle(kW)",
                                        },
                                        Helpers.morethanZeroValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "e"]}
                                      fieldKey={[field.fieldKey, "e"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Charging efficiency(%) Field is Required",
                                        },
                                        Helpers.percentageValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "r"]}
                                      fieldKey={[field.fieldKey, "r"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "vehicles Range Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "k"]}
                                      fieldKey={[field.fieldKey, "k"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Average Charging Start time Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "l"]}
                                      fieldKey={[field.fieldKey, "l"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Standard deviation Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "g"]}
                                      fieldKey={[field.fieldKey, "g"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Average daily trip length Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "h"]}
                                      fieldKey={[field.fieldKey, "h"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Standard deviation Field is Required",
                                        },
                                        Helpers.positiveValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "s"]}
                                      fieldKey={[field.fieldKey, "s"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Average possible ending state of Charge Field is Required",
                                        },
                                        Helpers.percentageValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "u"]}
                                      fieldKey={[field.fieldKey, "u"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Standard deviation Field is Required",
                                        },
                                        Helpers.percentageValidator(),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[field.name, "CAGR_V"]}
                                      fieldKey={[field.fieldKey, "CAGR_V"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "CAGR of sales Field is Required",
                                        },
                                        Helpers.percentageValidator(
                                          "Sales CAGR"
                                        ),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      name={[
                                        field.name,
                                        "baseElectricityTariff",
                                      ]}
                                      fieldKey={[
                                        field.fieldKey,
                                        "baseElectricityTariff",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Base Electricity Tariff is Required",
                                        },
                                        Helpers.positiveValidator(
                                          "Base Electricity Tariff"
                                        ),
                                      ]}
                                    >
                                      <Input
                                        type="number"
                                        min={1}
                                        disabled={isanalysisLoading}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                //   </div>
                                // </Col>
                              );
                            });
                          }}
                        </Form.List>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </>
            )}
            {currentStep === 2 && (
              <>
                <Form
                  className="wri_form"
                  autoComplete="off"
                  form={form3}
                  layout="vertical"
                >
                  {/* default 3 field */}
                  <Row gutter={[20]}>
                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="What time resolution do you want the analysis for?"
                        name="resolution"
                        rules={[
                          {
                            required: true,
                            message: "Resolution Time is Required",
                          },
                          Helpers.positiveValidator("Resolution Time"),
                        ]}
                      >
                        <Input placeholder="Enter time resolution in minutes" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} lg={12}>
                      <Form.Item
                        label="What % of the load should the distribution transformer/ system raise alarm at?"
                        name="BR_F"
                        rules={[
                          {
                            required: true,
                            message: "Distribution Transformer is Required",
                          },
                          Helpers.percentageValidator(
                            "Distribution Transformer"
                          ),
                        ]}
                      >
                        <Input placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <div
                        style={{
                          marginBottom: "1rem",
                          fontWeight: "700",
                        }}
                      >
                        Calculate Time of Day (ToD) incentive/ surcharge under managed charging scenario
                      </div>
                    </Col>
                    <Row>
                      <Col span={24}>
                        <div className="disclaimer-text">
                          "For this purpose,
                          we assume that electric vehicle loads alone are flexible/ responsive; and that such flexibility is
                          restricted to the volume of distribution transformer breaching/ overshots in the baseline
                          scenario"
                        </div>
                      </Col>
                    </Row>
                    <Col md={24} lg={16} xl={12}>
                      <Form.Item
                        label="Specify the % savings that the electric utility will pass on to the 
                        consumers as part of the Time of the Day (ToD) tariff structure"
                        name="sharedSavaing"
                        rules={[
                          {
                            required: true,
                            message: "ToD Field is Required",
                          },
                          Helpers.percentageValidator("ToD"),
                        ]}
                      >
                        <Input
                          type="number"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <div
                        style={{
                          marginBottom: "1rem",
                          fontWeight: "700",
                        }}
                      >
                        Utility's cost (INR/kWh) of procurement
                      </div>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            name="sum_pk_cost"
                            label="Summer peak cost"
                            rules={[
                              {
                                required: true,
                                message: "Summer peak cost Field is Required",
                              },
                              Helpers.positiveValidator(),
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              disabled={isanalysisLoading}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="sum_zero_cost"
                            label="Summer normal cost"
                            rules={[
                              {
                                required: true,
                                message: "Summer normal cost Field is Required",
                              },
                              Helpers.positiveValidator(),
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              disabled={isanalysisLoading}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="sum_op_cost"
                            label="Summer offpeak cost"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Summer offpeak cost Field is Required",
                              },
                              Helpers.positiveValidator(),
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              disabled={isanalysisLoading}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            name="win_pk_cost"
                            label="Winter peak cost"
                            rules={[
                              {
                                required: true,
                                message: "Winter peak cost Field is Required",
                              },
                              Helpers.positiveValidator(),
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              disabled={isanalysisLoading}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="win_zero_cost"
                            label="Winter normal cost"
                            rules={[
                              {
                                required: true,
                                message: "Winter normal cost Field is Required",
                              },
                              Helpers.positiveValidator(),
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              disabled={isanalysisLoading}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="win_op_cost"
                            label="Winter offpeak cost"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Winter offpeak cost Field is Required",
                              },
                              Helpers.positiveValidator(),
                            ]}
                          >
                            <Input
                              type="number"
                              min={1}
                              disabled={isanalysisLoading}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </>
            )}
            {currentStep === 3 && (
              <>
                <Form
                  className="wri_form"
                  autoComplete="off"
                  form={form4}
                  layout="vertical"
                >
                  <Row gutter={[20]}>
                    <Col span={6} xs={24} md={12} xl={8} xxl={6}>
                      <Form.Item
                        label={<span>Summer Season <Popover content={() => content("Specify the start/ end of the seasonal load variation in MMM-DD format”")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span>}
                        name="summerDate"
                        rules={[
                          {
                            required: true,
                            message: "Summer Season Date Field is Required",
                          },
                        ]}
                      >
                        <DatePicker.RangePicker
                          format="MMM-DD"
                          disabledDate={d => !d || d.isAfter(`Jan-${+moment().format("YYYY") + 1}`) || d.isSameOrBefore(`Jan-${+moment().format("YYYY") - 1}`)}
                          onChange={(value) => {
                            console.log(moment(value[0]).format("MMM-DD"));
                            console.log(moment(value[1]).format("MMM-DD"));
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6} xs={24} md={12} xl={8} xxl={6}>
                      <Form.Item
                        label={<span>Winter season <Popover content={() => content("“Specify the start/ end of the seasonal load variation in MMM-DD format")} trigger="hover"><span className="infoBubble"><img src={Info_icon} /></span></Popover></span>}
                        name="winterDate"
                        rules={[
                          {
                            required: true,
                            message: "Winter Season Date Field is Required",
                          },
                        ]}
                      >
                        <DatePicker.RangePicker
                          format="MMM-DD"
                          disabledDate={d => !d || d.isAfter(`Jan-${+moment().format("YYYY") + 1}`) || d.isSameOrBefore(`Jan-${+moment().format("YYYY") - 1}`)}
                          onChange={(value) => {
                            console.log(moment(value[0]).format("MMM-DD"));
                            console.log(moment(value[1]).format("MMM-DD"));
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Row gutter={[20]} style={{ width: "100%" }}>
                      <Col span={12} xs={24} xl={12}>
                        <h3 className="">Specify the Time of the Day (ToD) slots of the utility for loads other than
                          electric vehicles at present</h3>
                      </Col>

                      <Row gutter={[20]} className="third_form_row">
                        <Col span={6} xs={24} md={12} xl={8} xxl={6}>
                          <b>Summer season</b>
                          <Form.Item
                            label="Peak time start"
                            name="s_pks"
                            rules={[
                              {
                                required: true,
                                message: "Peak time start Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Peak time end"
                            name="s_pke"
                            rules={[
                              {
                                required: true,
                                message: "Peak time end Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Peak surcharge"
                            name="s_sx"
                            rules={[
                              {
                                required: true,
                                message: "Peak surcharge Field is Required",
                              },
                              Helpers.percentageValidator("sx"),
                            ]}
                          >
                            <Input type="number" />
                          </Form.Item>

                          <Form.Item
                            label="Off-peak time start"
                            name="s_ops"
                            rules={[
                              {
                                required: true,
                                message: "Off-peak time start Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Off-peak time end"
                            name="s_ope"
                            rules={[
                              {
                                required: true,
                                message: "Off-peak time end Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Off-peak rebate"
                            name="s_rb"
                            rules={[
                              {
                                required: true,
                                message: "Off-peak rebate Field is Required",
                              },
                              Helpers.percentageValidator("rb"),
                            ]}
                          >
                            <Input type="number" />
                          </Form.Item>
                        </Col>

                        <Col span={6} xs={24} md={12} xl={8} xxl={6}>
                          <b>Winter season</b>
                          <Form.Item
                            label="Peak time start"
                            name="w_pks"
                            rules={[
                              {
                                required: true,
                                message: "Peak time start Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Peak time end"
                            name="w_pke"
                            rules={[
                              {
                                required: true,
                                message: "Peak time end Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Peak surcharge"
                            name="w_sx"
                            rules={[
                              {
                                required: true,
                                message: "Peak surcharge   Field is Required",
                              },
                              Helpers.percentageValidator("sx"),
                            ]}
                          >
                            <Input type="number" />
                          </Form.Item>

                          <Form.Item
                            label="Off-peak time start"
                            name="w_ops"
                            rules={[
                              {
                                required: true,
                                message: "Off-peak time start Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Off-peak time end"
                            name="w_ope"
                            rules={[
                              {
                                required: true,
                                message: "Off-peak time end Field is Required",
                              },
                            ]}
                          >
                            <TimePicker format="HH:mm" />
                          </Form.Item>

                          <Form.Item
                            label="Off-peak rebate"
                            name="w_rb"
                            rules={[
                              {
                                required: true,
                                message: "Off-peak rebate Field is Required",
                              },
                              Helpers.percentageValidator("rb"),
                            ]}
                          >
                            <Input type="number" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Row>
                  </Row>
                </Form>
              </>
            )}
            <div>
              {currentStep !== 0 && (
                <AntdButton className="form_btn" color="info" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </AntdButton>
              )}
              <AntdButton className="form_btn" htmlType="Submit" onClick={handleFormSubmit}>
                {currentStep < stepperSize - 1 ? "Next" : "Submit"}
              </AntdButton>
            </div>
            {(error || isanalysisError) && (
              <div className="alert alert-danger mt-3" role="alert">
                {error || isanalysisError}
              </div>
            )}
          </Layout>
        </div>
      )}
    </>
  );
};