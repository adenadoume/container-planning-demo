import React, { useEffect, useState } from "react";
import { useForm } from "@refinedev/antd";
import { Modal, Form, Input, InputNumber, Select, DatePicker, Row, Col, Button, Typography } from "antd";
import dayjs from "dayjs";
import { ContainerItem, Supplier, supabase } from "../../services/supabase";

const { TextArea } = Input;
const { Text } = Typography;

interface EditModalProps {
  visible: boolean;
  recordId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ContainerItemEditModal: React.FC<EditModalProps> = ({
  visible,
  recordId,
  onCancel,
  onSuccess,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const { formProps, saveButtonProps, queryResult } = useForm<ContainerItem>({
    resource: "container_items",
    action: recordId ? "edit" : "create",
    id: recordId || undefined,
    redirect: false,
    queryOptions: {
      enabled: !!recordId && visible,
    },
    onMutationSuccess: () => {
      console.log('✅ Save successful!');
      // Reset form and selected supplier
      if (formProps.form) {
        formProps.form.resetFields();
      }
      setSelectedSupplier(null);
      onSuccess();
    },
  });

  const containerItemData = queryResult?.data?.data;

  // Fetch all suppliers when modal opens for creating
  useEffect(() => {
    if (visible && !recordId) {
      setLoadingSuppliers(true);
      supabase
        .from('suppliers')
        .select('*')
        .eq('active', true)
        .order('reference_code')
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching suppliers:', error);
          } else {
            setSuppliers(data || []);
          }
          setLoadingSuppliers(false);
        });
    }
    
    // Reset selected supplier when modal closes or opens
    if (!visible) {
      setSelectedSupplier(null);
    }
  }, [visible, recordId]);

  // Handle supplier selection
  const handleSupplierSelect = (referenceCode: string) => {
    const supplier = suppliers.find(s => s.reference_code === referenceCode);
    setSelectedSupplier(supplier || null);
    if (formProps.form && supplier) {
      formProps.form.setFieldsValue({
        reference_code: supplier.reference_code,
      });
    }
  };

  // Initialize form with data when it loads
  useEffect(() => {
    if (containerItemData && formProps.form && visible) {
      console.log('📦 Initializing form with data:', containerItemData);
      
      // Transform dates for Ant Design DatePicker
      const initialValues = {
        ...containerItemData,
        payment_date: containerItemData.payment_date ? dayjs(containerItemData.payment_date) : undefined,
        production_ready: containerItemData.production_ready ? dayjs(containerItemData.production_ready) : undefined,
      };
      
      formProps.form.setFieldsValue(initialValues);
      console.log('✅ Form initialized');
    }
  }, [containerItemData, formProps.form, visible]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 EditModal State:', {
      visible,
      recordId,
      hasData: !!containerItemData,
      hasForm: !!formProps.form,
      isLoading: queryResult?.isLoading,
    });
  }, [visible, recordId, containerItemData, formProps.form, queryResult?.isLoading]);

  const statusOptions = [
    { label: "READY TO SHIP", value: "READY TO SHIP" },
    { label: "AWAITING SUPPLIER", value: "AWAITING SUPPLIER" },
    { label: "NEED PAYMENT", value: "NEED PAYMENT" },
    { label: "NO ANSWER", value: "NO ANSWER" },
    { label: "PENDING", value: "PENDING" },
    { label: "IN PRODUCTION", value: "IN PRODUCTION" },
  ];

  const containerOptions = [
    { label: "DEMO-001 SOUTH (Port A)", value: "DEMO-001 SOUTH" },
    { label: "DEMO-002 NORTH (Port B)", value: "DEMO-002 NORTH" },
    { label: "DEMO-003 SOUTH", value: "DEMO-003 SOUTH" },
    { label: "DEMO-004 SOUTH", value: "DEMO-004 SOUTH" },
    { label: "DEMO-005 SOUTH", value: "DEMO-005 SOUTH" },
  ];

  // Dark theme styles
  const darkStyles = {
    modal: {
      backgroundColor: '#1a1a1a',
    },
    label: {
      color: '#e0e0e0',
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '8px',
    },
    input: {
      backgroundColor: '#2a2a2a',
      borderColor: '#404040',
      color: '#ffffff !important',
      fontSize: '16px',
      padding: '10px 12px',
      height: 'auto',
    },
    section: {
      backgroundColor: '#252525',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #404040',
    },
    sectionTitle: {
      color: '#60a5fa',
      fontSize: '20px',
      fontWeight: 700,
      marginBottom: '16px',
      borderBottom: '2px solid #404040',
      paddingBottom: '8px',
    },
  };

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    if (formProps.form) {
      try {
        await formProps.form.validateFields();
        console.log('✅ Validation passed, submitting form');
        formProps.form.submit();
      } catch (error) {
        console.error('❌ Validation failed:', error);
      }
    } else {
      console.error('❌ Form not available');
    }
  };

  return (
    <>
      <style>{`
        /* Dark Modal Styles */
        .dark-modal .ant-modal-content {
          background-color: #1a1a1a !important;
        }
        .dark-modal .ant-modal-header {
          background-color: #1a1a1a !important;
          border-bottom: 2px solid #404040 !important;
        }
        .dark-modal .ant-modal-body {
          background-color: #1a1a1a !important;
          padding: 24px !important;
        }
        .dark-modal .ant-modal-footer {
          background-color: #1a1a1a !important;
          border-top: 2px solid #404040 !important;
        }
        .dark-modal .ant-modal-title {
          color: #60a5fa !important;
        }
        .dark-modal .ant-modal-close {
          color: #e0e0e0 !important;
        }
        .dark-modal .ant-form-item-label > label {
          color: #e0e0e0 !important;
        }
        
        /* Style for Select dropdown options */
        .ant-select-dropdown {
          background-color: #2a2a2a !important;
        }
        .ant-select-item {
          color: #1a1a1a !important;
          background-color: #e0e0e0 !important;
        }
        .ant-select-item-option-selected {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }
        .ant-select-item-option-active {
          background-color: #60a5fa !important;
          color: #ffffff !important;
        }
        /* Style for Select input text - dark font */
        .dark-modal .ant-select-selection-item {
          color: #1a1a1a !important;
          font-weight: 500 !important;
        }
        .dark-modal .ant-select-selector {
          background-color: #e0e0e0 !important;
        }
        /* Style for DatePicker dropdown */
        .ant-picker-dropdown {
          background-color: #2a2a2a !important;
        }
        .ant-picker-panel {
          background-color: #2a2a2a !important;
        }
        .ant-picker-header {
          color: #e0e0e0 !important;
          border-bottom-color: #404040 !important;
        }
        .ant-picker-content th,
        .ant-picker-content td {
          color: #e0e0e0 !important;
        }
        .ant-picker-cell:hover .ant-picker-cell-inner {
          background-color: #374151 !important;
        }
        .ant-picker-cell-selected .ant-picker-cell-inner {
          background-color: #3b82f6 !important;
        }
        
        /* Input text should be white */
        .dark-modal .ant-input {
          color: #ffffff !important;
        }
        .dark-modal .ant-input-number-input {
          color: #ffffff !important;
        }
        .dark-modal .ant-input::placeholder {
          color: #9ca3af !important;
        }
        .dark-modal textarea.ant-input {
          color: #ffffff !important;
        }
      `}</style>
      <Modal
        open={visible}
        onCancel={onCancel}
        width={1200}
        footer={null}
        className="dark-modal"
        title={
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#60a5fa' }}>
            {recordId ? `Edit Container Item #${recordId}` : 'Add New Supplier'}
          </span>
        }
      >
        <Form {...formProps} layout="vertical" key={recordId}>
        <Row gutter={24}>
          {/* Left Column */}
          <Col span={12}>
            {/* Basic Information */}
            <div style={darkStyles.section}>
              <div style={darkStyles.sectionTitle}>Basic Information</div>

              <Form.Item
                label={<span style={darkStyles.label}>{recordId ? 'Reference Code' : 'Select Supplier'}</span>}
                name="reference_code"
                rules={[{ required: true, message: 'Please select a supplier' }]}
              >
                {recordId ? (
                  <Input
                    disabled
                    style={{ ...darkStyles.input, opacity: 0.6 }}
                  />
                ) : (
                  <Select
                    placeholder="Select supplier by code"
                    loading={loadingSuppliers}
                    onChange={handleSupplierSelect}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    style={{ width: '100%' }}
                    options={suppliers.map(s => ({
                      label: `${s.reference_code} - ${s.product}`,
                      value: s.reference_code,
                    }))}
                  />
                )}
              </Form.Item>

              {/* Display selected supplier info when creating */}
              {!recordId && selectedSupplier && (
                <div style={{
                  backgroundColor: '#2a2a2a',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #404040'
                }}>
                  <Text style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                    Supplier Information
                  </Text>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text style={{ color: '#9ca3af', fontSize: '14px' }}>Supplier: </Text>
                      <Text style={{ color: '#ffffff', fontSize: '14px' }}>{selectedSupplier.supplier}</Text>
                    </Col>
                    <Col span={12}>
                      <Text style={{ color: '#9ca3af', fontSize: '14px' }}>Product: </Text>
                      <Text style={{ color: '#ffffff', fontSize: '14px' }}>{selectedSupplier.product}</Text>
                    </Col>
                    {selectedSupplier.contact_person && (
                      <Col span={12}>
                        <Text style={{ color: '#9ca3af', fontSize: '14px' }}>Contact: </Text>
                        <Text style={{ color: '#ffffff', fontSize: '14px' }}>{selectedSupplier.contact_person}</Text>
                      </Col>
                    )}
                    {selectedSupplier.email && (
                      <Col span={12}>
                        <Text style={{ color: '#9ca3af', fontSize: '14px' }}>Email: </Text>
                        <Text style={{ color: '#60a5fa', fontSize: '14px' }}>{selectedSupplier.email}</Text>
                      </Col>
                    )}
                    {selectedSupplier.contact_number && (
                      <Col span={24}>
                        <Text style={{ color: '#9ca3af', fontSize: '14px' }}>Phone: </Text>
                        <Text style={{ color: '#ffffff', fontSize: '14px' }}>{selectedSupplier.contact_number}</Text>
                      </Col>
                    )}
                  </Row>
                </div>
              )}

              <Form.Item
                label={
                  <span style={{ ...darkStyles.label, color: '#fbbf24', fontSize: '20px' }}>
                    📦 Move to Container
                  </span>
                }
                name="container_name"
                rules={[{ required: true }]}
                help={
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    Select a container to move this item
                  </span>
                }
              >
                <Select
                  options={containerOptions}
                  size="large"
                  placeholder="Select container to move item"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#fbbf24',
                    color: '#e0e0e0',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={darkStyles.label}>Status</span>}
                name="status"
                rules={[{ required: true }]}
              >
                <Select
                  options={statusOptions}
                  size="large"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#404040',
                    color: '#e0e0e0',
                    fontSize: '16px',
                  }}
                />
              </Form.Item>

              <Form.Item label={<span style={darkStyles.label}>Client</span>} name="client">
                <Input style={darkStyles.input} />
              </Form.Item>
            </div>

            {/* Financial Details */}
            <div style={darkStyles.section}>
              <div style={darkStyles.sectionTitle}>Financial Details</div>

              <Form.Item
                label={<span style={darkStyles.label}>Product Cost (USD)</span>}
                name="product_cost"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ ...darkStyles.input, width: "100%" }}
                  prefix="$"
                />
              </Form.Item>

              <Form.Item label={<span style={darkStyles.label}>Price Terms</span>} name="price_terms">
                <Select
                  options={[
                    { label: "FOB", value: "FOB" },
                    { label: "FCA", value: "FCA" },
                    { label: "EXW", value: "EXW" },
                  ]}
                  size="large"
                  placeholder="Select price terms"
                  allowClear
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#404040',
                    color: '#e0e0e0',
                    fontSize: '16px',
                  }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<span style={darkStyles.label}>Payment (USD)</span>} name="payment">
                    <InputNumber
                      min={0}
                      step={0.01}
                      style={{ ...darkStyles.input, width: "100%" }}
                      prefix="$"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={<span style={darkStyles.label}>Payment Date</span>}
                    name="payment_date"
                    getValueProps={(value) => ({
                      value: value ? dayjs(value) : undefined,
                    })}
                    getValueFromEvent={(date) => {
                      return date ? date.format("YYYY-MM-DD") : null;
                    }}
                  >
                    <DatePicker
                      allowClear
                      style={{ ...darkStyles.input, width: "100%" }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {containerItemData?.remaining !== undefined && (
                <Form.Item label={<span style={darkStyles.label}>Remaining Balance</span>}>
                  <Input
                    value={`$${containerItemData.remaining.toLocaleString()}`}
                    disabled
                    style={{ ...darkStyles.input, fontWeight: "bold", color: "#ef4444", fontSize: "20px" }}
                  />
                </Form.Item>
              )}
            </div>
          </Col>

          {/* Right Column */}
          <Col span={12}>
            {/* Shipping Details */}
            <div style={darkStyles.section}>
              <div style={darkStyles.sectionTitle}>Shipping Details</div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={darkStyles.label}>CBM</span>}
                    name="cbm"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      step={0.1}
                      style={{ ...darkStyles.input, width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label={<span style={darkStyles.label}>Cartons</span>} name="cartons">
                    <InputNumber
                      min={0}
                      style={{ ...darkStyles.input, width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span style={darkStyles.label}>Gross Weight (kg)</span>} name="gross_weight">
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ ...darkStyles.input, width: "100%" }}
                />
              </Form.Item>
            </div>

            {/* Production Details */}
            <div style={darkStyles.section}>
              <div style={darkStyles.sectionTitle}>Production Details</div>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<span style={darkStyles.label}>Production Days</span>} name="production_days">
                    <InputNumber
                      min={0}
                      style={{ ...darkStyles.input, width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={<span style={darkStyles.label}>Production Ready</span>}
                    name="production_ready"
                    getValueProps={(value) => ({
                      value: value ? dayjs(value) : undefined,
                    })}
                    getValueFromEvent={(date) => {
                      return date ? date.format("YYYY-MM-DD") : null;
                    }}
                  >
                    <DatePicker
                      allowClear
                      style={{ ...darkStyles.input, width: "100%" }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span style={darkStyles.label}>Awaiting</span>} name="awaiting">
                <Select
                  mode="tags"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: '#404040',
                    color: '#e0e0e0',
                    fontSize: '16px',
                    width: "100%"
                  }}
                  size="large"
                  placeholder="Add items awaiting (press enter to add)"
                  tokenSeparators={[","]}
                />
              </Form.Item>
            </div>

            {/* Additional Information */}
            <div style={darkStyles.section}>
              <div style={darkStyles.sectionTitle}>Additional Information</div>

              <Form.Item label={<span style={darkStyles.label}>Address</span>} name="address">
                <TextArea
                  rows={2}
                  style={{ ...darkStyles.input, resize: 'vertical' }}
                />
              </Form.Item>

              <Form.Item label={<span style={darkStyles.label}>Remarks</span>} name="remarks">
                <TextArea
                  rows={3}
                  style={{ ...darkStyles.input, resize: 'vertical' }}
                />
              </Form.Item>

              <Form.Item label={<span style={darkStyles.label}>Need</span>} name="need">
                <Select
                  mode="multiple"
                  placeholder="Select items needed"
                  size="large"
                  options={[
                    { label: "PI", value: "PI" },
                    { label: "CI", value: "CI" },
                    { label: "PL", value: "PL" },
                    { label: "CE", value: "CE" },
                    { label: "PRODUCTION FOLLOWUP", value: "PRODUCTION FOLLOWUP" },
                    { label: "ENTYPO PARALAVIS", value: "ENTYPO PARALAVIS" },
                    { label: "CBM", value: "CBM" },
                  ]}
                  style={{
                    ...darkStyles.input,
                  }}
                  dropdownStyle={{
                    backgroundColor: '#2a2a2a',
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div style={{
          marginTop: '24px',
          textAlign: 'right',
          borderTop: '2px solid #404040',
          paddingTop: '20px'
        }}>
          <Button
            onClick={onCancel}
            size="large"
            style={{
              marginRight: '12px',
              fontSize: '18px',
              height: '48px',
              minWidth: '120px',
              backgroundColor: '#404040',
              borderColor: '#404040',
              color: '#ffffff',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            type="primary"
            size="large"
            loading={saveButtonProps.loading}
            style={{
              fontSize: '18px',
              height: '48px',
              minWidth: '120px',
              backgroundColor: '#22c55e',
              borderColor: '#22c55e',
            }}
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
    </>
  );
};
