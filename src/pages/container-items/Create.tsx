import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, Card } from "antd";
import { ContainerItem } from "../../services/supabase";

const { TextArea } = Input;

export const ContainerItemsCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<ContainerItem>({
    resource: "container_items",
  });

  // Fetch suppliers for dropdown (available for future use)
  // const { selectProps: supplierSelectProps } = useSelect({
  //   resource: "suppliers",
  //   optionLabel: "supplier",
  //   optionValue: "reference_code",
  // });

  const statusOptions = [
    { label: "READY TO SHIP", value: "READY TO SHIP" },
    { label: "AWAITING SUPPLIER", value: "AWAITING SUPPLIER" },
    { label: "NEED PAYMENT", value: "NEED PAYMENT" },
    { label: "NO ANSWER", value: "NO ANSWER" },
    { label: "PENDING", value: "PENDING" },
    { label: "IN PRODUCTION", value: "IN PRODUCTION" },
  ];

  const containerOptions = [
    { label: "I110.11 SOUTH (Shenzhen)", value: "I110.11 SOUTH" },
    { label: "I110.12 NORTH (Tianjin)", value: "I110.12 NORTH" },
  ];

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Basic Information" style={{ marginBottom: 16 }}>
              <Form.Item
                label="Reference Code"
                name="reference_code"
                rules={[{ required: true, message: "Please enter reference code" }]}
              >
                <Input placeholder="e.g., I265" />
              </Form.Item>

              <Form.Item
                label="Supplier"
                name="supplier"
                rules={[{ required: true, message: "Please enter supplier name" }]}
              >
                <Input placeholder="Supplier company name" />
              </Form.Item>

              <Form.Item
                label="Container"
                name="container_name"
                rules={[{ required: true, message: "Please select container" }]}
              >
                <Select options={containerOptions} placeholder="Select container" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
                initialValue="PENDING"
              >
                <Select options={statusOptions} />
              </Form.Item>

              <Form.Item label="Client" name="client">
                <Input placeholder="Client name" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Shipping Details" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="CBM"
                    name="cbm"
                    rules={[{ required: true, message: "Please enter CBM" }]}
                    initialValue={0}
                  >
                    <InputNumber
                      min={0}
                      step={0.1}
                      style={{ width: "100%" }}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Cartons"
                    name="cartons"
                    initialValue={0}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Gross Weight (kg)"
                name="gross_weight"
                initialValue={0}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: "100%" }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Card title="Financial Details" style={{ marginBottom: 16 }}>
              <Form.Item
                label="Product Cost (USD)"
                name="product_cost"
                rules={[{ required: true, message: "Please enter product cost" }]}
                initialValue={0}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  prefix="$"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Payment (USD)"
                    name="payment"
                    initialValue={0}
                  >
                    <InputNumber
                      min={0}
                      step={0.01}
                      style={{ width: "100%" }}
                      placeholder="0.00"
                      prefix="$"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Payment Date" name="payment_date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Production Details" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Production Days"
                    name="production_days"
                    initialValue={0}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="0"
                      addonAfter="days"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Production Ready" name="production_ready">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Awaiting" name="awaiting" initialValue={[]}>
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Add items awaiting (press enter to add)"
                  tokenSeparators={[","]}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card title="Additional Information">
          <Form.Item label="Address" name="address">
            <TextArea rows={2} placeholder="Supplier address" />
          </Form.Item>

          <Form.Item label="Remarks" name="remarks">
            <TextArea rows={3} placeholder="Additional notes or remarks" />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
