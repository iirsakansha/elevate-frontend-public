import { Row, Col, Layout, Button, Table, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteAnlysisResult } from "../redux/analysis/analysisAction";
import { useNavigate } from "react-router";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AnalysisResult = (props) => {
  const { analysisResult } = useSelector((state) => state.analysis);
  const AnalysisResultData = typeof analysisResult === "string"
    ? JSON.parse(analysisResult)
    : analysisResult || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Generate time block labels based on resolution (30-min default)
  const timeBlocks = Array.from(
    { length: 1440 / 30 },
    (_, i) => `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`
  );

  // Chart 1: EV Load per Year (Line Chart)
  const evLoadChartData = {
    labels: timeBlocks,
    datasets: AnalysisResultData.EV_Load?.map((yearData, index) => ({
      label: Object.keys(yearData)[0],
      data: yearData[Object.keys(yearData)[0]],
      borderColor: ["#f5b942", "#42f575", "#42cbf5", "#9342f5", "#f54293"][index % 5],
      backgroundColor: ["#f5b942", "#42f575", "#42cbf5", "#9342f5", "#f54293"][index % 5],
      fill: true,
      tension: 0.4,
    })) || [],
  };

  const evLoadChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Simulated EV Load Over Years" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Load (kW)" } },
      x: { title: { display: true, text: "Time of Day" } },
    },
  };

  // Chart 2: Base Load per Year (Bar Chart)
  const baseLoadChartData = {
    labels: timeBlocks,
    datasets: AnalysisResultData.Base_Load?.map((yearData, index) => ({
      label: Object.keys(yearData)[0],
      data: yearData[Object.keys(yearData)[0]],
      backgroundColor: ["#b3ffff", "#80ff80", "#ffdb4d", "#db70b8", "#a64dff"][index % 5],
    })) || [],
  };

  const baseLoadChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Base Load Profile Over Years" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Load (kW)" } },
      x: { title: { display: true, text: "Time of Day" } },
    },
  };

  // Chart 3: Base + EV Load per Year (Stacked Bar Chart)
  const combinedLoadChartData = {
    labels: timeBlocks,
    datasets: AnalysisResultData.Base_EV_Load?.flatMap((yearData, index) => {
      const yearKey = Object.keys(yearData)[0];
      return [
        {
          label: `${yearKey} Base Load`,
          data: yearData[yearKey].base_load,
          backgroundColor: ["#4dd8ff", "#f28ac0", "#d8fc90", "#ffa1a1", "#9898fa"][index % 5],
          stack: `Stack ${index}`,
        },
        {
          label: `${yearKey} EV Load`,
          data: yearData[yearKey].ev_load,
          backgroundColor: ["#4dc3ff", "#ff4d94", "#c4ff4d", "#ff6666", "#6666ff"][index % 5],
          stack: `Stack ${index}`,
        },
      ];
    }) || [],
  };

  const combinedLoadChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Base Load + EV Load Over Years" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Load (kW)" }, stacked: true },
      x: { title: { display: true, text: "Time of Day" }, stacked: true },
    },
  };

  // Chart 4: Base + ToD EV Load (Line Chart with Std Dev)
  const todLoadChartData = {
    labels: timeBlocks,
    datasets: [
      {
        label: "Mean ToD EV Load",
        data: AnalysisResultData.Base_ToD_EV_Load?.mean_load || [],
        borderColor: "#1890ff",
        backgroundColor: "#1890ff40",
        fill: "+1",
        tension: 0.4,
      },
      {
        label: "Mean + Std Dev",
        data: AnalysisResultData.Base_ToD_EV_Load?.mean_load.map((val, i) => val + AnalysisResultData.Base_ToD_EV_Load?.std_dev[i]) || [],
        borderColor: "transparent",
        backgroundColor: "#0000ff",
        fill: "-1",
      },
      {
        label: "Mean - Std Dev",
        data: AnalysisResultData.Base_ToD_EV_Load?.mean_load.map((val, i) => val - AnalysisResultData.Base_ToD_EV_Load?.std_dev[i]) || [],
        borderColor: "transparent",
        backgroundColor: "#9999ff",
      },
    ],
  };

  const todLoadChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Average ToD EV Load with Std Dev" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Load (kW)" } },
      x: { title: { display: true, text: "Time of Day" } },
    },
  };

  // Summary Table Columns
  const summaryTableColumns = [
    { title: "Year", dataIndex: "Year", key: "Year" },
    { title: "Max Excursion Beyond Planning (kW)", dataIndex: "Max_excursion_planning", key: "Max_excursion_planning" },
    { title: "Number of Excursions (Planning)", dataIndex: "Num_excursions_planning", key: "Num_excursions_planning" },
    { title: "Max Excursion Beyond Rated Capacity (kW)", dataIndex: "Max_excursion_rated", key: "Max_excursion_rated" },
    { title: "Number of Excursions (Rated Capacity)", dataIndex: "Num_excursions_rated", key: "Num_excursions_rated" },
  ];

  // Manual CSV download function
  const downloadCSV = (data, filename, year = null) => {
    let csvData = [];
    let headers = [];

    if (year) {
      // Year-specific data
      if (Array.isArray(data)) {
        csvData = data
          .filter(item => Object.keys(item)[0] === year)
          .map(item => ({
            Time: timeBlocks,
            Load: item[Object.keys(item)[0]],
          }))
          .flatMap(item => item.Time.map((time, i) => ({ Time: time, Load: item.Load[i] })));
        headers = ["Time", "Load"];
      } else if (data && typeof data === 'object' && data[year]) {
        csvData = timeBlocks.map((time, i) => ({
          Time: time,
          Base_Load: data[year].base_load[i],
          EV_Load: data[year].ev_load[i],
        }));
        headers = ["Time", "Base_Load", "EV_Load"];
      }
    } else {
      // Non-year-specific data (ToD or Summary Table)
      if (filename === "ToD_EV_Load") {
        csvData = timeBlocks.map((time, i) => ({
          Time: time,
          Mean_Load: AnalysisResultData.Base_ToD_EV_Load?.mean_load[i],
          Std_Dev: AnalysisResultData.Base_ToD_EV_Load?.std_dev[i],
        }));
        headers = ["Time", "Mean_Load", "Std_Dev"];
      } else if (filename === "Summary_Table") {
        csvData = data;
        headers = ["Year", "Max_excursion_planning", "Num_excursions_planning", "Max_excursion_rated", "Num_excursions_rated"];
      }
    }

    if (csvData.length === 0) return;

    // Convert to CSV string
    const csvRows = [
      headers.join(","),
      ...csvData.map(row => headers.map(header => `"${row[header] || ""}"`).join(",")),
    ];
    const csv = csvRows.join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${filename}${year ? `_${year}` : ''}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tab items
  const tabItems = [
    {
      key: "1",
      label: "Simulated EV Load",
      children: (
        <div className="box">
          <Row justify="end" style={{ marginBottom: 16 }}>
            {AnalysisResultData.EV_Load?.map((yearData) => (
              <Button
                key={Object.keys(yearData)[0]}
                onClick={() => downloadCSV(AnalysisResultData.EV_Load, "EV_Load", Object.keys(yearData)[0])}
                style={{ marginLeft: 8 }}
              >
                Download {Object.keys(yearData)[0]}
              </Button>
            ))}
          </Row>
          <Line data={evLoadChartData} options={evLoadChartOptions} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Base Load Profile",
      children: (
        <div className="box">
          <Row justify="end" style={{ marginBottom: 16 }}>
            {AnalysisResultData.Base_Load?.map((yearData) => (
              <Button
                key={Object.keys(yearData)[0]}
                onClick={() => downloadCSV(AnalysisResultData.Base_Load, "Base_Load", Object.keys(yearData)[0])}
                style={{ marginLeft: 8 }}
              >
                Download {Object.keys(yearData)[0]}
              </Button>
            ))}
          </Row>
          <Bar data={baseLoadChartData} options={baseLoadChartOptions} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Base + EV Load",
      children: (
        <div className="box">
          <Row justify="end" style={{ marginBottom: 16 }}>
            {AnalysisResultData.Base_EV_Load?.map((yearData) => (
              <Button
                key={Object.keys(yearData)[0]}
                onClick={() => downloadCSV(AnalysisResultData.Base_EV_Load, "Base_EV_Load", Object.keys(yearData)[0])}
                style={{ marginLeft: 8 }}
              >
                Download {Object.keys(yearData)[0]}
              </Button>
            ))}
          </Row>
          <Bar data={combinedLoadChartData} options={combinedLoadChartOptions} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Average ToD EV Load",
      children: (
        <div className="box">
          <Row justify="end" style={{ marginBottom: 16 }}>
            <Button
              onClick={() => downloadCSV(null, "ToD_EV_Load")}
            >
              Download
            </Button>
          </Row>
          <Line data={todLoadChartData} options={todLoadChartOptions} />
        </div>
      ),
    },
    {
      key: "5",
      label: "Summary Table",
      children: (
        <div className="box">
          <Row justify="end" style={{ marginBottom: 16 }}>
            <Button
              onClick={() => downloadCSV(AnalysisResultData.Summary_Table, "Summary_Table")}
            >
              Download
            </Button>
          </Row>
          <Table
            columns={summaryTableColumns}
            dataSource={AnalysisResultData.Summary_Table || []}
            pagination={false}
            bordered
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pb-8 pt-5 pt-md-8 analysis_result_page">
      <Layout>
        <div className="result_items">
          <div className="items">
            <div className="header-box">
              <h3>Analysis Data</h3>
              <Button
                className="btn form_btn"
                onClick={() => {
                  dispatch(deleteAnlysisResult({ folderId: AnalysisResultData.id }));
                  navigate("/templates");
                }}
              >
                New Analysis
              </Button>
            </div>
            <Tabs defaultActiveKey="1" items={tabItems} />
          </div>
        </div>
      </Layout>
    </div>
  );
};