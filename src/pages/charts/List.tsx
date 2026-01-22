import React, { useState, useEffect } from "react";
import { Card, Typography, Select, Space, Row, Col } from "antd";
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const { Text, Title } = Typography;
const { Option } = Select;

export const ChartsList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("CHARTS");
  const [containerData, setContainerData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [supplierData, setSupplierData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const views = [
    "DEMO-001 SOUTH",
    "DEMO-002 NORTH",
    "DEMO-003 SOUTH",
    "DEMO-004 SOUTH",
    "DEMO-005 SOUTH",
    "SUPPLIER LIST",
    "ARRIVALS",
    "ENTYPO PARALAVIS",
    "CHARTS",
    "API CONNECTIONS",
  ];

  // Redirect when a different view is selected
  useEffect(() => {
    if (selectedView === "SUPPLIER LIST") {
      navigate("/suppliers");
    } else if (selectedView === "ARRIVALS") {
      navigate("/arrivals");
    } else if (selectedView === "ENTYPO PARALAVIS") {
      navigate("/entypo-paralavis");
    } else if (selectedView === "API CONNECTIONS") {
      navigate("/api-connections");
    } else if (selectedView !== "CHARTS") {
      navigate("/container-items");
    }
  }, [selectedView, navigate]);

  // Fetch data for charts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch container items data
      const { data: items, error: itemsError } = await supabase
        .from("container_items")
        .select("container_name, cbm, status, reference_code");

      if (itemsError) {
        console.error("Error fetching container items:", itemsError);
        setLoading(false);
        return;
      }

      // Process data for Container CBM Bar Chart
      const containerMap = new Map();
      items?.forEach((item) => {
        const container = item.container_name || "Unknown";
        const currentCBM = containerMap.get(container) || 0;
        containerMap.set(container, currentCBM + (parseFloat(item.cbm) || 0));
      });

      const containerChartData = Array.from(containerMap.entries()).map(
        ([name, cbm]) => ({
          container: name,
          cbm: parseFloat(cbm.toFixed(2)),
        })
      );
      setContainerData(containerChartData);

      // Process data for Status Distribution Pie Chart
      const statusMap = new Map();
      items?.forEach((item) => {
        const status = item.status || "Unknown";
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });

      const statusChartData = Array.from(statusMap.entries()).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      setStatusData(statusChartData);

      // Process data for Top Suppliers Line Chart (by number of items)
      const supplierMap = new Map();
      items?.forEach((item) => {
        const supplier = item.reference_code?.split("-")[0] || "Unknown";
        supplierMap.set(supplier, (supplierMap.get(supplier) || 0) + 1);
      });

      const supplierChartData = Array.from(supplierMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([supplier, count]) => ({
          supplier,
          items: count,
        }));
      setSupplierData(supplierChartData);

      setLoading(false);
    };

    fetchData();
  }, []);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  return (
    <>
      <style>{`
        .ant-card {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
        }
        .ant-card-head {
          border-bottom: 1px solid #374151 !important;
          color: white !important;
        }
        .ant-card-head-title {
          color: white !important;
          font-size: 18px !important;
          font-weight: bold !important;
        }
        .recharts-text {
          fill: #d1d5db !important;
        }
        .recharts-legend-item-text {
          color: #d1d5db !important;
        }
      `}</style>
      <div style={{ background: "#0f172a", minHeight: "100vh", padding: "24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={1} style={{ color: "white", marginBottom: "24px" }}>
            <BarChartOutlined style={{ marginRight: "12px" }} />
            Analytics Dashboard
          </Title>

          {/* View Selector */}
          <div style={{ marginBottom: "20px" }}>
            <Text style={{ color: "white", marginRight: "16px", fontSize: "16px" }}>
              Select View
            </Text>
            <Select
              value={selectedView}
              onChange={setSelectedView}
              style={{ width: 300, fontSize: "18px" }}
              size="large"
            >
              {views.map((view) => (
                <Option key={view} value={view}>
                  {view}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Text style={{ color: "white", fontSize: "18px" }}>Loading charts...</Text>
          </div>
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Container CBM Bar Chart */}
            <Card
              title={
                <span>
                  <BarChartOutlined style={{ marginRight: "8px" }} />
                  Container CBM Distribution
                </span>
              }
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={containerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="container" stroke="#d1d5db" />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      color: "#d1d5db",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cbm" fill="#3b82f6" name="Total CBM" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Row gutter={[16, 16]}>
              {/* Status Distribution Pie Chart */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <span>
                      <PieChartOutlined style={{ marginRight: "8px" }} />
                      Status Distribution
                    </span>
                  }
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          color: "#d1d5db",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Top Suppliers Line Chart */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <span>
                      <LineChartOutlined style={{ marginRight: "8px" }} />
                      Top 10 Suppliers by Items
                    </span>
                  }
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={supplierData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="supplier" stroke="#d1d5db" />
                      <YAxis stroke="#d1d5db" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          color: "#d1d5db",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="items"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Number of Items"
                        dot={{ fill: "#10b981", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Summary Statistics Card */}
            <Card title="Summary Statistics">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={2} style={{ color: "#3b82f6", margin: 0 }}>
                      {containerData.length}
                    </Title>
                    <Text style={{ color: "#d1d5db", fontSize: "16px" }}>
                      Total Containers
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={2} style={{ color: "#10b981", margin: 0 }}>
                      {statusData.reduce((sum, item) => sum + item.value, 0)}
                    </Title>
                    <Text style={{ color: "#d1d5db", fontSize: "16px" }}>
                      Total Items
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={2} style={{ color: "#f59e0b", margin: 0 }}>
                      {containerData
                        .reduce((sum, item) => sum + item.cbm, 0)
                        .toFixed(2)}
                    </Title>
                    <Text style={{ color: "#d1d5db", fontSize: "16px" }}>
                      Total CBM
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={2} style={{ color: "#8b5cf6", margin: 0 }}>
                      {supplierData.length}
                    </Title>
                    <Text style={{ color: "#d1d5db", fontSize: "16px" }}>
                      Active Suppliers
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Space>
        )}
      </div>
    </>
  );
};
