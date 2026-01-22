import React from "react";
import { Show, TextField, NumberField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Card, Space, Tag } from "antd";
import { ContainerItem } from "../../services/supabase";

const { Title } = Typography;

export const ContainerItemsShow: React.FC = () => {
  const { queryResult } = useShow<ContainerItem>({
    resource: "container_items",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Ready to Ship": "success",
      "Awaiting Supplier": "warning",
      "Need Payment": "error",
      "Pending": "default",
    };
    return colors[status] || "default";
  };

  return (
    <Show isLoading={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card>
          <Space direction="vertical" size="small">
            <Title level={4} style={{ margin: 0 }}>
              {record?.reference_code} - {record?.supplier}
            </Title>
            <Space>
              <Tag color={record?.container_name === "I110.11 SOUTH" ? "blue" : "green"}>
                {record?.container_name}
              </Tag>
              {record?.status && (
                <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
              )}
            </Space>
          </Space>
        </Card>

        {/* Basic Information */}
        <Card title="Basic Information">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Reference Code">
              <TextField value={record?.reference_code} strong />
            </Descriptions.Item>
            <Descriptions.Item label="Supplier">
              <TextField value={record?.supplier} />
            </Descriptions.Item>
            <Descriptions.Item label="Container">
              <TextField value={record?.container_name} />
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {record?.status && (
                <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Client">
              <TextField value={record?.client || "-"} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Shipping Details */}
        <Card title="Shipping Details">
          <Descriptions bordered column={3}>
            <Descriptions.Item label="CBM">
              <NumberField value={record?.cbm || 0} options={{ minimumFractionDigits: 2 }} />
            </Descriptions.Item>
            <Descriptions.Item label="Cartons">
              <NumberField value={record?.cartons || 0} />
            </Descriptions.Item>
            <Descriptions.Item label="Gross Weight">
              <NumberField value={record?.gross_weight || 0} options={{ minimumFractionDigits: 2 }} />
              {" kg"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Financial Details */}
        <Card title="Financial Details">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Product Cost">
              <NumberField
                value={record?.product_cost || 0}
                options={{
                  style: "currency",
                  currency: "USD",
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Payment">
              <NumberField
                value={record?.payment || 0}
                options={{
                  style: "currency",
                  currency: "USD",
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Payment Date">
              {record?.payment_date ? (
                <DateField value={record.payment_date} format="YYYY-MM-DD" />
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Remaining Balance" span={2}>
              <Typography.Text strong style={{ color: "#cf1322", fontSize: 16 }}>
                <NumberField
                  value={record?.remaining || 0}
                  options={{
                    style: "currency",
                    currency: "USD",
                  }}
                />
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Production Details */}
        <Card title="Production Details">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Production Days">
              <NumberField value={record?.production_days || 0} />
              {" days"}
            </Descriptions.Item>
            <Descriptions.Item label="Production Ready">
              {record?.production_ready ? (
                <DateField value={record.production_ready} format="YYYY-MM-DD" />
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Awaiting" span={2}>
              {record?.awaiting && record.awaiting.length > 0 ? (
                <Space wrap>
                  {record.awaiting.map((item: string, index: number) => (
                    <Tag key={index} color="orange">
                      {item}
                    </Tag>
                  ))}
                </Space>
              ) : (
                "-"
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Additional Information */}
        {(record?.address || record?.remarks) && (
          <Card title="Additional Information">
            <Descriptions bordered column={1}>
              {record?.address && (
                <Descriptions.Item label="Address">
                  <TextField value={record.address} />
                </Descriptions.Item>
              )}
              {record?.remarks && (
                <Descriptions.Item label="Remarks">
                  <TextField value={record.remarks} />
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}

        {/* Metadata */}
        <Card title="Metadata" size="small">
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Created At">
              {record?.created_at ? (
                <DateField value={record.created_at} format="YYYY-MM-DD HH:mm:ss" />
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {record?.updated_at ? (
                <DateField value={record.updated_at} format="YYYY-MM-DD HH:mm:ss" />
              ) : (
                "-"
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Show>
  );
};
