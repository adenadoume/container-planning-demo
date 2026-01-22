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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
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
  const [costData, setCostData] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const views = [
    "DEMO-001 SOUTH",
    "DEMO-002 NORTH",
    "DEMO-003 SOUTH",
    "DEMO-004 SOUTH",
    "SUPPLIER LIST",
    "ARRIVALS",
    "CHARTS",
    "API CONNECTIONS",
  ];

  // Redirect when a different view is selected
  useEffect(() => {
    if (selectedView === "SUPPLIER LIST") {
      navigate("/suppliers");
    } else if (selectedView === "ARRIVALS") {
      navigate("/arrivals");
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
        .select("container_name, cbm, status, reference_code, product_cost, freight_cost, client");

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
        const itemCBM = parseFloat(item.cbm?.toString() || "0");
        containerMap.set(container, currentCBM + itemCBM);
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

      // Process data for Cost Analysis Area Chart
      const costAnalysisData = Array.from(containerMap.entries()).map(
        ([name]) => {
          const containerItems = items?.filter(item => item.container_name === name) || [];
          const totalProductCost = containerItems.reduce((sum, item) => sum + (parseFloat(item.product_cost?.toString() || "0")), 0);
          const totalFreightCost = containerItems.reduce((sum, item) => sum + (parseFloat(item.freight_cost?.toString() || "0")), 0);
          return {
            container: name,
            productCost: parseFloat(totalProductCost.toFixed(2)),
            freightCost: parseFloat(totalFreightCost.toFixed(2)),
          };
        }
      );
      setCostData(costAnalysisData);

      // Process data for Client Distribution Radial Chart
      const clientMap = new Map();
      items?.forEach((item) => {
        const client = item.client || "Unknown";
        clientMap.set(client, (clientMap.get(client) || 0) + 1);
      });

      const clientChartData = Array.from(clientMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], index) => ({
          name,
          value,
          fill: COLORS[index % COLORS.length],
        }));
      setClientData(clientChartData);

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
          background: #111827 !important;
          border: 1px solid #374151 !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        .chart-card-blue {
          box-shadow: 0 4px 14px 0 rgba(96, 165, 250, 0.39) !important;
        }
        .chart-card-blue:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px 0 rgba(96, 165, 250, 0.5) !important;
        }
        .chart-card-green {
          box-shadow: 0 4px 14px 0 rgba(52, 211, 153, 0.39) !important;
        }
        .chart-card-green:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px 0 rgba(52, 211, 153, 0.5) !important;
        }
        .chart-card-orange {
          box-shadow: 0 4px 14px 0 rgba(251, 146, 60, 0.39) !important;
        }
        .chart-card-orange:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px 0 rgba(251, 146, 60, 0.5) !important;
        }
        .chart-card-purple {
          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.39) !important;
        }
        .chart-card-purple:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px 0 rgba(139, 92, 246, 0.5) !important;
        }
        .chart-card-cyan {
          box-shadow: 0 4px 14px 0 rgba(34, 211, 238, 0.39) !important;
        }
        .chart-card-cyan:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px 0 rgba(34, 211, 238, 0.5) !important;
        }
        .ant-card-head {
          border-bottom: 1px solid #374151 !important;
          color: white !important;
        }
        .ant-card-head-title {
          color: white !important;
          font-size: 20px !important;
          font-weight: 700 !important;
        }
        .recharts-text {
          fill: #d1d5db !important;
          font-size: 14px !important;
        }
        .recharts-legend-item-text {
          color: #d1d5db !important;
        }
        .ant-select-selector {
          background: #374151 !important;
          border-color: #4b5563 !important;
          color: #ffffff !important;
          font-size: 18px !important;
        }
        .ant-select-selection-item {
          color: #ffffff !important;
        }
        .ant-select-selection-placeholder {
          color: #9ca3af !important;
        }
        .ant-select-arrow {
          color: #d1d5db !important;
        }
        .ant-select-dropdown {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
        }
        .ant-select-item {
          color: #d1d5db !important;
          background: #1f2937 !important;
          font-size: 16px !important;
        }
        .ant-select-item-option-selected {
          background: #374151 !important;
          color: #ffffff !important;
          font-weight: 600 !important;
        }
        .ant-select-item-option-active {
          background: #374151 !important;
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
              className="chart-card-blue"
              hoverable
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
                      backgroundColor: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: "bold" }}
                    itemStyle={{ color: "#374151" }}
                  />
                  <Legend />
                  <Bar dataKey="cbm" fill="#3b82f6" name="Total CBM" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Row gutter={[24, 24]}>
              {/* Status Distribution Pie Chart */}
              <Col xs={24} lg={12}>
                <Card
                  className="chart-card-green"
                  hoverable
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
                          backgroundColor: "#ffffff",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                        }}
                        labelStyle={{ color: "#111827", fontWeight: "bold" }}
                        itemStyle={{ color: "#374151" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Top Suppliers Line Chart */}
              <Col xs={24} lg={12}>
                <Card
                  className="chart-card-orange"
                  hoverable
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
                          backgroundColor: "#ffffff",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                        }}
                        labelStyle={{ color: "#111827", fontWeight: "bold" }}
                        itemStyle={{ color: "#374151" }}
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

            {/* Cost Analysis Area Chart */}
            <Card
              className="chart-card-purple"
              hoverable
              title={
                <span>
                  <LineChartOutlined style={{ marginRight: "8px" }} />
                  Cost Analysis by Container
                </span>
              }
            >
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={costData}>
                  <defs>
                    <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFreight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="container" stroke="#d1d5db" />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: "bold" }}
                    itemStyle={{ color: "#374151" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="productCost" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProduct)" name="Product Cost" />
                  <Area type="monotone" dataKey="freightCost" stroke="#10b981" fillOpacity={1} fill="url(#colorFreight)" name="Freight Cost" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Row gutter={[24, 24]}>
              {/* Client Distribution Radial Chart */}
              <Col xs={24} lg={12}>
                <Card
                  className="chart-card-cyan"
                  hoverable
                  title={
                    <span>
                      <PieChartOutlined style={{ marginRight: "8px" }} />
                      Top 5 Clients
                    </span>
                  }
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="20%" 
                      outerRadius="90%" 
                      data={clientData}
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar
                        label={{ position: 'insideStart', fill: '#fff', fontSize: 14 }}
                        background
                        dataKey="value"
                      />
                      <Legend 
                        iconSize={10} 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ color: "#d1d5db" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                        }}
                        labelStyle={{ color: "#111827", fontWeight: "bold" }}
                        itemStyle={{ color: "#374151" }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Combined Chart */}
              <Col xs={24} lg={12}>
                <Card
                  className="chart-card-blue"
                  hoverable
                  title={
                    <span>
                      <BarChartOutlined style={{ marginRight: "8px" }} />
                      CBM vs Items Count
                    </span>
                  }
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={containerData.map((item, index) => ({
                      ...item,
                      itemCount: statusData.filter((_s, i) => i === index).reduce((sum, s) => sum + s.value, statusData.reduce((sum, s) => sum + s.value, 0) / containerData.length)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="container" stroke="#d1d5db" />
                      <YAxis yAxisId="left" stroke="#d1d5db" />
                      <YAxis yAxisId="right" orientation="right" stroke="#d1d5db" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                        }}
                        labelStyle={{ color: "#111827", fontWeight: "bold" }}
                        itemStyle={{ color: "#374151" }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cbm" fill="#3b82f6" name="Total CBM" />
                      <Line yAxisId="right" type="monotone" dataKey="itemCount" stroke="#ef4444" strokeWidth={3} name="Items Count" dot={{ fill: "#ef4444", r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Summary Statistics Card */}
            <Card className="chart-card-green" hoverable title="Summary Statistics">
              <Row gutter={[24, 24]}>
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
