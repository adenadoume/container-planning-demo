import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTable, DeleteButton } from "@refinedev/antd";
import { Table, Space, Tag, Button, Select, Card, Row, Col, Typography, Upload, message } from "antd";
import { DownloadOutlined, UploadOutlined, EditOutlined } from "@ant-design/icons";
import type { BaseRecord } from "@refinedev/core";
import { ContainerItem } from "../../services/supabase";
import { supabase } from "../../services/supabase";
import * as XLSX from "xlsx-js-style";
import { ContainerItemEditModal } from "./EditModal";

const { Text, Title } = Typography;
const { Option } = Select;

export const ContainerItemsListWithStats: React.FC = () => {
  const navigate = useNavigate();
  const { container } = useParams<{ container?: string }>();
  
  // Map URL params to full container names
  const containerMap: Record<string, string> = {
    'DEMO-001': 'DEMO-001 SOUTH',
    'DEMO-002': 'DEMO-002 NORTH',
    'DEMO-003': 'DEMO-003 SOUTH',
  };
  
  // Initialize with URL param or default
  const initialContainer = container && containerMap[container] 
    ? containerMap[container] 
    : "DEMO-001 SOUTH";
  
  const [selectedContainer, setSelectedContainer] = useState(initialContainer);
  const [suppliersMap, setSuppliersMap] = useState<Record<string, any>>({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  const containers = ["DEMO-001 SOUTH", "DEMO-002 NORTH", "DEMO-003 SOUTH", "CHARTS", "API CONNECTIONS", "SUPPLIER LIST", "ARRIVALS"];

  // Handle container change - update URL and state
  const handleContainerChange = (value: string) => {
    setSelectedContainer(value);

    // Update URL to match selection
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

  // Sync state with URL param changes
  useEffect(() => {
    if (container && containerMap[container]) {
      setSelectedContainer(containerMap[container]);
    }
  }, [container]);

  // Fetch all suppliers data
  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('reference_code, supplier, product, contact_person, email, contact_number, address');

      if (data && !error) {
        const map: Record<string, any> = {};
        data.forEach((supplier: any) => {
          map[supplier.reference_code] = supplier;
        });
        setSuppliersMap(map);
      }
    };
    fetchSuppliers();
  }, []);

  const { tableProps, tableQueryResult } = useTable<ContainerItem>({
    resource: "container_items",
    filters: {
      permanent: [
        {
          field: "container_name",
          operator: "eq",
          value: selectedContainer,
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "reference_code",
          order: "asc",
        },
      ],
    },
    pagination: {
      pageSize: 100,
    },
  });

  // DEBUG: Log everything
  console.log("=== FULL DEBUG ===");
  console.log("selectedContainer:", selectedContainer);
  console.log("tableQueryResult:", tableQueryResult);
  console.log("tableQueryResult.data:", tableQueryResult?.data);
  console.log("tableQueryResult.error:", tableQueryResult?.error);
  console.log("tableQueryResult.isLoading:", tableQueryResult?.isLoading);
  console.log("tableProps:", tableProps);
  console.log("tableProps.dataSource:", tableProps.dataSource);

  // Calculate statistics from table data
  const stats = useMemo(() => {
    const data = (tableProps.dataSource || []) as ContainerItem[];
    console.log("Stats - data length:", data.length);

    const totalCBM = data.reduce((sum, item) => sum + (item.cbm || 0), 0);

    const cbmReadyToShip = data
      .filter(item => item.status === "READY TO SHIP")
      .reduce((sum, item) => sum + (item.cbm || 0), 0);

    // CBM Awaiting Supplier = Total CBM - CBM Ready to Ship
    const cbmAwaitingSupplier = totalCBM - cbmReadyToShip;

    // Count suppliers where remaining balance > 0 (product cost - payment > 0)
    const needPaymentCount = data.filter(item => {
      const totalCostForItem = (item.product_cost || 0);
      const paymentForItem = item.payment || 0;
      return totalCostForItem - paymentForItem > 0;
    }).length;

    const totalProductCost = data.reduce((sum, item) => sum + (item.product_cost || 0), 0);
    // Total cost is product cost only (freight removed)
    const totalCost = totalProductCost;
    
    // Total payments
    const totalPayments = data.reduce((sum, item) => sum + (item.payment || 0), 0);
    
    // Remaining to pay = Total cost - Payments
    const remainingToPay = totalCost - totalPayments;

    const totalCartons = data.reduce((sum, item) => sum + (item.cartons || 0), 0);
    const totalGrossWeight = data.reduce((sum, item) => sum + (item.gross_weight || 0), 0);

    return {
      totalCBM,
      cbmReadyToShip,
      cbmAwaitingSupplier,
      needPaymentCount,
      totalCost, // Product cost + Freight (renamed for clarity)
      totalPayments,
      remainingToPay,
      totalCartons,
      totalGrossWeight,
    };
  }, [tableProps.dataSource]);

  // Export to Excel function with formatting
  const handleExportExcel = async () => {
    // Fetch ALL data for the selected container (not just paginated data)
    const { data: allData, error } = await supabase
      .from('container_items')
      .select('*')
      .eq('container_name', selectedContainer)
      .order('reference_code', { ascending: true });

    if (error) {
      console.error('Error fetching data for export:', error);
      return;
    }

    if (!allData || allData.length === 0) {
      console.warn('No data to export');
      return;
    }

    const dataSource = allData;

    // Helper function to format date to "20NOV25" style
    const formatProductionDate = (dateStr: string | null) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = date.getFullYear().toString().slice(-2);
      return `${day}${month}${year}`;
    };

    const exportData = dataSource.map((item: any) => {
      const supplier = suppliersMap[item.reference_code];
      const product = supplier?.product || "";
      // Avoid duplicate if product already starts with reference code
      const productUpper = product.toUpperCase();
      const productDisplay = product
        ? (productUpper.startsWith(item.reference_code)
            ? productUpper
            : `${item.reference_code} ${productUpper}`)
        : item.reference_code;
      return {
        "CODE": item.reference_code,
        "PRODUCT": productDisplay,
        "CBM": item.cbm,
        "STATUS": item.status,
        "PRODUCT COST": item.product_cost,
        "PAYMENT": item.payment || 0,
        "REMAINING": "", // Will be filled with formula
        "PROD. READY DATE": formatProductionDate(item.production_ready),
        "PRODUCTION DAYS": item.production_days,
        "REMARKS": item.remarks || "",
        "NEED": item.need ? item.need.join(", ") : "",
        "CONTACT": supplier?.contact_person || "",
        "EMAIL": supplier?.email || "",
        "PHONE": supplier?.contact_number || "",
        "SUPPLIER": supplier?.supplier || "",
        "ADDRESS": supplier?.address || "",
        "PRICE TERMS": item.price_terms || "",
      };
    });

    // Create worksheet starting from row 6 to leave space for summary box
    const ws = XLSX.utils.json_to_sheet(exportData, { origin: "A6" } as any);

    // Get the data row range to calculate last row
    const dataStartRow = 6;
    const dataEndRow = dataStartRow + exportData.length;

    // Add summary box at top (rows 1-4) with formulas
    // Column layout: A=CODE, B=PRODUCT, C=CBM, D=STATUS, E=PRODUCT COST, F=PAYMENT, G=REMAINING, H=PROD. READY DATE, I=PRODUCTION DAYS, J=REMARKS, K=NEED, L=CONTACT, M=EMAIL, N=PHONE, O=SUPPLIER, P=ADDRESS, Q=PRICE TERMS

    // Total CBM
    ws['A1'] = { v: 'Total CBM:', t: 's' };
    ws['A1'].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "left", vertical: "center" },
    };
    // Formula to sum CBM column (column C, starting at row 7)
    ws['B1'] = { f: `SUM(C7:C${dataEndRow})`, t: 'n' };
    ws['B1'].s = {
      font: { bold: true, sz: 14, color: { rgb: "0070C0" } },
      alignment: { horizontal: "right", vertical: "center" },
      numFmt: "0.00",
    };

    // Total Product Cost
    ws['A2'] = { v: 'Total Product Cost:', t: 's' };
    ws['A2'].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "left", vertical: "center" },
    };
    // Formula to sum Product Cost (column E)
    ws['B2'] = { f: `SUM(E7:E${dataEndRow})`, t: 'n' };
    ws['B2'].s = {
      font: { bold: true, sz: 14, color: { rgb: "00B050" } },
      alignment: { horizontal: "right", vertical: "center" },
      numFmt: "$#,##0.00",
    };

    // CBM Ready to Ship (conditional sum)
    ws['A3'] = { v: 'CBM Ready to Ship:', t: 's' };
    ws['A3'].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "left", vertical: "center" },
    };
    // Formula using SUMIF to sum CBM where status = "READY TO SHIP" (Status is column D)
    ws['B3'] = { f: `SUMIF(D7:D${dataEndRow},"READY TO SHIP",C7:C${dataEndRow})`, t: 'n' };
    ws['B3'].s = {
      font: { bold: true, sz: 14, color: { rgb: "00B050" } },
      alignment: { horizontal: "right", vertical: "center" },
      numFmt: "0.00",
    };

    // Remaining to Pay (sum of remaining column)
    ws['A4'] = { v: 'Remaining to Pay:', t: 's' };
    ws['A4'].s = {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "left", vertical: "center" },
    };
    // Formula to sum Remaining column (column G)
    ws['B4'] = { f: `SUM(G7:G${dataEndRow})`, t: 'n' };
    ws['B4'].s = {
      font: { bold: true, sz: 14, color: { rgb: "00B050" } },
      alignment: { horizontal: "right", vertical: "center" },
      numFmt: "$#,##0.00",
    };

    // Get worksheet range
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

    // Add formulas for Remaining column (Column G: Product Cost - Payment)
    // Remaining = Product Cost (E) - Payment (F)
    for (let R = 7; R <= dataEndRow; R++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R - 1, c: 6 }); // Column G (0-indexed = 6)
      ws[cellAddress] = { f: `E${R}-F${R}`, t: 'n' };
    }

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

    // Freeze header row (row 5 is the data header)
    ws['!freeze'] = { xSplit: 0, ySplit: 5 };

    // Border style
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    };

    // Style header row (row 6, index 5 - bold, centered, light gray background)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 5, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } },
        border: borderStyle,
      };
    }

    // Alternating row colors (light blue) starting from row 7 (data rows)
    for (let R = 6; R <= range.e.r; ++R) {
      const isEvenRow = (R - 6) % 2 === 0;
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

    XLSX.utils.book_append_sheet(wb, ws, "Container Items");
    XLSX.writeFile(wb, `${selectedContainer}-${new Date().toISOString().split('T')[0]}.xlsx`);
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
        container_name: selectedContainer,
        reference_code: row["Reference Code"] || "",
        supplier: row["Supplier"] || "",
        cbm: parseFloat(row["CBM"]) || 0,
        cartons: parseInt(row["Cartons"]) || 0,
        gross_weight: parseFloat(row["Gross Weight"]) || 0,
        product_cost: parseFloat(row["Product Cost"]) || 0,
        payment: parseFloat(row["Payment"]) || 0,
        status: row["Status"] || "Pending",
        production_days: parseInt(row["Production Days"]) || 0,
        production_ready: row["Production Ready"] || "",
        client: row["Client"] || "",
        awaiting: [],
      }));

      // Insert items into Supabase
      const { error } = await supabase
        .from("container_items")
        .insert(items);

      if (error) throw error;

      message.success(`Successfully imported ${items.length} items`);

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
          padding: 16px 12px !important;
          font-size: 18px !important;
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
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
          color: white !important;
        }
        .ant-btn-primary:hover {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
        }
        .ant-btn-dangerous {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
          color: white !important;
        }
        .ant-btn-dangerous:hover {
          background-color: #b91c1c !important;
          border-color: #b91c1c !important;
        }
        .ant-pagination {
          background-color: #111827 !important;
        }
        .ant-pagination .ant-pagination-item {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
        .ant-pagination .ant-pagination-item a {
          color: #d1d5db !important;
        }
        .ant-pagination .ant-pagination-item-active {
          background-color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }
        .ant-pagination .ant-pagination-item-active a {
          color: white !important;
        }

        /* Card hover animations */
        .stat-card-blue:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px 0 rgba(96, 165, 250, 0.5) !important;
        }
        .stat-card-green:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px 0 rgba(52, 211, 153, 0.5) !important;
        }
        .stat-card-orange:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px 0 rgba(251, 146, 60, 0.5) !important;
        }
        .stat-card-pink:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px 0 rgba(244, 114, 182, 0.5) !important;
        }
        .stat-card-cyan:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px 0 rgba(34, 211, 238, 0.5) !important;
        }
        .stat-card-white:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px 0 rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
      <div style={{ background: "#1f2937", minHeight: "100vh", padding: "24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Title level={1} style={{ color: "white", marginBottom: "24px", fontSize: "48px", fontWeight: "700" }}>
          Container Planning
        </Title>

        {/* Container Selector */}
        <div style={{ marginBottom: "20px" }}>
          <Text style={{ color: "white", marginRight: "16px", fontSize: "16px" }}>
            Select Container
          </Text>
          <Select
            value={selectedContainer}
            onChange={handleContainerChange}
            style={{ width: 300, fontSize: "18px" }}
            size="large"
          >
            {containers.map(container => (
              <Option key={container} value={container}>
                {container}
              </Option>
            ))}
          </Select>
        </div>

        {/* Export/Import Buttons */}
        <Space wrap size="small" style={{ marginBottom: "16px" }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
          >
            <span className="btn-text">Export</span>
          </Button>
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
        </Space>
        
        <style>{`
          /* Responsive button text */
          @media (max-width: 768px) {
            .btn-text {
              display: none !important;
            }
            .ant-btn {
              padding: 2px 6px !important;
              min-width: 28px !important;
              height: 28px !important;
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
              padding: 2px 4px !important;
              min-width: 24px !important;
              height: 24px !important;
            }
            .ant-btn .anticon {
              font-size: 12px !important;
            }
            .ant-space {
              gap: 4px !important;
            }
          }
        `}</style>
      </div>

      {/* Summary Boxes - Row 1 */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-blue"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(96, 165, 250, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>CBM</div>
            <div style={{ color: "#60a5fa", fontSize: "42px", fontWeight: "bold" }}>
              {stats.totalCBM.toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-white"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(255, 255, 255, 0.15)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>Cartons</div>
            <div style={{ color: "white", fontSize: "42px", fontWeight: "bold" }}>
              {stats.totalCartons}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-white"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(255, 255, 255, 0.15)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>Gross weight</div>
            <div style={{ color: "white", fontSize: "42px", fontWeight: "bold" }}>
              {stats.totalGrossWeight.toLocaleString("en-US")}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary Boxes - Row 2 */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-green"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(52, 211, 153, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>
              CBM Ready to ship
            </div>
            <div style={{ color: "#34d399", fontSize: "42px", fontWeight: "bold" }}>
              {stats.cbmReadyToShip.toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-orange"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(251, 146, 60, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>
              CBM Awaiting Supplier
            </div>
            <div style={{ color: "#fb923c", fontSize: "42px", fontWeight: "bold" }}>
              {stats.cbmAwaitingSupplier.toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-pink"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(244, 114, 182, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>
              Need Payment
            </div>
            <div style={{ color: "#f472b6", fontSize: "42px", fontWeight: "bold" }}>
              {stats.needPaymentCount}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary Boxes - Row 3 */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-cyan"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(34, 211, 238, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>
              Product cost (total)
            </div>
            <div style={{ color: "#22d3ee", fontSize: "42px", fontWeight: "bold" }}>
              ${Math.round(stats.totalCost).toLocaleString("en-US")}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-green"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(52, 211, 153, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>
              Payments
            </div>
            <div style={{ color: "#34d399", fontSize: "42px", fontWeight: "bold" }}>
              ${Math.round(stats.totalPayments).toLocaleString("en-US")}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            className="stat-card-pink"
            style={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px 0 rgba(244, 114, 182, 0.39)",
            }}
            hoverable
          >
            <div style={{ color: "white", fontSize: "16px", marginBottom: "12px", fontWeight: "500" }}>
              Remaining to pay
            </div>
            <div style={{ color: "#f472b6", fontSize: "42px", fontWeight: "bold" }}>
              ${Math.round(stats.remainingToPay).toLocaleString("en-US")}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Table */}
      <div
        style={{
          background: "linear-gradient(to right, #374151, #4b5563)",
          borderRadius: "12px",
          border: "1px solid #4b5563",
          overflow: "hidden",
        }}
      >
        {/* Add Supplier Button */}
        <div style={{ 
          padding: "12px 16px", 
          background: "#1f2937",
          borderBottom: "1px solid #4b5563",
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setEditingRecordId(null);
              setEditModalVisible(true);
            }}
            style={{
              fontSize: "12px",
              height: "28px",
              backgroundColor: "#10b981",
              borderColor: "#10b981",
            }}
          >
            + Add Supplier
          </Button>
        </div>

        <Table
          {...tableProps}
          rowKey="id"
          size="middle"
          style={{ fontSize: "18px" }}
          scroll={{ x: 'max-content' }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-dark-even" : "table-row-dark-odd"
          }
          pagination={{
            ...tableProps.pagination,
            style: { background: "#111827", padding: "16px" },
            showTotal: undefined,
            showSizeChanger: false,
          }}
        >
          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>CODE</span>}
            fixed="left"
            width={120}
            render={(value) => (
              <Tag color="blue" style={{ fontSize: "14px", fontWeight: "600", color: "#1e40af" }}>
                {value}
              </Tag>
            )}
          />

          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PRODUCT</span>}
            sorter
            width={350}
            render={(_, record: BaseRecord) => {
              const supplier = suppliersMap[record.reference_code];
              const product = supplier?.product || "";
              // Avoid duplicate if product already starts with reference code
              const productUpper = product.toUpperCase();
              const displayText = product
                ? (productUpper.startsWith(record.reference_code)
                    ? productUpper
                    : `${record.reference_code} ${productUpper}`)
                : record.reference_code;
              return <Text style={{ color: "#d1d5db", fontSize: "18px" }}>{displayText}</Text>;
            }}
          />

          <Table.Column
            dataIndex="cbm"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>CBM</span>}
            align="right"
            sorter
            render={(value) => (
              <Text strong style={{ color: "#22d3ee", fontSize: "18px" }}>
                {value?.toFixed(2)}
              </Text>
            )}
          />

          <Table.Column
            dataIndex="status"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>STATUS</span>}
            sorter
            filters={[
              { text: "READY TO SHIP", value: "READY TO SHIP" },
              { text: "AWAITING SUPPLIER", value: "AWAITING SUPPLIER" },
              { text: "NEED PAYMENT", value: "NEED PAYMENT" },
              { text: "NO ANSWER", value: "NO ANSWER" },
              { text: "PENDING", value: "PENDING" },
              { text: "IN PRODUCTION", value: "IN PRODUCTION" },
            ]}
            render={(value) => {
              const statusStyles: Record<string, { bg: string; color: string }> = {
                "READY TO SHIP": { bg: "#10b981", color: "#ffffff" },
                "AWAITING SUPPLIER": { bg: "#f59e0b", color: "#000000" },
                "NEED PAYMENT": { bg: "#ef4444", color: "#ffffff" },
                "NO ANSWER": { bg: "#6b7280", color: "#ffffff" },
                "PENDING": { bg: "#6b7280", color: "#ffffff" },
                "IN PRODUCTION": { bg: "#3b82f6", color: "#ffffff" },
              };
              const style = statusStyles[value] || { bg: "#6b7280", color: "#ffffff" };
              return (
                <Tag
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "6px 16px",
                    backgroundColor: style.bg,
                    color: style.color,
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {value}
                </Tag>
              );
            }}
          />

          <Table.Column
            dataIndex="product_cost"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PRODUCT COST</span>}
            align="right"
            sorter
            render={(value) => (
              <Text style={{ color: "white", fontSize: "18px" }}>
                ${value?.toLocaleString()}
              </Text>
            )}
          />

          <Table.Column
            dataIndex="payment"
            width={150}
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PAYMENT</span>}
            align="right"
            sorter
            render={(value) => {
              const hasNoPayment = !value || value === 0;
              return (
                <Text style={{
                  color: hasNoPayment ? "#f87171" : "#34d399",
                  fontSize: hasNoPayment ? "13px" : "18px",
                  backgroundColor: hasNoPayment ? "rgba(248, 113, 113, 0.25)" : "transparent",
                  padding: hasNoPayment ? "4px 8px" : "0",
                  borderRadius: hasNoPayment ? "4px" : "0",
                }}>
                  {hasNoPayment ? "NO PAYMENT" : `$${value?.toLocaleString()}`}
                </Text>
              );
            }}
          />

          <Table.Column
            dataIndex="remaining"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>REMAINING</span>}
            align="right"
            sorter
            render={(value) => (
              <Text style={{ color: value > 0 ? "#f87171" : "#34d399", fontSize: "18px", fontWeight: "bold" }}>
                ${value?.toLocaleString() || "0"}
              </Text>
            )}
          />

          <Table.Column
            dataIndex="production_ready"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PROD. READY DATE</span>}
            sorter
            render={(value) => {
              if (!value) return <Text style={{ color: "#6b7280", fontSize: "16px" }}>-</Text>;
              const date = new Date(value);
              const day = date.getDate().toString().padStart(2, '0');
              const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
              const year = date.getFullYear().toString().slice(-2);
              return <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{`${day}${month}${year}`}</Text>;
            }}
          />

          <Table.Column
            dataIndex="production_days"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PRODUCTION DAYS</span>}
            align="center"
            sorter
            render={(value) => (
              <Text style={{ color: "white", fontSize: "18px" }}>{value || "-"}</Text>
            )}
          />

          <Table.Column
            dataIndex="remarks"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>REMARKS</span>}
            sorter
            width={400}
            render={(value) => (
              <Text style={{
                color: "#d1d5db",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                display: "block",
                maxHeight: "60px",
                overflow: "auto"
              }}>{value || "-"}</Text>
            )}
          />

          <Table.Column
            dataIndex="need"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>NEED</span>}
            width={200}
            render={(value: string[] | null) => {
              if (!value || value.length === 0) {
                return <Text style={{ color: "#6b7280", fontSize: "14px" }}>-</Text>;
              }
              return (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {value.map((item, index) => (
                    <Tag
                      key={index}
                      style={{
                        fontSize: "12px",
                        padding: "2px 8px",
                        margin: "0",
                        backgroundColor: "#3b82f6",
                        color: "#ffffff",
                        border: "none",
                      }}
                    >
                      {item}
                    </Tag>
                  ))}
                </div>
              );
            }}
          />

          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>CONTACT</span>}
            ellipsis
            render={(_value, record: any) => {
              const supplier = suppliersMap[record.reference_code];
              return supplier?.contact_person ? (
                <Text style={{ color: "#d1d5db", fontSize: "16px" }}>{supplier.contact_person}</Text>
              ) : (
                <Text style={{ color: "#6b7280", fontSize: "16px" }}>-</Text>
              );
            }}
          />

          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>EMAIL</span>}
            ellipsis
            render={(_value, record: any) => {
              const supplier = suppliersMap[record.reference_code];
              return supplier?.email ? (
                <a href={`mailto:${supplier.email}`} style={{ color: "#60a5fa", fontSize: "14px" }}>
                  {supplier.email}
                </a>
              ) : (
                <Text style={{ color: "#6b7280", fontSize: "14px" }}>-</Text>
              );
            }}
          />

          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PHONE</span>}
            ellipsis
            render={(_value, record: any) => {
              const supplier = suppliersMap[record.reference_code];
              return supplier?.contact_number ? (
                <a href={`tel:${supplier.contact_number}`} style={{ color: "#60a5fa", fontSize: "14px" }}>
                  {supplier.contact_number}
                </a>
              ) : (
                <Text style={{ color: "#6b7280", fontSize: "14px" }}>-</Text>
              );
            }}
          />

          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>SUPPLIER</span>}
            ellipsis
            render={(_value, record: any) => {
              const supplier = suppliersMap[record.reference_code];
              return supplier?.supplier ? (
                <Text style={{ color: "#d1d5db", fontSize: "16px", fontWeight: 500 }}>{supplier.supplier}</Text>
              ) : (
                <Text style={{ color: "#6b7280", fontSize: "16px" }}>-</Text>
              );
            }}
          />

          <Table.Column
            dataIndex="reference_code"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>ADDRESS</span>}
            width={250}
            ellipsis
            render={(_value, record: any) => {
              const supplier = suppliersMap[record.reference_code];
              return supplier?.address ? (
                <Text style={{ color: "#d1d5db", fontSize: "14px" }}>{supplier.address}</Text>
              ) : (
                <Text style={{ color: "#6b7280", fontSize: "14px" }}>-</Text>
              );
            }}
          />

          <Table.Column
            dataIndex="price_terms"
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>PRICE TERMS</span>}
            align="center"
            sorter
            render={(value) => (
              <Tag
                style={{
                  fontSize: "16px",
                  padding: "4px 12px",
                  fontWeight: 600,
                }}
                color={value === 'FOB' ? 'blue' : value === 'FCA' ? 'green' : value === 'EXW' ? 'orange' : 'default'}
              >
                {value || '-'}
              </Tag>
            )}
          />

          <Table.Column
            title={<span style={{ fontSize: "16px", color: "#d1d5db" }}>ACTIONS</span>}
            dataIndex="actions"
            fixed="right"
            render={(_, record: BaseRecord) => (
              <Space size="small">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    setEditingRecordId(record.id as number);
                    setEditModalVisible(true);
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    borderColor: '#3b82f6',
                  }}
                />
                <DeleteButton hideText size="small" recordItemId={record.id} resource="container_items" />
              </Space>
            )}
          />
        </Table>
      </div>
    </div>

    <ContainerItemEditModal
      visible={editModalVisible}
      recordId={editingRecordId}
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
