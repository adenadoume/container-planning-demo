import React, { useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Row, Col, Card } from "antd";
import { useParams } from "react-router-dom";
import { Supplier } from "../../services/supabase";

const { TextArea } = Input;

export const SuppliersEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { formProps, saveButtonProps, queryResult } = useForm<Supplier>({
    resource: "suppliers",
    action: "edit",
    id: id,
  });

  console.log("Suppliers Edit - Query Result:", queryResult);
  console.log("Suppliers Edit - Form Props:", formProps);
  console.log("Suppliers Edit - Data:", queryResult?.data?.data);

  // Set form values when data is loaded
  useEffect(() => {
    if (queryResult?.data?.data && formProps.form) {
      console.log("Setting form fields:", queryResult.data.data);
      formProps.form.setFieldsValue(queryResult.data.data);
    }
  }, [queryResult?.data?.data, formProps.form]);

  const portOptions = [
    { label: "Shenzhen", value: "SHENZHEN" },
    { label: "Tianjin", value: "TIANJIN" },
  ];

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Basic Information" style={{ marginBottom: 16 }}>
              <Form.Item
                label="Reference Code"
                name="reference_code"
                rules={[
                  { required: true, message: "Please enter reference code" },
                  { pattern: /^I\d+$/, message: "Format: I followed by numbers (e.g., I265)" }
                ]}
              >
                <Input placeholder="e.g., I265" disabled />
              </Form.Item>

              <Form.Item
                label="Supplier Name"
                name="supplier"
                rules={[{ required: true, message: "Please enter supplier name" }]}
              >
                <Input placeholder="Supplier company name" />
              </Form.Item>

              <Form.Item label="Product" name="product">
                <Input placeholder="Main product category" />
              </Form.Item>

              <Form.Item
                label="Active"
                name="active"
                valuePropName="checked"
              >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Location" style={{ marginBottom: 16 }}>
              <Form.Item label="Country/Region" name="country_region">
                <Input placeholder="e.g., China" />
              </Form.Item>

              <Form.Item label="Province/State" name="province_state">
                <Input placeholder="e.g., Guangdong, Jiangsu" />
              </Form.Item>

              <Form.Item label="Port" name="port">
                <Select
                  options={portOptions}
                  placeholder="Select shipping port"
                  allowClear
                />
              </Form.Item>

              <Form.Item label="Address" name="address">
                <TextArea
                  rows={3}
                  placeholder="Full supplier address"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card title="Contact Information" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Contact Person" name="contact_person">
                <Input placeholder="Primary contact name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: "email", message: "Please enter valid email" }
                ]}
              >
                <Input placeholder="contact@supplier.com" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Phone" name="contact_number">
                <Input placeholder="+86 123 4567 8900" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Website" name="website">
            <Input placeholder="https://www.supplier.com" />
          </Form.Item>
        </Card>

        <Card title="Additional Notes">
          <Form.Item label="Comments" name="comments">
            <TextArea
              rows={4}
              placeholder="Additional notes, payment terms, special instructions, etc."
            />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
