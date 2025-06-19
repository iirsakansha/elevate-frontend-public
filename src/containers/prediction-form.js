import { useEffect, useState, useMemo } from "react";
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
  Popover,
} from "antd";
import { DatePicker } from "antd";
import "./style.css";
import { ReactComponent as FileUploadIcon } from "../assets/icons/file-upload.svg";
import { ReactComponent as FileDownloadIcon } from "../assets/icons/file-download.svg";
import { Helpers } from "../helpers";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiService } from "../api";
import { config } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { getAnalysisResult } from "../redux/analysis/analysisAction";
import Loading from "../assets/icons/loading.gif";
import Info_icon from "../assets/icons/info_icon.png";
import sempleExcelFile from "../assets/sempleFile/DT_Data_Upload.xls";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import "../../src/assets/css/StaticTimePicker.css";
import dayjs from 'dayjs';

const { Option } = Select;
const { Step } = Steps;

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
  { title: "Time of Day (ToD) settings" }, // Updated for clarity
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
  {
    title: (
      <span>
        Average charging start time (Min){" "}
        <Popover
          content={() =>
            content(
              "For 8:00 AM (8 hours * 60 minutes), please enter 480. For 8 PM (20:00 hours * 60 minutes), please enter 1200. For 3:30 PM (15:30 hours * 60 minutes), please enter 930"
            )
          }
          trigger="hover"
        >
          <span className="infoBubble">
            <img src={Info_icon} />
          </span>
        </Popover>
      </span>
    ),
  },
  { title: "Standard deviation of charging start time (Min)" },
  { title: "Average daily trip length (km)" },
  { title: "Standard deviation of average daily trip length (km)" },
  { title: "Average possible ending state of charge (%)" },
  { title: "Standard Deviation of Ending State of Charge (%)" },
  {
    title: (
      <span>
        Electric vehicle sales CAGR (%){" "}
        <Popover
          content={() =>
            content(
              "Rate at which the relevant category of electricity vehicles’ number is growing"
            )
          }
          trigger="hover"
        >
          <span className="infoBubble">
            <img src={Info_icon} />
          </span>
        </Popover>
      </span>
    ),
  },
  {
    title: (
      <span>
        Base electricity tariff (INR/ kWh){" "}
        <Popover
          content={() =>
            content(
              "Electricity tariff paid by the relevant category of electric vehicle consumers to the local utility"
            )
          }
          trigger="hover"
        >
          <span className="infoBubble">
            <img src={Info_icon} />
          </span>
        </Popover>
      </span>
    ),
  },
];

// Deserialize formData using dayjs
const deserializeFormData = (formData) => {
  return {
    form1: { ...formData.form1 },
    form2: { ...formData.form2 },
    form3: { ...formData.form3 },
    form4: {
      ...formData.form4,
      summerDate: Array.isArray(formData.form4.summerDate)
        ? formData.form4.summerDate.map((date) => dayjs(date))
        : [dayjs(formData.form4.summerDate), dayjs(formData.form4.summerDate)],
      winterDate: Array.isArray(formData.form4.winterDate)
        ? formData.form4.winterDate.map((date) => dayjs(date))
        : [dayjs(formData.form4.winterDate), dayjs(formData.form4.winterDate)],
      s_pks: formData.form4.s_pks ? dayjs(formData.form4.s_pks, 'HH:mm') : null,
      s_pke: formData.form4.s_pke ? dayjs(formData.form4.s_pke, 'HH:mm') : null,
      s_ops: formData.form4.s_ops ? dayjs(formData.form4.s_ops, 'HH:mm') : null,
      s_ope: formData.form4.s_ope ? dayjs(formData.form4.s_ope, 'HH:mm') : null,
      w_pks: formData.form4.w_pks ? dayjs(formData.form4.w_pks, 'HH:mm') : null,
      w_pke: formData.form4.w_pke ? dayjs(formData.form4.w_pke, 'HH:mm') : null,
      w_ops: formData.form4.w_ops ? dayjs(formData.form4.w_ops, 'HH:mm') : null,
      w_ope: formData.form4.w_ope ? dayjs(formData.form4.w_ope, 'HH:mm') : null,
    },
  };
};

