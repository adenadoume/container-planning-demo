import React from "react";
import { Show, TextField, EmailField, UrlField, BooleanField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Card, Space, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Supplier } from "../../services/supabase";

const { Title } = Typography;

export const SuppliersShow: React.FC = () => {
  const { queryResult } = useShow<Supplier>({
    resource: "suppliers",
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card>
          <Space direction="vertical" size="small">
            <Title level={4} style={{ margin: 0 }}>
              {record?.supplier}
            </Title>
            <Space>
              <Tag color="blue">{record?.reference_code}</Tag>
              {record?.active !== undefined && (
                <Tag color={record.active ? "success" : "default"}>
                  {record.active ? (
                    <>
                      <CheckCircleOutlined /> Active
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined /> Inactive
                    </>
                  )}
                </Tag>
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
            <Descriptions.Item label="Supplier Name">
              <TextField value={record?.supplier} />
            </Descriptions.Item>
            <Descriptions.Item label="Product">
              <TextField value={record?.product || "-"} />
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <BooleanField
                value={record?.active}
                trueIcon={<CheckCircleOutlined />}
                falseIcon={<CloseCircleOutlined />}
                valueLabelTrue="Active"
                valueLabelFalse="Inactive"
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Location Information */}
        <Card title="Location">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Country/Region">
              <TextField value={record?.country_region || "-"} />
            </Descriptions.Item>
            <Descriptions.Item label="Province/State">
              <TextField value={record?.province_state || "-"} />
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              <TextField value={record?.address || "-"} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Contact Person">
              <TextField value={record?.contact_person || "-"} />
            </Descriptions.Item>
            <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
              {record?.contact_number ? (
                <a href={`tel:${record.contact_number}`}>
                  {record.contact_number}
                </a>
              ) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {record?.email ? (
                <EmailField value={record.email} />
              ) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={<><GlobalOutlined /> Website</>}>
              {record?.website ? (
                <UrlField value={record.website} />
              ) : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Additional Notes */}
        {record?.comments && (
          <Card title="Additional Notes">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Comments">
                <TextField value={record.comments} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Metadata */}
        <Card title="Metadata" size="small">
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Created At">
              {record?.created_at ? (
                <DateField value={record.created_at} format="YYYY-MM-DD HH:mm:ss" />
              ) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {record?.updated_at ? (
                <DateField value={record.updated_at} format="YYYY-MM-DD HH:mm:ss" />
              ) : "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Show>
  );
};
