import React from "react";
import { Layout as AntdLayout, Menu, Typography } from "antd";
import {
  ContainerOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = AntdLayout;
const { Title } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <AntdLayout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? 16 : 20,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "CA" : "Container App"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] ? `/${location.pathname.split('/')[1]}` : '/container-items']}
          items={[
            {
              key: "/container-items",
              icon: <ContainerOutlined />,
              label: "Container Items",
              onClick: () => navigate("/container-items"),
            },
            {
              key: "/suppliers",
              icon: <TeamOutlined />,
              label: "Suppliers",
              onClick: () => navigate("/suppliers"),
            },
          ]}
        />
      </Sider>
      <AntdLayout style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Container Planning & Management
          </Title>
          <div style={{ fontSize: 14, color: "#888" }}>
            DEMO-001 SOUTH (Port A) | DEMO-002 NORTH (Port B)
          </div>
        </Header>
        <Content style={{ margin: 0, background: "#0f172a", minHeight: "100vh" }}>
          {children}
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};