export const PredictionForm = () => {
  const { isanalysisLoading, isanalysisError, analysisResult } = useSelector(
    (state) => state.analysis
  );
  const { profile, isProfileLoading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Memoize templateData to stabilize useEffect
  const templateData = useMemo(() => {
    let data = location.state?.templateData;
    if (!data) {
      const storedData = localStorage.getItem('templateData');
      if (storedData) {
        data = JSON.parse(storedData);
        localStorage.removeItem('templateData');
      }
    }
    return data;
  }, [location.state?.templateData]);

  // Prefill forms with template data if available
  useEffect(() => {
    console.log('PredictionForm useEffect triggered with templateData:', templateData);
    if (templateData) {
      const deserializedData = deserializeFormData(templateData);
      form1.setFieldsValue({
        ...deserializedData.form1,
        categoryData: deserializedData.form1.categoryData,
      });
      setLoadSplit(deserializedData.form1.isLoadSplit);
      form2.setFieldsValue({
        ...deserializedData.form2,
        vehicleCategoryData: deserializedData.form2.vehicleCategoryData,
      });
      form3.setFieldsValue({
        resolution: deserializedData.form3.resolution,
        BR_F: deserializedData.form3.BR_F,
        sharedSavaing: deserializedData.form3.sharedSavaing,
        sum_pk_cost: deserializedData.form3.sum_pk_cost,
        sum_zero_cost: deserializedData.form3.sum_zero_cost,
        sum_op_cost: deserializedData.form3.sum_op_cost,
        win_pk_cost: deserializedData.form3.win_pk_cost,
        win_zero_cost: deserializedData.form3.win_zero_cost,
        win_op_cost: deserializedData.form3.win_op_cost,
      });
      form4.setFieldsValue({
        ...deserializedData.form4,
        summerDate: deserializedData.form4.summerDate,
        winterDate: deserializedData.form4.winterDate,
        s_pks: deserializedData.form4.s_pks,
        s_pke: deserializedData.form4.s_pke,
        s_ops: deserializedData.form4.s_ops,
        s_ope: deserializedData.form4.s_ope,
        w_pks: deserializedData.form4.w_pks,
        w_pke: deserializedData.form4.w_pke,
        w_ops: deserializedData.form4.w_ops,
        w_ope: deserializedData.form4.w_ope,
      });
      deserializedData.form1.categoryData.forEach((item) => {
        if (item.category) {
          updateCategoryOptions(item.category);
        }
      });
      deserializedData.form2.vehicleCategoryData.forEach((item) => {
        if (item.vehicleCategory) {
          updateVehicleCategoryOptions(item.vehicleCategory);
        }
      });
      setFormData(deserializedData);
      if (deserializedData.form1.isLoadSplit === 'no') {
        notification.info({
          message: 'File Upload Required',
          description: 'Please upload the electricity load data file to proceed with the analysis.',
          placement: 'bottomRight',
        });
      }
    }
  }, [templateData, form1, form2, form3, form4]);

  const uploadProps = {
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls",
    maxCount: 1,
    action: `${config().API_BASE_URL}/api/file-upload/`,
    headers: { Authorization: `Token ${Helpers.getCookie("idToken")}` },
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: false,
    },
    onChange: (info) => {
      if (info.file.status === "done") {
        notification.success({
          message: "File Uploaded Successfully",
          placement: "bottomRight",
        });
      } else if (info.file.status === "error") {
        notification.error({
          message: "Error while uploading File, Please Upload again",
          placement: "bottomRight",
        });
      }
    },
  };

  const stepperSize = 4;

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
        isSelected: value.value === category,
      }))
    );
  };

  const updateVehicleCategoryOptions = (category) => {
    setVehiCategoryOptions((prevValue) =>
      prevValue.map((value) => ({
        ...value,
        isSelected: value.value === category,
      }))
    );
  };

  const handleFormSubmit = () => {
    setError(null);

    if (currentStep < stepperSize - 1) {
      if (currentStep === 0) {
        form1.validateFields().then((value) => {
          if (!value.isLoadSplitFile?.file?.response?.file) {
            setError("Data File is not uploaded");
          } else {
            setFormData({ ...formData, form1: value });
            setCurrentStep(currentStep + 1);
          }
        }).catch(() => {
          setError('Please fill in all required fields correctly.');
        });
      } else if (currentStep === 1) {
        form2.validateFields().then((value) => {
          setFormData({ ...formData, form2: value });
          setCurrentStep(currentStep + 1);
        }).catch(() => {
          setError('Please fill in all required fields correctly.');
        });
      } else if (currentStep === 2) {
        form3.validateFields().then((value) => {
          console.log("Form3 values:", value);
          setFormData({ ...formData, form3: value });
          setCurrentStep(currentStep + 1);
        }).catch(() => {
          setError('Please fill in all required fields correctly.');
        });
      }
    } else {
      form4.validateFields().then(async (value) => {
        setFormData({ ...formData, form4: value });

        const convertCategoryData = (data) =>
          (data || []).map((item) => ({
            ...item,
            specifySplit: parseFloat(item.specifySplit || 0),
            salesCAGR: parseFloat(item.salesCAGR || 0),
          }));

        const convertVehicleData = (data) =>
          (data || []).map((vehicle) => {
            const converted = { vehicleCategory: vehicle.vehicleCategory };
            Object.keys(vehicle).forEach((key) => {
              if (key !== "vehicleCategory") {
                converted[key] = parseFloat(vehicle[key] || 0);
              }
            });
            return converted;
          });

        const safeParseInt = (value, fallback) => {
          const parsed = parseInt(value, 10);
          return isNaN(parsed) ? fallback : parsed;
        };

        const safeFormat = (date, format) => {
          if (!date) return '';
          return dayjs.isDayjs(date) ? date.format(format) : '';
        };

        const loadCategoryInt = safeParseInt(
          formData.form1?.loadCategory || value.loadCategory,
          0
        );
        const resolutionInt = safeParseInt(
          formData.form3?.resolution || value.resolution,
          15
        );
        const sharedSavaingInt = safeParseInt(
          formData.form3?.sharedSavaing || value.sharedSavaing,
          50
        );
        const sum_pk_cost = safeParseInt(
          formData.form3?.sum_pk_cost || value.sum_pk_cost,
          10
        );
        const sum_zero_cost = safeParseInt(
          formData.form3?.sum_zero_cost || value.sum_zero_cost,
          7
        );
        const sum_op_cost = safeParseInt(
          formData.form3?.sum_op_cost || value.sum_op_cost,
          5
        );
        const win_pk_cost = safeParseInt(
          formData.form3?.win_pk_cost || value.win_pk_cost,
          8
        );
        const win_zero_cost = safeParseInt(
          formData.form3?.win_zero_cost || value.win_zero_cost,
          6
        );
        const win_op_cost = safeParseInt(
          formData.form3?.win_op_cost || value.win_op_cost,
          4
        );

        const combinedData = {
          ...(formData.form1 || {}),
          ...(formData.form2 || {}),
          ...(formData.form3 || {}),
          ...value,
          categoryData: convertCategoryData(formData.form1?.categoryData),
          vehicleCategoryData: convertVehicleData(formData.form2?.vehicleCategoryData),
          loadCategory: loadCategoryInt,
          resolution: resolutionInt,
          sharedSavaing: sharedSavaingInt,
          sum_pk_cost,
          sum_zero_cost,
          sum_op_cost,
          win_pk_cost,
          win_zero_cost,
          win_op_cost,
          date1_start: safeFormat(value.summerDate?.[0], "MMM-DD"),
          date1_end: safeFormat(value.summerDate?.[1], "MMM-DD"),
          date2_start: safeFormat(value.winterDate?.[0], "MMM-DD"),
          date2_end: safeFormat(value.winterDate?.[1], "MMM-DD"),
          s_pks: safeFormat(value.s_pks, "HH:mm"),
          s_pke: safeFormat(value.s_pke, "HH:mm"),
          w_pks: safeFormat(value.w_pks, "HH:mm"),
          w_pke: safeFormat(value.w_pke, "HH:mm"),
          s_ops: safeFormat(value.s_ops, "HH:mm"),
          s_ope: safeFormat(value.s_ope, "HH:mm"),
          w_ops: safeFormat(value.w_ops, "HH:mm"),
          w_ope: safeFormat(value.w_ope, "HH:mm"),
          isLoadSplitFile: formData.form1?.isLoadSplitFile?.file?.response?.file || null,
          fileId: formData.form1?.isLoadSplitFile?.file?.response?.id || null,
        };

        try {
          console.log('Submitting analysis with data:', combinedData);
          await dispatch(getAnalysisResult(combinedData, () => {
            console.log('Navigating to /analysis-result');
            navigate("/analysis-result");
          }));
        } catch (err) {
          console.error('Analysis submission error:', err);
          setError('Failed to submit analysis. Please try again.');
        }
      }).catch(() => {
        setError('Please fill in all required fields correctly.');
      });
    }
  };

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
          <Layout
            className="card-stats mb-4 mb-xl-0 px-5 py-4"
            title="Ev-Analysis Form"
          >
            <Steps current={currentStep} className="form-steps">
              {staepsInfo.map((data, i) => (
                <Step title={data.title} key={i + 1}></Step>
              ))}
            </Steps>

            {currentStep === 0 && (
              <Form
                className="wri_form"
                autoComplete="off"
                layout="vertical"
                form={form1}
                onFinish={(value) => {
                  setFormData((prevValue) => ({
                    ...prevValue,
                    form1: value,
                  }));
                  setCurrentStep((prevValue) => prevValue + 1);
                }}
                onValuesChange={(changeValues, allValues) => {
                  const data = Object.entries(changeValues);

                  if (
                    data[0][0] === "categoryData" ||
                    data[0][0] === "isLoadSplit" ||
                    data[0][0] === "loadCategory"
                  ) {
                    resetCategoryOptions();
                  }

                  if (
                    (data[0][0] === "loadCategory" ||
                      data[0][0] === "isLoadSplit") &&
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
                      if (item.category) {
                        updateCategoryOptions(item.category);
                      }
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
                        if (
                          item.specifySplit &&
                          item.specifySplit <= 100 &&
                          item.specifySplit >= 0
                        )
                          splitData = +splitData + +item.specifySplit;
                      });
                      if (splitData !== 100) {
                        setError(
                          "Sum of Load Split of all Category must be 100"
                        );
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
                      rules={[
                        {
                          required: true,
                          message: "Load category is required",
                        },
                        () => ({
                          validator(_, value) {
                            if (value && (value > 6 || value < 1)) {
                              return Promise.reject(
                                "Load category must be 1-6"
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input type="number" min={1} disabled={isanalysisLoading} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Do you have separate electricity load data for each of these consumers?"
                      name="isLoadSplit"
                      rules={[
                        {
                          required: true,
                          message: "Load category is required",
                        },
                      ]}
                    >
                      <Select disabled={isanalysisLoading}>
                        <Option value="yes" disabled>
                          Yes
                        </Option>
                        <Option value="no">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {loadSplit && loadSplit === "no" && (
                  <Row
                    gutter={20}
                    className="uploadfield_row"
                    style={{ marginBottom: "2rem" }}
                  >
                    <Col span={24}>
                      <span className="ant-download ant-download-select">
                        <a href={sempleExcelFile} download>
                          <FileDownloadIcon />Download sample file
                        </a>
                      </span>
                      <Form.Item
                        className="upload_field"
                        label="Upload the electricity load data file"
                        name="isLoadSplitFile"
                        rules={[
                          {
                            required: true,
                            message: "Please, upload a file",
                          },
                        ]}
                      >
                        <Upload {...uploadProps} disabled={isanalysisLoading}>
                          <FileUploadIcon />
                          <p className="upload_field_text">
                            The file format could be Excel/CSV.
                          </p>
                          <AntdButton className="form_btn">Upload File</AntdButton>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Form.List name="categoryData">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row gutter={20} className="split_row" key={field.key}>
                          <Col xs={{ span: 24 }} md={{ span: 8 }}>
                            <Form.Item
                              className="form-list-label"
                              label={index === 0 ? "Select category" : null}
                              name={[field.name, "category"]}
                              fieldKey={[field.fieldKey, "category"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Category is Required",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Select Category"
                                disabled={isanalysisLoading}
                              >
                                {categoryOptions.map((option) => (
                                  <Option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.isSelected}
                                  >
                                    {option.title}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={{ span: 24 }} md={{ span: 8 }}>
                            {loadSplit && loadSplit === "yes" && (
                              <Form.Item
                                className="upload_field small form-list-label"
                                label={
                                  index === 0
                                    ? "Upload the electricity load data file"
                                    : null
                                }
                                name={[field.name, "categoryFile"]}
                                fieldKey={[field.fieldKey, "categoryFile"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Data File is Required for Each Category",
                                  },
                                ]}
                              >
                                <Upload {...uploadProps} disabled={isanalysisLoading}>
                                  <AntdButton className="form_btn">Upload file</AntdButton>
                                </Upload>
                              </Form.Item>
                            )}
                            {loadSplit && loadSplit === "no" && (
                              <Form.Item
                                className="form-list-label"
                                label={
                                  index === 0 ? (
                                    <span>
                                      Specify electricity load share (%){" "}
                                      <Popover
                                        content={() =>
                                          content(
                                            "Total values across all categories should equal 100"
                                          )
                                        }
                                        trigger="hover"
                                      >
                                        <span className="infoBubble">
                                          <img src={Info_icon} />
                                        </span>
                                      </Popover>
                                    </span>
                                  ) : null
                                }
                                name={[field.name, "specifySplit"]}
                                fieldKey={[field.fieldKey, "specifySplit"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Split Percentage is Required",
                                  },
                                  Helpers.moreThanZeroValidator("Split Percentage"),
                                ]}
                              >
                                <Input
                                  type="number"
                                  suffix="%"
                                  disabled={isanalysisLoading}
                                />
                              </Form.Item>
                            )}
                          </Col>
                          <Col xs={{ span: 24 }} md={{ span: 8 }}>
                            <Form.Item
                              className="form-list-label"
                              label={
                                index === 0 ? (
                                  <span>
                                    Electricity demand CAGR (%){" "}
                                    <Popover
                                      content={() =>
                                        content(
                                          "Rate at which the electricity demand of the relevant category is growing"
                                        )
                                      }
                                      trigger="hover"
                                    >
                                      <span className="infoBubble">
                                        <img src={Info_icon} />
                                      </span>
                                    </Popover>
                                  </span>
                                ) : null
                              }
                              name={[field.name, "salesCAGR"]}
                              fieldKey={[field.fieldKey, "salesCAGR"]}
                              rules={[
                                { required: true, message: "Split Percentage is Required" },
                                Helpers.moreThanZeroValidator("Split Percentage"),
                              ]}
                            >
                              <Input
                                type="number"
                                suffix="%"
                                disabled={isanalysisLoading}
                              />
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
                <Row gutter={[20]}>
                  <Col span={12} md={24} lg={12}>
                    <Form.Item
                      label="How many categories of electric vehicles are present in the area of study?"
                      name="numOfvehicleCategory"
                      rules={[
                        {
                          required: true,
                          message: "Vehicle Category is Required",
                        },
                        () => ({
                          validator(_, value) {
                            const numValue = Number(value); // Convert to number
                            if (value && (numValue < 1 || numValue > 5 || !Number.isInteger(numValue))) {
                              return Promise.reject(
                                "Vehicle Category must be an integer between 1-5"
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder="How many categories of electric vehicles are present in the area of study?"
                        type="number"
                        min={1}
                        max={5}
                        step={1}
                        disabled={isanalysisLoading} // Allow editing unless analysis is loading
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[10]} className="split_row_2">
                  <Col md={12} lg={8} xl={6}>
                    <div className="Category_label_row">
                      <Row>
                        {vehicleCategoryQuestions.map((item, index) => (
                          <Col span={24} key={index}>
                            <h4 className="lablerequired">{item.title}</h4>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Col>
                  <Col md={12} lg={16} xl={18}>
                    <div className="Category_main_row">
                      <Form.List name="vehicleCategoryData">
                        {(fields, { add, remove }) =>
                          fields.map((field) => (
                            <Row key={field.key}>
                              <Col span={24}>
                                <Form.Item
                                  name={[field.name, "vehicleCategory"]}
                                  fieldKey={[field.fieldKey, "vehicleCategory"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vehicle Category is Required",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Vehicle Category"
                                    disabled={isanalysisLoading}
                                  >
                                    {vehiCategoryOptions.map((option) => (
                                      <Option
                                        key={option.value} // Add key prop here
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
                                      message: "Number of vehicles Field is Required",
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
                                      message: "Frequency of charging per day Field is Required",
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
                                      message: "Battery capacity(kWh) Field is Required",
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
                                      message: "Required charging power of vehicle(kW)",
                                    },
                                    Helpers.moreThanZeroValidator(),
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
                                      message: "Charging efficiency(%) Field is Required",
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
                                      message: "vehicles Range Field is Required",
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
                                      message: "Average Charging Start time Field is Required",
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
                                      message: "Standard deviation Field is Required",
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
                                      message: "Average daily trip length Field is Required",
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
                                      message: "Standard deviation Field is Required",
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
                                      message: "Average possible ending state of Charge Field is Required",
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
                                      message: "Standard deviation Field is Required",
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
                                    { required: true, message: "Sales CAGR is Required" },
                                    Helpers.moreThanZeroValidator("Sales CAGR"),
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
                                  name={[field.name, "baseElectricityTariff"]}
                                  fieldKey={[field.fieldKey, "baseElectricityTariff"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Base Electricity Tariff is Required",
                                    },
                                    Helpers.positiveValidator("Base Electricity Tariff"),
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
                          ))
                        }
                      </Form.List>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
            {currentStep === 2 && (
              <Form
                className="wri_form"
                autoComplete="off"
                form={form3}
                layout="vertical"
              >
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
                        Helpers.percentageValidator("Distribution Transformer"),
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <div style={{ marginBottom: "1rem", fontWeight: "700" }}>
                      Calculate Time of Day (ToD) incentive/ surcharge under managed charging scenario
                    </div>
                  </Col>
                  <Row>
                    <Col span={24}>
                      <div className="disclaimer-text">
                        "For this purpose, we assume that electric vehicle loads alone are flexible/ responsive; and that such flexibility is restricted to the volume of distribution transformer breaching/ overshots in the baseline scenario"
                      </div>
                    </Col>
                  </Row>
                  <Col md={24} lg={16} xl={12}>
                    <Form.Item
                      label="Specify the % savings that the electric utility will pass on to the consumers as part of the Time of the Day (ToD) tariff structure"
                      name="sharedSavaing"
                      rules={[
                        {
                          required: true,
                          message: "ToD Field is Required",
                        },
                        Helpers.percentageValidator("ToD"),
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <div style={{ marginBottom: "1rem", fontWeight: "700" }}>
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
                          <Input type="number" min={1} disabled={isanalysisLoading} />
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
                          <Input type="number" min={1} disabled={isanalysisLoading} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="sum_op_cost"
                          label="Summer offpeak cost"
                          rules={[
                            {
                              required: true,
                              message: "Summer offpeak cost Field is Required",
                            },
                            Helpers.positiveValidator(),
                          ]}
                        >
                          <Input type="number" min={1} disabled={isanalysisLoading} />
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
                          <Input type="number" min={1} disabled={isanalysisLoading} />
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
                          <Input type="number" min={1} disabled={isanalysisLoading} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="win_op_cost"
                          label="Winter offpeak cost"
                          rules={[
                            {
                              required: true,
                              message: "Winter offpeak cost Field is Required",
                            },
                            Helpers.positiveValidator(),
                          ]}
                        >
                          <Input type="number" min={1} disabled={isanalysisLoading} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            )}
            {currentStep === 3 && (
              <Form
                className="wri_form"
                autoComplete="off"
                form={form4}
                layout="vertical"
              >
                <Row gutter={[20]}>
                  <Col span={6} xs={24} md={12} xl={8} xxl={6}>
                    <Form.Item
                      label={
                        <span>
                          Summer Season{" "}
                          <Popover
                            content={() =>
                              content(
                                "Specify the start/ end of the seasonal load variation in MMM-DD format"
                              )
                            }
                            trigger="hover"
                          >
                            <span className="infoBubble">
                              <img src={Info_icon} />
                            </span>
                          </Popover>
                        </span>
                      }
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
                        disabledDate={(d) =>
                          !d ||
                          d.isAfter(dayjs().set('month', 0).set('date', 1).add(1, 'year')) ||
                          d.isBefore(dayjs().set('month', 0).set('date', 1).subtract(1, 'year'))
                        }
                        onChange={(value) => {
                          if (value && value[0]) {
                            console.log(dayjs(value[0]).format("MMM-DD"));
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6} xs={24} md={12} xl={8} xxl={6}>
                    <Form.Item
                      label={
                        <span>
                          Winter season{" "}
                          <Popover
                            content={() =>
                              content(
                                "Specify the start/ end of the seasonal load variation in MMM-DD format"
                              )
                            }
                            trigger="hover"
                          >
                            <span className="infoBubble">
                              <img src={Info_icon} />
                            </span>
                          </Popover>
                        </span>
                      }
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
                        disabledDate={(d) =>
                          !d ||
                          d.isAfter(dayjs().set('month', 0).set('date', 1).add(1, 'year')) ||
                          d.isBefore(dayjs().set('month', 0).set('date', 1).subtract(1, 'year'))
                        }
                        onChange={(value) => {
                          if (value && value[0]) {
                            console.log(dayjs(value[0]).format("MMM-DD"));
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[20]} style={{ width: "100%" }}>
                  <Col span={24}>
                    <h3>
                      Specify the Time of the Day (ToD) slots of the utility for loads other than electric vehicles at present
                    </h3>
                  </Col>

                  {/* Summer Season - First Row: Four Time Pickers */}
                  <Col span={24}>
                    <div className="season-section">
                      <b>Summer season</b>
                      <Row gutter={[10]} wrap={false}>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Peak time start"
                            name="s_pks"
                            rules={[{ required: true, message: "Peak time start Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ s_pks: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('s_pks') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true} // Ensure the time label is shown
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Peak time end"
                            name="s_pke"
                            rules={[{ required: true, message: "Peak time end Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ s_pke: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('s_pke') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Off-peak time start"
                            name="s_ops"
                            rules={[{ required: true, message: "Off-peak time start Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ s_ops: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('s_ops') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Off-peak time end"
                            name="s_ope"
                            rules={[{ required: true, message: "Off-peak time end Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ s_ope: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('s_ope') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  {/* Summer Season - Second Row: Peak Surcharge and Off-Peak Rebate */}
                  <Col span={24}>
                    <div className="season-section">
                      <Row gutter={[10]}>
                        <Col span={12} xs={24} sm={12} md={12}>
                          <Form.Item
                            label="Peak surcharge"
                            name="s_sx"
                            rules={[
                              { required: true, message: "Peak surcharge Field is Required" },
                              Helpers.percentageValidator("sx"),
                            ]}
                          >
                            <Input type="number" disabled={isanalysisLoading} />
                          </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={12} md={12}>
                          <Form.Item
                            label="Off-peak rebate"
                            name="s_rb"
                            rules={[
                              { required: true, message: "Off-peak rebate Field is Required" },
                              Helpers.percentageValidator("rb"),
                            ]}
                          >
                            <Input type="number" disabled={isanalysisLoading} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  {/* Winter Season - Third Row: Four Time Pickers */}
                  <Col span={24}>
                    <div className="season-section">
                      <b>Winter season</b>
                      <Row gutter={[10]} wrap={false}>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Peak time start"
                            name="w_pks"
                            rules={[{ required: true, message: "Peak time start Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ w_pks: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('w_pks') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Peak time end"
                            name="w_pke"
                            rules={[{ required: true, message: "Peak time end Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ w_pke: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('w_pke') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Off-peak time start"
                            name="w_ops"
                            rules={[{ required: true, message: "Off-peak time start Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ w_ops: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('w_ops') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6}>
                          <Form.Item
                            label="Off-peak time end"
                            name="w_ope"
                            rules={[{ required: true, message: "Off-peak time end Field is Required" }]}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="mui-static-time-picker">
                                <StaticTimePicker
                                  orientation="landscape"
                                  disabled={isanalysisLoading}
                                  onChange={(value) => {
                                    form4.setFieldsValue({ w_ope: dayjs(value) });
                                  }}
                                  value={form4.getFieldValue('w_ope') || null}
                                  autoFocus={true}
                                  defaultView="hours"
                                  displayStaticWrapperAs="desktop"
                                  showToolbar={true}
                                  slotProps={{
                                    toolbar: {
                                      hidden: false,
                                      sx: {
                                        padding: '8px 0',
                                        justifyContent: 'center',
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  {/* Winter Season - Fourth Row: Peak Surcharge and Off-Peak Rebate */}
                  <Col span={24}>
                    <div className="season-section">
                      <Row gutter={[10]}>
                        <Col span={12} xs={24} sm={12} md={12}>
                          <Form.Item
                            label="Peak surcharge"
                            name="w_sx"
                            rules={[
                              { required: true, message: "Peak surcharge Field is Required" },
                              Helpers.percentageValidator("sx"),
                            ]}
                          >
                            <Input type="number" disabled={isanalysisLoading} />
                          </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={12} md={12}>
                          <Form.Item
                            label="Off-peak rebate"
                            name="w_rb"
                            rules={[
                              { required: true, message: "Off-peak rebate Field is Required" },
                              Helpers.percentageValidator("rb"),
                            ]}
                          >
                            <Input type="number" disabled={isanalysisLoading} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {currentStep !== 0 && (
                <AntdButton
                  className="form_btn next-back"
                  color="info"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  Back
                </AntdButton>
              )}
              <AntdButton
                className="form_btn next-back"
                htmlType="Submit"
                onClick={handleFormSubmit}
              >
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