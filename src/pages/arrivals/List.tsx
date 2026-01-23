import React, { useState } from "react";
import { useTable, DeleteButton } from "@refinedev/antd";
import { Table, Space, Button, Card, Typography, Upload, message, Select, DatePicker } from "antd";
import { DownloadOutlined, UploadOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { BaseRecord } from "@refinedev/core";
import { Arrival } from "../../services/supabase";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;

export const ArrivalsList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("ARRIVALS");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Arrival>>({});

  const views = ["DEMO-001 SOUTH", "DEMO-002 NORTH", "DEMO-003 SOUTH", "CHARTS", "API CONNECTIONS", "SUPPLIER LIST", "ARRIVALS"];

  // Handle view change navigation
  const handleViewChange = (value: string) => {
    setSelectedView(value);
    if (value === "CHARTS") {
      navigate("/charts");
    } else if (value === "API CONNECTIONS") {
      navigate("/api-connections");
    } else if (value === "SUPPLIER LIST") {
      navigate("/suppliers");
    } else if (value === "ARRIVALS") {
      navigate("/arrivals");
    } else if (value === "DEMO-001 SOUTH") {
      navigate("/container-items/DEMO-001");
    } else if (value === "DEMO-002 NORTH") {
      navigate("/container-items/DEMO-002");
    } else if (value === "DEMO-003 SOUTH") {
      navigate("/container-items/DEMO-003");
    }
  };

  const { tableProps, tableQueryResult } = useTable<Arrival>({
    resource: "arrivals",
    sorters: {
      initial: [
        {
          field: "container_code",
          order: "asc",
        },
      ],
    },
    pagination: {
      pageSize: 100,
    },
  });

  // Export to Excel function with formatting
  const handleExportExcel = async () => {
    const { data: allArrivals, error } = await supabase
      .from("arrivals")
      .select("*")
      .order("container_code", { ascending: true });

    if (error) {
      message.error("Failed to fetch arrivals for export");
      console.error(error);
      return;
    }

    if (!allArrivals || allArrivals.length === 0) {
      message.warning("No arrivals to export");
      return;
    }

    const exportData = allArrivals.map((item: any) => {
      const today = dayjs();
      const palerosDate = item.paleros;
      const piraeusDate = item.piraeus;

      let arvd = "-";
      if (palerosDate && (dayjs(palerosDate).isBefore(today, 'day') || dayjs(palerosDate).isSame(today, 'day'))) {
        arvd = "✓"; // At warehouse (green)
      } else if (piraeusDate && (dayjs(piraeusDate).isBefore(today, 'day') || dayjs(piraeusDate).isSame(today, 'day'))) {
        arvd = "✓"; // At Piraeus (yellow) - will show as checkmark in Excel
      }

      return {
        "Container Code": item.container_code,
        "Departure Port": item.departure_port || "",
        "B/L": item.bl || "",
        "REF": item.ref || "",
        "ETD": item.etd || "",
        "PIRAEUS": item.piraeus || "",
        "PALEROS": item.paleros || "",
        "ARVD": arvd,
      };
    });

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

    // Style header row
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

    // Alternating row colors
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
    if (!wb.Workbook) wb.Workbook = {};
    wb.Workbook.Views = [{ RTL: false, zoomScale: 150 } as any];

    XLSX.utils.book_append_sheet(wb, ws, "Arrivals");
    XLSX.writeFile(wb, `Arrivals-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Import from Excel function
  const handleImportExcel = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const items = jsonData.map((row: any) => ({
        container_code: row["Container Code"] || "",
        departure_port: row["Departure Port"] || null,
        bl: row["B/L"] || null,
        ref: row["REF"] || null,
        etd: row["ETD"] || null,
        piraeus: row["PIRAEUS"] || null,
        paleros: row["PALEROS"] || null,
      }));

      const { error } = await supabase
        .from("arrivals")
        .upsert(items, {
          onConflict: 'container_code',
          ignoreDuplicates: false
        });

      if (error) throw error;

      message.success(`Successfully imported/updated ${items.length} arrivals`);
      tableQueryResult?.refetch();
    } catch (error) {
      console.error("Import error:", error);
      message.error("Failed to import Excel file");
    }

    return false;
  };

  // Handle inline editing
  const handleSave = async (id: number) => {
    try {
      const { error } = await supabase
        .from("arrivals")
        .update(editingData)
        .eq("id", id);

      if (error) throw error;

      message.success("Updated successfully");
      setEditingId(null);
      setEditingData({});
      tableQueryResult?.refetch();
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update");
    }
  };

  // Add new arrival
  const handleAddNew = async () => {
    try {
      const newCode = prompt("Enter new container code:");
      if (!newCode) return;

      const { error } = await supabase
        .from("arrivals")
        .insert([{ container_code: newCode }]);

      if (error) throw error;

      message.success("Added new arrival");
      tableQueryResult?.refetch();
    } catch (error) {
      console.error("Add error:", error);
      message.error("Failed to add new arrival");
    }
  };

  // Check arrival status based on PIRAEUS and PALEROS dates
  const getArrivalStatus = (piraeusDate: string | null | undefined, palerosDate: string | null | undefined): 'not-arrived' | 'at-piraeus' | 'at-warehouse' => {
    const today = dayjs();

    // Check if arrived at Paleros (warehouse)
    if (palerosDate) {
      const paleros = dayjs(palerosDate);
      if (paleros.isBefore(today, 'day') || paleros.isSame(today, 'day')) {
        return 'at-warehouse'; // PALEROS date passed = arrived at warehouse (GREEN)
      }
    }

    // Check if arrived at Piraeus but not at warehouse
    if (piraeusDate) {
      const piraeus = dayjs(piraeusDate);
      if (piraeus.isBefore(today, 'day') || piraeus.isSame(today, 'day')) {
        return 'at-piraeus'; // PIRAEUS date passed but not at warehouse = at Piraeus (YELLOW)
      }
    }

    return 'not-arrived'; // Not arrived anywhere yet (BLUE/default colors)
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
        }
        .ant-btn:hover {
          background-color: #4b5563 !important;
          border-color: #6b7280 !important;
          color: #000000 !important;
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
        .editable-cell {
          padding: 4px !important;
        }
        .editable-cell input,
        .editable-cell .ant-picker {
          background-color: #2a2a2a !important;
          border-color: #404040 !important;
          color: #ffffff !important;
        }
      `}</style>
      <div style={{ background: "#1f2937", minHeight: "100vh", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={1} style={{ color: "white", marginBottom: "24px" }}>
            Container Loading - Arrivals
          </Title>

          <div style={{ marginBottom: "20px" }}>
            <Text style={{ color: "white", marginRight: "16px", fontSize: "16px" }}>
              Select View
            </Text>
            <Select
              value={selectedView}
              onChange={handleViewChange}
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

          <Space size="middle">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              size="large"
              style={{ backgroundColor: "#8b5cf6", borderColor: "#8b5cf6" }}
            >
              Add New Container
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
              style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
            >
              <span className="btn-text">Export</span>
            </Button>
            {import.meta.env.DEV && (
              <Upload
                accept=".xlsx,.xls"
                beforeUpload={handleImportExcel}
                showUploadList={false}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
                >
                  <span className="btn-text">Import</span>
                </Button>
              </Upload>
            )}
          </Space>
        </div>
        
        <style>{`
          /* Responsive button styles - keep text visible */
          @media (max-width: 768px) {
            .ant-btn {
              padding: 4px 8px !important;
              min-width: auto !important;
              height: auto !important;
              font-size: 12px !important;
            }
            .ant-btn .anticon {
              font-size: 14px !important;
            }
            .ant-space {
              gap: 6px !important;
            }
            .ant-space-item {
              margin: 0 !important;
            }
          }
          
          @media (max-width: 480px) {
            .ant-btn {
              padding: 4px 6px !important;
              font-size: 11px !important;
            }
            .ant-btn .anticon {
              font-size: 12px !important;
            }
            .ant-space {
              gap: 4px !important;
            }
          }
        `}</style>

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
              dataIndex="container_code"
              title="Container Code"
              sorter
              fixed="left"
              width={150}
              render={(value, record: any) => {
                const status = getArrivalStatus(record.piraeus, record.paleros);
                const color = status === 'at-warehouse' ? '#10b981' : (status === 'at-piraeus' ? '#fbbf24' : '#60a5fa');
                return editingId === record.id ? (
                  <input
                    value={editingData.container_code ?? value}
                    onChange={(e) => setEditingData({ ...editingData, container_code: e.target.value })}
                    style={{ width: '100%', background: '#2a2a2a', color: '#fff', border: '1px solid #404040', padding: '4px' }}
                  />
                ) : (
                  <Text style={{ color, fontSize: "16px", fontWeight: "600" }}>{value}</Text>
                );
              }}
            />

            <Table.Column
              dataIndex="departure_port"
              title="Departure Port"
              sorter
              width={180}
              render={(value, record: any) => (
                editingId === record.id ? (
                  <input
                    value={editingData.departure_port ?? value ?? ''}
                    onChange={(e) => setEditingData({ ...editingData, departure_port: e.target.value })}
                    style={{ width: '100%', background: '#2a2a2a', color: '#fff', border: '1px solid #404040', padding: '4px' }}
                  />
                ) : (
                  <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{value || "-"}</Text>
                )
              )}
            />

            <Table.Column
              dataIndex="bl"
              title="B/L"
              sorter
              width={150}
              render={(value, record: any) => (
                editingId === record.id ? (
                  <input
                    value={editingData.bl ?? value ?? ''}
                    onChange={(e) => setEditingData({ ...editingData, bl: e.target.value })}
                    style={{ width: '100%', background: '#2a2a2a', color: '#fff', border: '1px solid #404040', padding: '4px' }}
                  />
                ) : (
                  <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{value || "-"}</Text>
                )
              )}
            />

            <Table.Column
              dataIndex="ref"
              title="REF"
              sorter
              width={150}
              render={(value, record: any) => (
                editingId === record.id ? (
                  <input
                    value={editingData.ref ?? value ?? ''}
                    onChange={(e) => setEditingData({ ...editingData, ref: e.target.value })}
                    style={{ width: '100%', background: '#2a2a2a', color: '#fff', border: '1px solid #404040', padding: '4px' }}
                  />
                ) : (
                  <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{value || "-"}</Text>
                )
              )}
            />

            <Table.Column
              dataIndex="etd"
              title="ETD"
              sorter
              width={180}
              render={(value, record: any) => {
                const status = getArrivalStatus(record.piraeus, record.paleros);
                const color = status === 'at-warehouse' ? '#10b981' : (status === 'at-piraeus' ? '#fbbf24' : '#d1d5db');
                return editingId === record.id ? (
                  <DatePicker
                    value={editingData.etd ? dayjs(editingData.etd) : (value ? dayjs(value) : null)}
                    onChange={(date) => setEditingData({ ...editingData, etd: date ? date.format('YYYY-MM-DD') : undefined })}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <Text style={{ color, fontSize: "18px", fontWeight: "600" }}>{value ? dayjs(value).format('DD/MM/YYYY') : "-"}</Text>
                );
              }}
            />

            <Table.Column
              dataIndex="piraeus"
              title="PIRAEUS"
              sorter
              width={180}
              render={(value, record: any) => {
                const status = getArrivalStatus(record.piraeus, record.paleros);
                const color = status === 'at-warehouse' ? '#10b981' : (status === 'at-piraeus' ? '#fbbf24' : '#ef4444');
                return editingId === record.id ? (
                  <DatePicker
                    value={editingData.piraeus ? dayjs(editingData.piraeus) : (value ? dayjs(value) : null)}
                    onChange={(date) => setEditingData({ ...editingData, piraeus: date ? date.format('YYYY-MM-DD') : undefined })}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <Text style={{ color, fontSize: "18px", fontWeight: "600" }}>{value ? dayjs(value).format('DD/MM/YYYY') : "-"}</Text>
                );
              }}
            />

            <Table.Column
              dataIndex="paleros"
              title="PALEROS"
              sorter
              width={180}
              render={(value, record: any) => {
                const status = getArrivalStatus(record.piraeus, record.paleros);
                const color = status === 'at-warehouse' ? '#10b981' : (status === 'at-piraeus' ? '#fbbf24' : '#ef4444');
                return editingId === record.id ? (
                  <DatePicker
                    value={editingData.paleros ? dayjs(editingData.paleros) : (value ? dayjs(value) : null)}
                    onChange={(date) => setEditingData({ ...editingData, paleros: date ? date.format('YYYY-MM-DD') : undefined })}
                    style={{ width: '100%' }}
                  />
                ) : (
                  <Text style={{ color, fontSize: "18px", fontWeight: "600" }}>{value ? dayjs(value).format('DD/MM/YYYY') : "-"}</Text>
                );
              }}
            />

            <Table.Column
              title="ARVD"
              dataIndex="arvd"
              width={80}
              align="center"
              render={(_, record: any) => {
                const status = getArrivalStatus(record.piraeus, record.paleros);
                const symbol = status === 'at-warehouse' ? '✓' : (status === 'at-piraeus' ? '✓' : '-');
                const color = status === 'at-warehouse' ? '#10b981' : (status === 'at-piraeus' ? '#fbbf24' : '#374151');
                return (
                  <Text style={{
                    color,
                    fontSize: "24px",
                    fontWeight: "700"
                  }}>
                    {symbol}
                  </Text>
                );
              }}
            />

            <Table.Column
              title="Actions"
              dataIndex="actions"
              fixed="right"
              width={150}
              render={(_, record: BaseRecord) => (
                <Space size="small">
                  {editingId === record.id ? (
                    <>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleSave(record.id as number)}
                        style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingId(null);
                          setEditingData({});
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => {
                        setEditingId(record.id as number);
                        setEditingData(record as Arrival);
                      }}
                      style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
                    />
                  )}
                  {import.meta.env.DEV && (
                    <DeleteButton hideText size="small" recordItemId={record.id} resource="arrivals" />
                  )}
                </Space>
              )}
            />
          </Table>
        </Card>
      </div>
    </>
  );
};
