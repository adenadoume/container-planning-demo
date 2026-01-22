import React, { useState, useEffect } from "react";
import { useTable, DeleteButton } from "@refinedev/antd";
import { Table, Space, Tag, Button, Card, Typography, Upload, message, Select } from "antd";
import { DownloadOutlined, UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { BaseRecord } from "@refinedev/core";
import { Supplier } from "../../services/supabase";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import { SupplierEditModal } from "./EditModal";

const { Text, Title } = Typography;
const { Option } = Select;

export const SuppliersList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("SUPPLIER LIST");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "create">("edit");

  const views = ["DEMO-001 SOUTH", "DEMO-002 NORTH", "DEMO-003 SOUTH", "DEMO-004 SOUTH", "DEMO-005 SOUTH", "SUPPLIER LIST", "ARRIVALS", "ENTYPO PARALAVIS", "CHARTS", "API CONNECTIONS"];

  // Redirect when a different view is selected
  useEffect(() => {
    if (selectedView === "ARRIVALS") {
      navigate("/arrivals");
    } else if (selectedView === "ENTYPO PARALAVIS") {
      navigate("/entypo-paralavis");
    } else if (selectedView === "CHARTS") {
      navigate("/charts");
    } else if (selectedView === "API CONNECTIONS") {
      navigate("/api-connections");
    } else if (selectedView !== "SUPPLIER LIST") {
      navigate("/container-items");
    }
  }, [selectedView, navigate]);

  const { tableProps, tableQueryResult } = useTable<Supplier>({
    resource: "suppliers",
    sorters: {
      initial: [
        {
          field: "reference_code",
          order: "asc",
        },
      ],
    },
    pagination: {
      pageSize: 1000, // Show all suppliers (increased from 100)
    },
  });


  // Export to Excel function with formatting - fetches ALL suppliers
  const handleExportExcel = async () => {
    // Fetch ALL suppliers from database (not just current page)
    const { data: allSuppliers, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("reference_code", { ascending: true });

    if (error) {
      message.error("Failed to fetch suppliers for export");
      console.error(error);
      return;
    }

    if (!allSuppliers || allSuppliers.length === 0) {
      message.warning("No suppliers to export");
      return;
    }

    const exportData = allSuppliers.map((item: any) => ({
      "Reference Code": item.reference_code,
      "Supplier": item.supplier,
      "Product": item.product || "",
      "Port": item.port || "",
      "Province": item.province_state || "",
      "Contact Person": item.contact_person || "",
      "Email": item.email || "",
      "Phone": item.contact_number || "",
      "Address": item.address || "",
      "Website": item.website || "",
      "Country": item.country_region || "",
      "Comments": item.comments || "",
      "Active": item.active ? "Yes" : "No",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Get worksheet range
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

    // Auto-fit columns
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength + 2);
        }
      }
      colWidths.push({ wch: maxWidth });
    }
    ws['!cols'] = colWidths;

    // Freeze header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Border style
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    };

    // Style header row (row 0 - bold, centered, blue background, white font)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "4472C4" } },
        border: borderStyle,
      };
    }

    // Alternating row colors (light blue) starting from row 1 (data rows)
    for (let R = 1; R <= range.e.r; ++R) {
      const isEvenRow = (R - 1) % 2 === 0;
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = { v: "" };
        ws[cellAddress].s = {
          fill: { fgColor: { rgb: isEvenRow ? "DAEEF3" : "FFFFFF" } },
          border: borderStyle,
        };
      }
    }

    const wb = XLSX.utils.book_new();

    // Set workbook view with 150% zoom
    if (!wb.Workbook) wb.Workbook = {};
    wb.Workbook.Views = [{ RTL: false, zoomScale: 150 } as any];

    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, `Suppliers-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Import from Excel function
  const handleImportExcel = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Map Excel columns to database fields
      const items = jsonData.map((row: any) => ({
        reference_code: row["Reference Code"] || "",
        supplier: row["Supplier"] || "",
        product: row["Product"] || "",
        port: row["Port"] || "",
        province_state: row["Province"] || "",
        contact_person: row["Contact Person"] || "",
        email: row["Email"] || "",
        contact_number: row["Phone"] || "",
        address: row["Address"] || "",
        website: row["Website"] || "",
        country_region: row["Country"] || "",
        comments: row["Comments"] || "",
        active: row["Active"] === "Yes",
      }));

      // Upsert items into Supabase (insert new, update existing)
      const { error } = await supabase
        .from("suppliers")
        .upsert(items, {
          onConflict: 'reference_code',
          ignoreDuplicates: false
        });

      if (error) throw error;

      message.success(`Successfully imported/updated ${items.length} suppliers`);

      // Refresh table data
      if (tableProps.pagination && typeof tableProps.pagination !== 'boolean') {
        tableProps.pagination.onChange?.(1, tableProps.pagination.pageSize || 20);
      }
    } catch (error) {
      console.error("Import error:", error);
      message.error("Failed to import Excel file");
    }

    return false; // Prevent default upload behavior
  };

  return (
    <>
      <style>{`
        .table-row-dark-even {
          background-color: #1f2937 !important;
        }
        .table-row-dark-even:hover {
          background-color: #4b5563 !important;
        }
        .table-row-dark-odd {
          background-color: #111827 !important;
        }
        .table-row-dark-odd:hover {
          background-color: #4b5563 !important;
        }
        .ant-table-thead > tr > th {
          background-color: #111827 !important;
          border-bottom: 2px solid #4b5563 !important;
          color: #d1d5db !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }
        .ant-table-column-sorter {
          color: #d1d5db !important;
        }
        .ant-table-column-sorter-up.active,
        .ant-table-column-sorter-down.active {
          color: #60a5fa !important;
        }
        .ant-table-filter-trigger {
          color: #d1d5db !important;
        }
        .ant-table-filter-trigger:hover {
          color: #ffffff !important;
        }
        .ant-table-filter-trigger.active {
          color: #60a5fa !important;
        }
        .ant-table {
          background: transparent !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #374151 !important;
          background-color: inherit !important;
        }
        .ant-btn {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
          color: #d1d5db !important;
          cursor: pointer !important;
        }
        .ant-btn:hover {
          background-color: #4b5563 !important;
          border-color: #6b7280 !important;
          color: #000000 !important;
          cursor: pointer !important;
        }
        .ant-btn-primary {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
          color: white !important;
        }
        .ant-btn-primary:hover {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        .ant-pagination .ant-pagination-item {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
        .ant-pagination .ant-pagination-item a {
          color: #d1d5db !important;
        }
        .ant-pagination .ant-pagination-item-active {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
        }
        .ant-pagination .ant-pagination-item-active a {
          color: white !important;
        }
        .ant-pagination-prev button,
        .ant-pagination-next button {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
          color: #d1d5db !important;
        }
        .ant-pagination-disabled button {
          background-color: #1f2937 !important;
          color: #6b7280 !important;
        }
        .ant-tag {
          border-radius: 4px;
        }
      `}</style>
      <div style={{ background: "#1f2937", minHeight: "100vh", padding: "24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={1} style={{ color: "white", marginBottom: "24px" }}>
            Container Planning
          </Title>

          {/* View Selector */}
          <div style={{ marginBottom: "20px" }}>
            <Text style={{ color: "white", marginRight: "16px", fontSize: "16px" }}>
              Select Container
            </Text>
            <Select
              value={selectedView}
              onChange={setSelectedView}
              style={{ width: 300, fontSize: "18px" }}
              size="large"
            >
              {views.map(view => (
                <Option key={view} value={view}>
                  {view}
                </Option>
              ))}
            </Select>
          </div>

          {/* Action Buttons */}
          <Space size="middle">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModalMode("create");
                setEditingRecordId(null);
                setEditModalVisible(true);
              }}
              size="large"
              style={{ backgroundColor: "#8b5cf6", borderColor: "#8b5cf6" }}
            >
              Create New Supplier
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
              size="large"
              style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
            >
              Export to Excel
            </Button>
            {/* Import button only visible on localhost (development) */}
            {import.meta.env.DEV && (
              <Upload
                accept=".xlsx,.xls"
                beforeUpload={handleImportExcel}
                showUploadList={false}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  size="large"
                  style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
                >
                  Import from Excel
                </Button>
              </Upload>
            )}
          </Space>
        </div>

        {/* Data Table */}
        <Card style={{ background: "#111827", border: "1px solid #374151" }}>
          <Table
            {...tableProps}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "table-row-dark-even" : "table-row-dark-odd"
            }
            style={{ fontSize: "18px" }}
          >
            <Table.Column
              dataIndex="reference_code"
              title="Reference"
              fixed="left"
              width={120}
              render={(value) => (
                <Tag color="blue" style={{ fontSize: "14px", fontWeight: "600", color: "#1e40af" }}>
                  {value}
                </Tag>
              )}
            />

            <Table.Column
              dataIndex="supplier"
              title="Supplier Name"
              sorter
              width={350}
              render={(value) => <Text style={{ color: "white", fontSize: "16px" }}>{value}</Text>}
            />

            <Table.Column
              dataIndex="product"
              title="Product"
              sorter
              width={180}
              render={(value) => <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{value || "-"}</Text>}
            />

            <Table.Column
              dataIndex="port"
              title="Port"
              sorter
              filters={[
                { text: "Port A", value: "SHENZHEN" },
                { text: "Port B", value: "TIANJIN" },
              ]}
              render={(value) => {
                if (!value) return <Text style={{ color: "#6b7280" }}>-</Text>;
                const color = value === "SHENZHEN" ? "blue" : "green";
                return <Tag color={color}>{value}</Tag>;
              }}
            />

            <Table.Column
              dataIndex="province_state"
              title="Province"
              sorter
              ellipsis
              render={(value) => <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{value || "-"}</Text>}
            />

            <Table.Column
              dataIndex="contact_person"
              title="Contact Person"
              sorter
              render={(value) => <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{value || "-"}</Text>}
            />

            <Table.Column
              dataIndex="email"
              title="Email"
              sorter
              width={130}
              render={(value) =>
                value ? (
                  <a href={`mailto:${value}`} style={{ color: "#60a5fa", fontSize: "14px" }}>
                    {value}
                  </a>
                ) : (
                  <Text style={{ color: "#6b7280" }}>-</Text>
                )
              }
            />

            <Table.Column
              dataIndex="contact_number"
              title="Phone"
              sorter
              width={120}
              render={(value) =>
                value ? (
                  <a href={`tel:${value}`} style={{ color: "#60a5fa", fontSize: "14px" }}>
                    {value}
                  </a>
                ) : (
                  <Text style={{ color: "#6b7280" }}>-</Text>
                )
              }
            />

            <Table.Column
              dataIndex="address"
              title="Address"
              width={300}
              sorter
              render={(value) => <Text style={{ color: "#d1d5db", fontSize: "14px" }}>{value || "-"}</Text>}
            />

            <Table.Column
              dataIndex="website"
              title="Website"
              width={120}
              sorter
              render={(value) =>
                value ? (
                  <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", fontSize: "14px" }}>
                    {value}
                  </a>
                ) : (
                  <Text style={{ color: "#6b7280" }}>-</Text>
                )
              }
            />

            <Table.Column
              dataIndex="country_region"
              title="Country"
              sorter
              width={120}
              render={(value) => <Text style={{ color: "#d1d5db", fontSize: "14px" }}>{value || "-"}</Text>}
            />

            <Table.Column
              dataIndex="comments"
              title="Comments"
              sorter
              ellipsis
              render={(value) => <Text style={{ color: "#d1d5db", fontSize: "14px" }}>{value || "-"}</Text>}
            />

            <Table.Column
              dataIndex="active"
              title="Active"
              sorter
              filters={[
                { text: "Active", value: true },
                { text: "Inactive", value: false },
              ]}
              align="center"
              render={(value) =>
                value ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Active
                  </Tag>
                ) : (
                  <Tag icon={<CloseCircleOutlined />} color="error">
                    Inactive
                  </Tag>
                )
              }
            />

            <Table.Column
              title="Actions"
              dataIndex="actions"
              fixed="right"
              render={(_, record: BaseRecord) => (
                <Space size="small">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => {
                      setModalMode("edit");
                      setEditingRecordId(record.id as number);
                      setEditModalVisible(true);
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      borderColor: '#3b82f6',
                    }}
                  />
                  {/* Delete button only visible on localhost (development) */}
                  {import.meta.env.DEV && (
                    <DeleteButton hideText size="small" recordItemId={record.id} resource="suppliers" />
                  )}
                </Space>
              )}
            />
          </Table>
        </Card>
      </div>

      {/* Edit/Create Modal */}
      <SupplierEditModal
        visible={editModalVisible}
        recordId={editingRecordId}
        mode={modalMode}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingRecordId(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setEditingRecordId(null);
          tableQueryResult?.refetch();
        }}
      />
    </>
  );
};
