import React, { useEffect } from "react";
import { useForm } from "@refinedev/antd";
import { Modal, Form, Input, Row, Col, Button, Switch } from "antd";
import { Supplier } from "../../services/supabase";

const { TextArea } = Input;

interface EditModalProps {
  visible: boolean;
  recordId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
  mode: "edit" | "create";
}

export const SupplierEditModal: React.FC<EditModalProps> = ({
  visible,
  recordId,
  onCancel,
  onSuccess,
  mode,
}) => {
  const { formProps, saveButtonProps, queryResult } = useForm<Supplier>({
    resource: "suppliers",
    action: mode,
    id: mode === "edit" ? (recordId || undefined) : undefined,
    redirect: false,
    queryOptions: {
      enabled: mode === "edit" && !!recordId && visible,
    },
    onMutationSuccess: () => {
      console.log('✅ Save successful!');
      onSuccess();
    },
  });

  const supplierData = queryResult?.data?.data;

  // Initialize form with data when it loads (for edit mode)
  useEffect(() => {
    if (mode === "edit" && supplierData && formProps.form && visible) {
      console.log('📦 Initializing form with data:', supplierData);
      formProps.form.setFieldsValue(supplierData);
      console.log('✅ Form initialized');
    } else if (mode === "create" && formProps.form && visible) {
      // Set default values for create mode
      formProps.form.setFieldsValue({
        active: true,
        country_region: "China",
      });
    }
  }, [supplierData, formProps.form, visible, mode]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 SupplierEditModal State:', {
      mode,
      visible,
      recordId,
      hasData: !!supplierData,
      hasForm: !!formProps.form,
      isLoading: queryResult?.isLoading,
    });
  }, [mode, visible, recordId, supplierData, formProps.form, queryResult?.isLoading]);

  // Dark theme styles
  const darkStyles = {
    label: {
      color: '#e0e0e0',
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '8px',
    },
    input: {
      backgroundColor: '#2a2a2a',
      borderColor: '#404040',
      color: '#ffffff',
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
          color: #e0e0e0 !important;
          background-color: #2a2a2a !important;
        }
        .ant-select-item-option-selected {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }
        .ant-select-item-option-active {
          background-color: #374151 !important;
        }
        /* Style for Select input text */
        .ant-select-selection-item {
          color: #e0e0e0 !important;
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
            {mode === "create" ? "Create New Supplier" : `Edit Supplier ${recordId ? `#${recordId}` : ''}`}
          </span>
        }
      >
        <Form {...formProps} layout="vertical" key={recordId || 'create'}>
          <Row gutter={24}>
            {/* Left Column */}
            <Col span={12}>
              {/* Basic Information */}
              <div style={darkStyles.section}>
                <div style={darkStyles.sectionTitle}>Basic Information</div>

                <Form.Item
                  label={<span style={darkStyles.label}>Reference Code</span>}
                  name="reference_code"
                  rules={[{ required: true, message: "Please enter reference code" }]}
                >
                  <Input
                    style={darkStyles.input}
                    placeholder="e.g., I265"
                    disabled={mode === "edit"}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Supplier Name</span>}
                  name="supplier"
                  rules={[{ required: true, message: "Please enter supplier name" }]}
                >
                  <Input style={darkStyles.input} placeholder="Company name" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Product</span>}
                  name="product"
                >
                  <Input style={darkStyles.input} placeholder="Product description" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Active</span>}
                  name="active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>

              {/* Contact Information */}
              <div style={darkStyles.section}>
                <div style={darkStyles.sectionTitle}>Contact Information</div>

                <Form.Item
                  label={<span style={darkStyles.label}>Contact Person</span>}
                  name="contact_person"
                >
                  <Input style={darkStyles.input} placeholder="Contact name" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Email</span>}
                  name="email"
                  rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                >
                  <Input style={darkStyles.input} placeholder="email@example.com" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Phone</span>}
                  name="contact_number"
                >
                  <Input style={darkStyles.input} placeholder="+86 123 4567 8900" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Website</span>}
                  name="website"
                >
                  <Input style={darkStyles.input} placeholder="https://example.com" />
                </Form.Item>
              </div>
            </Col>

            {/* Right Column */}
            <Col span={12}>
              {/* Location Information */}
              <div style={darkStyles.section}>
                <div style={darkStyles.sectionTitle}>Location Information</div>

                <Form.Item
                  label={<span style={darkStyles.label}>Country</span>}
                  name="country_region"
                >
                  <Input style={darkStyles.input} placeholder="China" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Province/State</span>}
                  name="province_state"
                >
                  <Input style={darkStyles.input} placeholder="Guangdong" />
                </Form.Item>

                <Form.Item
                  label={<span style={darkStyles.label}>Address</span>}
                  name="address"
                >
                  <TextArea
                    rows={3}
                    style={{ ...darkStyles.input, resize: 'vertical' }}
                    placeholder="Full address"
                  />
                </Form.Item>
              </div>

              {/* Additional Information */}
              <div style={darkStyles.section}>
                <div style={darkStyles.sectionTitle}>Additional Information</div>

                <Form.Item
                  label={<span style={darkStyles.label}>Comments</span>}
                  name="comments"
                >
                  <TextArea
                    rows={5}
                    style={{ ...darkStyles.input, resize: 'vertical' }}
                    placeholder="Additional notes or comments"
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
              {mode === "create" ? "Create Supplier" : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};



