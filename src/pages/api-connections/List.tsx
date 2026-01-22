import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Select,
  Space,
  Row,
  Col,
  Button,
  Input,
  message,
  Tag,
  Divider,
  List,
  Avatar,
} from "antd";
import {
  ApiOutlined,
  CloudSyncOutlined,
  DatabaseOutlined,
  RobotOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ApiConnectionsList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("API CONNECTIONS");
  const [selectedERP, setSelectedERP] = useState<string | undefined>(undefined);
  const [selectedDataSource, setSelectedDataSource] = useState<string | undefined>(
    undefined
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const [dataFetchStatus, setDataFetchStatus] = useState<
    "idle" | "fetching" | "success" | "error"
  >("idle");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you with container planning today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

  const erpOptions = [
    { value: "softone", label: "SoftOne ERP", icon: "💼" },
    { value: "epsilonnet", label: "Epsilon Net", icon: "📊" },
    { value: "ison", label: "ISON Platform", icon: "🔧" },
  ];

  const dataOptions = [
    { value: "test", label: "Get Test Data", icon: "🧪" },
    { value: "participants", label: "Get Participants Data", icon: "👥" },
  ];

  // Redirect when a different view is selected
  useEffect(() => {
    if (selectedView === "SUPPLIER LIST") {
      navigate("/suppliers");
    } else if (selectedView === "ARRIVALS") {
      navigate("/arrivals");
    } else if (selectedView === "ENTYPO PARALAVIS") {
      navigate("/entypo-paralavis");
    } else if (selectedView === "CHARTS") {
      navigate("/charts");
    } else if (selectedView !== "API CONNECTIONS") {
      navigate("/container-items");
    }
  }, [selectedView, navigate]);

  const handleERPConnect = () => {
    if (!selectedERP) {
      message.warning("Please select an ERP system first");
      return;
    }

    setConnectionStatus("connecting");
    message.loading({ content: "Connecting to ERP system...", key: "erp" });

    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus("connected");
      message.success({
        content: `Successfully connected to ${
          erpOptions.find((e) => e.value === selectedERP)?.label
        }`,
        key: "erp",
        duration: 3,
      });
    }, 2000);
  };

  const handleDataFetch = () => {
    if (!selectedDataSource) {
      message.warning("Please select a data source first");
      return;
    }

    setDataFetchStatus("fetching");
    message.loading({ content: "Fetching data...", key: "data" });

    // Simulate data fetch process
    setTimeout(() => {
      setDataFetchStatus("success");
      message.success({
        content: `Successfully fetched ${
          dataOptions.find((d) => d.value === selectedDataSource)?.label
        }`,
        key: "data",
        duration: 3,
      });
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you analyze container utilization and optimize your shipping routes.",
        "Let me check the current status of your containers. Based on the data, DEMO-001 SOUTH has 20 items with a total of 56.4 CBM.",
        "I recommend grouping items by similar delivery dates to optimize container loading efficiency.",
        "The current average CBM per container is approximately 150. You're utilizing space efficiently!",
        "Would you like me to generate a report on container costs vs. capacity utilization?",
        "I can help you track supplier performance and identify potential bottlenecks in your supply chain.",
      ];

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "success":
        return "success";
      case "connecting":
      case "fetching":
        return "processing";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "success":
        return <CheckCircleOutlined />;
      case "connecting":
      case "fetching":
        return <SyncOutlined spin />;
      case "error":
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

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
        .chat-container {
          max-height: 500px;
          overflow-y: auto;
          padding: 16px;
          background: #111827;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .chat-message {
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
        }
        .chat-message.user {
          flex-direction: row-reverse;
        }
        .chat-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          word-wrap: break-word;
        }
        .chat-bubble.user {
          background: #3b82f6;
          color: white;
          margin-left: auto;
        }
        .chat-bubble.bot {
          background: #374151;
          color: #d1d5db;
        }
        .ant-select-selector,
        .ant-input,
        .ant-input-textarea textarea {
          background: #374151 !important;
          border-color: #4b5563 !important;
          color: #d1d5db !important;
        }
        .ant-select-arrow {
          color: #d1d5db !important;
        }
      `}</style>
      <div style={{ background: "#0f172a", minHeight: "100vh", padding: "24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={1} style={{ color: "white", marginBottom: "24px" }}>
            <ApiOutlined style={{ marginRight: "12px" }} />
            API Connections & Integrations
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

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            {/* ERP Connection Section */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <CloudSyncOutlined style={{ marginRight: "8px" }} />
                    Connect to ERP System
                  </span>
                }
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <div>
                    <Text style={{ color: "#d1d5db", display: "block", marginBottom: "8px" }}>
                      Select ERP Platform:
                    </Text>
                    <Select
                      placeholder="Choose ERP system"
                      style={{ width: "100%" }}
                      size="large"
                      value={selectedERP}
                      onChange={(value) => {
                        setSelectedERP(value);
                        setConnectionStatus("idle");
                      }}
                    >
                      {erpOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <span style={{ marginRight: "8px" }}>{option.icon}</span>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    icon={<CloudSyncOutlined />}
                    onClick={handleERPConnect}
                    disabled={!selectedERP || connectionStatus === "connecting"}
                    loading={connectionStatus === "connecting"}
                    style={{
                      width: "100%",
                      backgroundColor: "#3b82f6",
                      borderColor: "#3b82f6",
                    }}
                  >
                    {connectionStatus === "connecting" ? "Connecting..." : "Connect to ERP"}
                  </Button>

                  {connectionStatus !== "idle" && (
                    <Tag
                      icon={getStatusIcon(connectionStatus)}
                      color={getStatusColor(connectionStatus)}
                      style={{ width: "100%", textAlign: "center", padding: "8px" }}
                    >
                      {connectionStatus === "connected" && "Successfully Connected"}
                      {connectionStatus === "connecting" && "Connecting..."}
                      {connectionStatus === "error" && "Connection Failed"}
                    </Tag>
                  )}

                  <Divider style={{ borderColor: "#374151" }} />

                  <div>
                    <Paragraph style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                      <strong>Supported ERP Systems:</strong>
                    </Paragraph>
                    <ul style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
                      <li>SoftOne ERP - Complete business management</li>
                      <li>Epsilon Net - Advanced accounting & ERP</li>
                      <li>ISON Platform - Industrial operations management</li>
                    </ul>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Data Fetch Section */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <DatabaseOutlined style={{ marginRight: "8px" }} />
                    Get Data
                  </span>
                }
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <div>
                    <Text style={{ color: "#d1d5db", display: "block", marginBottom: "8px" }}>
                      Select Data Source:
                    </Text>
                    <Select
                      placeholder="Choose data source"
                      style={{ width: "100%" }}
                      size="large"
                      value={selectedDataSource}
                      onChange={(value) => {
                        setSelectedDataSource(value);
                        setDataFetchStatus("idle");
                      }}
                    >
                      {dataOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <span style={{ marginRight: "8px" }}>{option.icon}</span>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    icon={<DatabaseOutlined />}
                    onClick={handleDataFetch}
                    disabled={!selectedDataSource || dataFetchStatus === "fetching"}
                    loading={dataFetchStatus === "fetching"}
                    style={{
                      width: "100%",
                      backgroundColor: "#10b981",
                      borderColor: "#10b981",
                    }}
                  >
                    {dataFetchStatus === "fetching" ? "Fetching Data..." : "Fetch Data"}
                  </Button>

                  {dataFetchStatus !== "idle" && (
                    <Tag
                      icon={getStatusIcon(dataFetchStatus)}
                      color={getStatusColor(dataFetchStatus)}
                      style={{ width: "100%", textAlign: "center", padding: "8px" }}
                    >
                      {dataFetchStatus === "success" && "Data Fetched Successfully"}
                      {dataFetchStatus === "fetching" && "Fetching Data..."}
                      {dataFetchStatus === "error" && "Fetch Failed"}
                    </Tag>
                  )}

                  <Divider style={{ borderColor: "#374151" }} />

                  <div>
                    <Paragraph style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                      <strong>Available Data Sources:</strong>
                    </Paragraph>
                    <ul style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
                      <li>Test Data - Sample data for testing integrations</li>
                      <li>Participants Data - Partner and stakeholder information</li>
                    </ul>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* AI Chatbot Section */}
          <Card
            title={
              <span>
                <RobotOutlined style={{ marginRight: "8px" }} />
                AI Assistant - Container Planning Agent
              </span>
            }
          >
            <div className="chat-container">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.sender}`}
                >
                  {msg.sender === "bot" && (
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{
                        backgroundColor: "#3b82f6",
                        marginRight: "12px",
                      }}
                    />
                  )}
                  <div className={`chat-bubble ${msg.sender}`}>
                    <Text
                      style={{
                        color: msg.sender === "user" ? "white" : "#d1d5db",
                      }}
                    >
                      {msg.content}
                    </Text>
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "4px",
                        opacity: 0.7,
                        color: msg.sender === "user" ? "#e0e7ff" : "#9ca3af",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {msg.sender === "user" && (
                    <Avatar
                      style={{
                        backgroundColor: "#8b5cf6",
                        marginLeft: "12px",
                      }}
                    >
                      U
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message bot">
                  <Avatar
                    icon={<RobotOutlined />}
                    style={{
                      backgroundColor: "#3b82f6",
                      marginRight: "12px",
                    }}
                  />
                  <div className="chat-bubble bot">
                    <Text style={{ color: "#d1d5db" }}>Typing...</Text>
                  </div>
                </div>
              )}
            </div>

            <Space.Compact style={{ width: "100%" }}>
              <TextArea
                placeholder="Ask me anything about your containers, suppliers, or shipments..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                style={{
                  backgroundColor: "#8b5cf6",
                  borderColor: "#8b5cf6",
                  height: "auto",
                }}
              >
                Send
              </Button>
            </Space.Compact>

            <Divider style={{ borderColor: "#374151" }} />

            <div>
              <Paragraph style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                <strong>💡 Try asking:</strong>
              </Paragraph>
              <div style={{ marginTop: "8px" }}>
                {[
                  "What's the total CBM across all containers?",
                  "Which suppliers need payment?",
                  "Show me the status of DEMO-001 SOUTH",
                  "How many items are awaiting supplier?",
                ].map((suggestion, idx) => (
                  <Tag
                    key={idx}
                    style={{
                      margin: "4px",
                      cursor: "pointer",
                      backgroundColor: "#374151",
                      borderColor: "#4b5563",
                      color: "#d1d5db",
                    }}
                    onClick={() => setCurrentMessage(suggestion)}
                  >
                    {suggestion}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        </Space>
      </div>
    </>
  );
};
