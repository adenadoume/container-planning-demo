import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Row, Col, Card } from "antd";
import { Supplier } from "../../services/supabase";

const { TextArea } = Input;

export const SuppliersCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<Supplier>({
    resource: "suppliers",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
                <Input placeholder="e.g., I265" />
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
                initialValue={true}
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
    </Create>
  );
};
