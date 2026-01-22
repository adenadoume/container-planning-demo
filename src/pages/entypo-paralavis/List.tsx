import React, { useState } from "react";
import { useTable, useUpdate, useCreate, useDelete } from "@refinedev/core";
import { Table, Button, Typography, Space, InputNumber, Input, Select, message, Modal } from "antd";
import { DownloadOutlined, PlusOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { supabase } from "../../services/supabase";
import type { EntypoParalavis } from "../../services/supabase";
import XLSX from "xlsx-js-style";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const EntypoParaliavisList: React.FC = () => {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<EntypoParalavis>>({});
  const [selectedView, setSelectedView] = useState("ENTYPO PARALAVIS");

  const { tableQueryResult } = useTable<EntypoParalavis>({
    resource: "entypo_paralavis",
    sorters: {
      initial: [{ field: "row_number", order: "asc" }],
    },
  });

  const { mutate: update } = useUpdate();
  const { mutate: create } = useCreate();
  const { mutate: deleteRecord } = useDelete();

  const data = tableQueryResult?.data?.data || [];

  const views = [
    "DEMO-001 SOUTH",
    "DEMO-002 NORTH",
    "DEMO-003 SOUTH",
    "DEMO-004 SOUTH",
    "CHARTS",
    "API CONNECTIONS",
    "SUPPLIER LIST",
    "ARRIVALS"
  ];

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
    } else {
      const containerMap: Record<string, string> = {
        'DEMO-001 SOUTH': 'DEMO-001',
        'DEMO-002 NORTH': 'DEMO-002',
        'DEMO-003 SOUTH': 'DEMO-003',
        'DEMO-004 SOUTH': 'DEMO-004',
        'DEMO-005 SOUTH': 'DEMO-005',
      };
      const containerPath = containerMap[value];
      if (containerPath) {
        navigate(`/container-items/${containerPath}`);
      }
    }
  };

  const handleEdit = (record: EntypoParalavis) => {
    setEditingId(record.id!);
    setEditingData(record);
  };

  const handleSave = async () => {
    if (editingId) {
      update(
        {
          resource: "entypo_paralavis",
          id: editingId,
          values: editingData,
        },
        {
          onSuccess: () => {
            message.success("Updated successfully");
            setEditingId(null);
            setEditingData({});
            tableQueryResult.refetch();
          },
          onError: () => {
            message.error("Update failed");
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleAddNew = () => {
    Modal.confirm({
      title: "Add New Row",
      content: "Enter row number for the new entry:",
      onOk: () => {
        const maxRowNumber = data.reduce((max, item) => Math.max(max, item.row_number || 0), 0);
        const newRowNumber = maxRowNumber + 1;

        create(
          {
            resource: "entypo_paralavis",
            values: {
              row_number: newRowNumber,
              ship_to_forwarder: 1.09,
              multiplier_base: 1.09,
              multiplier_1: 2,
              multiplier_2: 2.5,
              multiplier_3: 3,
              multiplier_4: 3.5,
              price_with_vat: 4.5,
              profit_margin_1: 1,
              profit_margin_2: -0.4,
            },
          },
          {
            onSuccess: () => {
              message.success("New row added");
              tableQueryResult.refetch();
            },
            onError: () => {
              message.error("Failed to add new row");
            },
          }
        );
      },
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Delete Row",
      content: "Are you sure you want to delete this row?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteRecord(
          {
            resource: "entypo_paralavis",
            id,
          },
          {
            onSuccess: () => {
              message.success("Row deleted");
              tableQueryResult.refetch();
            },
            onError: () => {
              message.error("Failed to delete row");
            },
          }
        );
      },
    });
  };

  const handleExportExcel = async () => {
    try {
      const { data: exportData, error } = await supabase
        .from("entypo_paralavis")
        .select("*")
        .order("row_number");

      if (error) throw error;
      if (!exportData || exportData.length === 0) {
        message.warning("No data to export");
        return;
      }

      // Create empty worksheet
      const ws: XLSX.WorkSheet = {};

      // MANUALLY CREATE 3-ROW HEADERS WITH MERGED CELLS
      // Row 1: Main section headers
      ws['A1'] = { v: "No.", t: 's' };
      ws['B1'] = { v: "SUPPLIER", t: 's' };
      ws['F1'] = { v: "QTY (meters)", t: 's' };
      ws['G1'] = { v: "R", t: 's' };
      ws['H1'] = { v: "REMARKS PARALAVI", t: 's' };
      ws['I1'] = { v: "REMARKS", t: 's' };
      ws['J1'] = { v: "PICTURE ITEMS", t: 's' };
      ws['K1'] = { v: "AROMA", t: 's' };
      ws['P1'] = { v: "PHOTOGRAPHY", t: 's' };
      ws['Q1'] = { v: "L", t: 's' };
      ws['R1'] = { v: "W", t: 's' };
      ws['S1'] = { v: "H", t: 's' };
      ws['T1'] = { v: "Unit Price", t: 's' };
      ws['W1'] = { v: "TOTAL", t: 's' };
      ws['X1'] = { v: "TRANSPORT", t: 's' };
      ws['Y1'] = { v: "LANDED COST", t: 's' };
      ws['Z1'] = { v: "LANDED COST Q", t: 's' };
      ws['AA1'] = { v: "VAT", t: 's' };
      ws['AB1'] = { v: "LANDED WITH VAT", t: 's' };
      ws['AC1'] = { v: "PRICE TENTATIVE", t: 's' };
      ws['AG1'] = { v: "AROMA PRICE", t: 's' };

      // Row 2: Sub-headers
      ws['A2'] = { v: "", t: 's' };
      ws['B2'] = { v: "Description of Goods", t: 's' };
      ws['C2'] = { v: "Material", t: 's' };
      ws['D2'] = { v: "Color", t: 's' };
      ws['E2'] = { v: "SUPPLIER\nCODE", t: 's' };
      ws['F2'] = { v: "", t: 's' };
      ws['G2'] = { v: "", t: 's' };
      ws['H2'] = { v: "", t: 's' };
      ws['I2'] = { v: "", t: 's' };
      ws['J2'] = { v: "", t: 's' };
      ws['K2'] = { v: "AROMA\nCODE", t: 's' };
      ws['L2'] = { v: "AROMA\nDescription", t: 's' };
      ws['M2'] = { v: "CLIENT", t: 's' };
      ws['N2'] = { v: "PRICE\nEXISTING", t: 's' };
      ws['O2'] = { v: "NEW\nPRICE", t: 's' };
      ws['P2'] = { v: "", t: 's' };
      ws['Q2'] = { v: "", t: 's' };
      ws['R2'] = { v: "", t: 's' };
      ws['S2'] = { v: "", t: 's' };
      ws['T2'] = { v: "$", t: 's' };
      ws['U2'] = { v: "Ship to\nForwarder", t: 's' };
      ws['V2'] = { v: "1.09", t: 's' };
      ws['W2'] = { v: "", t: 's' };
      ws['X2'] = { v: "", t: 's' };
      ws['Y2'] = { v: "", t: 's' };
      ws['Z2'] = { v: "", t: 's' };
      ws['AA2'] = { v: "", t: 's' };
      ws['AB2'] = { v: "", t: 's' };
      ws['AC2'] = { v: "2", t: 's' };
      ws['AD2'] = { v: "2.5", t: 's' };
      ws['AE2'] = { v: "3", t: 's' };
      ws['AF2'] = { v: "3.5", t: 's' };
      ws['AG2'] = { v: "PRICE\nWITH\nVAT", t: 's' };
      ws['AH2'] = { v: "EXISTING\nPRICE", t: 's' };
      ws['AI2'] = { v: "GROSS PRICE\nΧΩΡΙΣ ΦΠΑ", t: 's' };
      ws['AJ2'] = { v: "PROPOSAL", t: 's' };
      ws['AK2'] = { v: "PROFIT\nMARGIN 1", t: 's' };

      // Row 3: (many cells merge with row 2)
      ws['A3'] = { v: "", t: 's' };
      ws['B3'] = { v: "", t: 's' };
      ws['C3'] = { v: "", t: 's' };
      ws['D3'] = { v: "", t: 's' };
      ws['E3'] = { v: "", t: 's' };
      ws['F3'] = { v: "", t: 's' };
      ws['G3'] = { v: "", t: 's' };
      ws['H3'] = { v: "", t: 's' };
      ws['I3'] = { v: "", t: 's' };
      ws['J3'] = { v: "", t: 's' };
      ws['K3'] = { v: "", t: 's' };
      ws['L3'] = { v: "", t: 's' };
      ws['M3'] = { v: "", t: 's' };
      ws['N3'] = { v: "", t: 's' };
      ws['O3'] = { v: "", t: 's' };
      ws['P3'] = { v: "", t: 's' };
      ws['Q3'] = { v: "", t: 's' };
      ws['R3'] = { v: "", t: 's' };
      ws['S3'] = { v: "", t: 's' };
      ws['T3'] = { v: "", t: 's' };
      ws['U3'] = { v: "", t: 's' };
      ws['V3'] = { v: "", t: 's' };
      ws['W3'] = { v: "", t: 's' };
      ws['X3'] = { v: "", t: 's' };
      ws['Y3'] = { v: "", t: 's' };
      ws['Z3'] = { v: "", t: 's' };
      ws['AA3'] = { v: "", t: 's' };
      ws['AB3'] = { v: "", t: 's' };
      ws['AC3'] = { v: "2", t: 's' };
      ws['AD3'] = { v: "2.5", t: 's' };
      ws['AE3'] = { v: "3", t: 's' };
      ws['AF3'] = { v: "3.5", t: 's' };
      ws['AG3'] = { v: "4.5", t: 's' };
      ws['AH3'] = { v: "", t: 's' };
      ws['AI3'] = { v: "", t: 's' };
      ws['AJ3'] = { v: "", t: 's' };
      ws['AK3'] = { v: "", t: 's' };

      // Define 32 merged cell ranges
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } },  // A1:A3 (No.)
        { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } },  // B1:E1 (SUPPLIER)
        { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } },  // B2:B3 (Description of Goods)
        { s: { r: 1, c: 2 }, e: { r: 2, c: 2 } },  // C2:C3 (Material)
        { s: { r: 1, c: 3 }, e: { r: 2, c: 3 } },  // D2:D3 (Color)
        { s: { r: 0, c: 5 }, e: { r: 2, c: 5 } },  // F1:F3 (QTY meters)
        { s: { r: 0, c: 6 }, e: { r: 2, c: 6 } },  // G1:G3 (R)
        { s: { r: 0, c: 7 }, e: { r: 2, c: 7 } },  // H1:H3 (REMARKS PARALAVI)
        { s: { r: 0, c: 8 }, e: { r: 2, c: 8 } },  // I1:I3 (REMARKS)
        { s: { r: 0, c: 9 }, e: { r: 2, c: 9 } },  // J1:J3 (PICTURE ITEMS)
        { s: { r: 0, c: 10 }, e: { r: 0, c: 14 } }, // K1:O1 (AROMA)
        { s: { r: 1, c: 10 }, e: { r: 2, c: 10 } }, // K2:K3 (AROMA CODE)
        { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } }, // L2:L3 (AROMA Description)
        { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } }, // M2:M3 (CLIENT)
        { s: { r: 1, c: 13 }, e: { r: 2, c: 13 } }, // N2:N3 (PRICE EXISTING)
        { s: { r: 1, c: 14 }, e: { r: 2, c: 14 } }, // O2:O3 (NEW PRICE)
        { s: { r: 0, c: 15 }, e: { r: 2, c: 15 } }, // P1:P3 (PHOTOGRAPHY)
        { s: { r: 0, c: 16 }, e: { r: 2, c: 16 } }, // Q1:Q3 (L)
        { s: { r: 0, c: 17 }, e: { r: 2, c: 17 } }, // R1:R3 (W)
        { s: { r: 0, c: 18 }, e: { r: 2, c: 18 } }, // S1:S3 (H)
        { s: { r: 0, c: 19 }, e: { r: 0, c: 22 } }, // T1:W1 (Unit Price)
        { s: { r: 1, c: 19 }, e: { r: 2, c: 19 } }, // T2:T3 ($)
        { s: { r: 1, c: 20 }, e: { r: 2, c: 20 } }, // U2:U3 (Ship to Forwarder)
        { s: { r: 1, c: 21 }, e: { r: 2, c: 21 } }, // V2:V3 (1.09)
        { s: { r: 0, c: 22 }, e: { r: 2, c: 22 } }, // W1:W3 (TOTAL)
        { s: { r: 0, c: 23 }, e: { r: 2, c: 23 } }, // X1:X3 (TRANSPORT)
        { s: { r: 0, c: 24 }, e: { r: 2, c: 24 } }, // Y1:Y3 (LANDED COST)
        { s: { r: 0, c: 25 }, e: { r: 2, c: 25 } }, // Z1:Z3 (LANDED COST Q)
        { s: { r: 0, c: 26 }, e: { r: 2, c: 26 } }, // AA1:AA3 (VAT)
        { s: { r: 0, c: 27 }, e: { r: 2, c: 27 } }, // AB1:AB3 (LANDED WITH VAT)
        { s: { r: 0, c: 28 }, e: { r: 0, c: 31 } }, // AC1:AF1 (PRICE TENTATIVE)
        { s: { r: 0, c: 32 }, e: { r: 0, c: 36 } }, // AG1:AK1 (AROMA PRICE)
      ];

      // Convert data to array starting at row 4
      const dataStartRow = 4;
      exportData.forEach((item, idx) => {
        const rowIndex = dataStartRow + idx;

        // Column A: Row Number
        ws[`A${rowIndex}`] = { v: item.row_number, t: 'n' };

        // SUPPLIER Section (B-E)
        ws[`B${rowIndex}`] = { v: item.description_of_goods || "", t: 's' };
        ws[`C${rowIndex}`] = { v: item.material || "", t: 's' };
        ws[`D${rowIndex}`] = { v: item.color || "", t: 's' };
        ws[`E${rowIndex}`] = { v: item.supplier_code || "", t: 's' };

        // Quantity & Remarks (F-I)
        ws[`F${rowIndex}`] = { v: item.qty_meters || "", t: item.qty_meters ? 'n' : 's' };
        ws[`G${rowIndex}`] = { v: item.r_field || "", t: 's' };
        ws[`H${rowIndex}`] = { v: item.remarks_paralavi || "", t: 's' };
        ws[`I${rowIndex}`] = { v: item.remarks || "", t: 's' };

        // Picture Items (J)
        ws[`J${rowIndex}`] = { v: item.picture_items || "", t: 's' };

        // AROMA Section (K-O)
        ws[`K${rowIndex}`] = { v: item.aroma_code || "", t: 's' };
        ws[`L${rowIndex}`] = { v: item.aroma_description || "", t: 's' };
        ws[`M${rowIndex}`] = { v: item.client || "", t: 's' };
        ws[`N${rowIndex}`] = { v: item.price_existing || "", t: item.price_existing ? 'n' : 's' };
        ws[`O${rowIndex}`] = { v: item.new_price || "", t: item.new_price ? 'n' : 's' };

        // Photography (P)
        ws[`P${rowIndex}`] = { v: item.photography || "", t: 's' };

        // Dimensions (Q-S)
        ws[`Q${rowIndex}`] = { v: item.length || "", t: item.length ? 'n' : 's' };
        ws[`R${rowIndex}`] = { v: item.width || "", t: item.width ? 'n' : 's' };
        ws[`S${rowIndex}`] = { v: item.height || "", t: item.height ? 'n' : 's' };

        // Pricing Base (T-V)
        ws[`T${rowIndex}`] = { v: item.price_usd || "", t: item.price_usd ? 'n' : 's' };
        ws[`U${rowIndex}`] = { v: item.ship_to_forwarder || 1.09, t: 'n' };
        ws[`V${rowIndex}`] = { v: item.multiplier_base || 1.09, t: 'n' };

        // FORMULAS for calculations
        const R = rowIndex;
        ws[`W${R}`] = { f: `T${R}*U${R}`, t: 'n' };  // Total = $ * Ship
        ws[`X${R}`] = { f: `0.47*F${R}`, t: 'n' };   // Transport = 0.47 * Qty
        ws[`Y${R}`] = { f: `W${R}+X${R}`, t: 'n' };  // Landed Cost = Total + Transport
        ws[`Z${R}`] = { f: `Y${R}*F${R}`, t: 'n' };  // Landed Cost Q = Landed * Qty
        ws[`AA${R}`] = { f: `Z${R}*0.24`, t: 'n' };  // VAT = 24%
        ws[`AB${R}`] = { f: `Z${R}+AA${R}`, t: 'n' }; // Landed with VAT

        // Price calculations with multipliers
        ws[`AC${R}`] = { f: `AB${R}*AC3`, t: 'n' };  // Price * Multiplier 1 (2)
        ws[`AD${R}`] = { f: `AB${R}*AD3`, t: 'n' };  // Price * Multiplier 2 (2.5)
        ws[`AE${R}`] = { f: `AB${R}*AE3`, t: 'n' };  // Price * Multiplier 3 (3)
        ws[`AF${R}`] = { f: `AB${R}*AF3`, t: 'n' };  // Price * Multiplier 4 (3.5)

        // AROMA prices
        ws[`AG${R}`] = { v: item.price_with_vat || 4.5, t: 'n' };
        ws[`AH${R}`] = { f: `N${R}*AG3`, t: 'n' };  // Existing price * 4.5
        ws[`AI${R}`] = { f: `AH${R}/1.24`, t: 'n' }; // Gross price without VAT
        ws[`AJ${R}`] = { v: item.proposal_price || "", t: item.proposal_price ? 'n' : 's' };
        ws[`AK${R}`] = { f: `(AJ${R}-AI${R})/AI${R}`, t: 'n' };  // Profit margin
      });

      // Set range
      const dataEndRow = dataStartRow + exportData.length - 1;
      ws['!ref'] = `A1:AK${dataEndRow}`;

      // STYLING
      const borderStyle = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };

      // Style header rows 1-3
      for (let R = 0; R < 3; R++) {
        for (let C = 0; C < 37; C++) {
          const addr = XLSX.utils.encode_cell({ r: R, c: C });
          if (ws[addr]) {
            ws[addr].s = {
              font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
              alignment: { horizontal: "center", vertical: "center", wrapText: true },
              fill: { fgColor: { rgb: "4472C4" } },  // Blue header
              border: borderStyle,
            };
          }
        }
      }

      // Alternating row colors for data
      for (let R = dataStartRow - 1; R < dataEndRow; R++) {
        const isEvenRow = (R - dataStartRow + 1) % 2 === 0;
        for (let C = 0; C < 37; C++) {
          const addr = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[addr]) ws[addr] = { v: "", t: 's' };
          ws[addr].s = {
            fill: { fgColor: { rgb: isEvenRow ? "DAEEF3" : "FFFFFF" } },
            border: borderStyle,
            alignment: { vertical: "center" },
          };
        }
      }

      // Column widths (match template)
      ws['!cols'] = [
        { wch: 4.67 },   // A: No.
        { wch: 30.17 },  // B: Description
        { wch: 8 },      // C: Material
        { wch: 11.67 },  // D: Color
        { wch: 10 },     // E: Supplier Code
        { wch: 8 },      // F: QTY
        { wch: 6 },      // G: R
        { wch: 15 },     // H: Remarks Paralavi
        { wch: 15 },     // I: Remarks
        { wch: 12 },     // J: Picture Items
        { wch: 10 },     // K: AROMA Code
        { wch: 20 },     // L: AROMA Description
        { wch: 12 },     // M: Client
        { wch: 10 },     // N: Price Existing
        { wch: 10 },     // O: New Price
        { wch: 12 },     // P: Photography
        { wch: 6 },      // Q: L
        { wch: 6 },      // R: W
        { wch: 6 },      // S: H
        { wch: 8 },      // T: $
        { wch: 10 },     // U: Ship to Forwarder
        { wch: 6 },      // V: 1.09
        { wch: 10 },     // W: TOTAL
        { wch: 10 },     // X: TRANSPORT
        { wch: 12 },     // Y: LANDED COST
        { wch: 12 },     // Z: LANDED COST Q
        { wch: 10 },     // AA: VAT
        { wch: 12 },     // AB: LANDED WITH VAT
        { wch: 10 },     // AC: Multiplier 1
        { wch: 10 },     // AD: Multiplier 2
        { wch: 10 },     // AE: Multiplier 3
        { wch: 10 },     // AF: Multiplier 4
        { wch: 10 },     // AG: Price with VAT
        { wch: 12 },     // AH: Existing Price
        { wch: 12 },     // AI: Gross Price
        { wch: 10 },     // AJ: Proposal
        { wch: 12 },     // AK: Profit Margin
      ];

      // Freeze panes (freeze first 3 header rows)
      ws['!freeze'] = { xSplit: 0, ySplit: 3 };

      // Create workbook
      const wb = XLSX.utils.book_new();
      wb.Workbook = { Views: [{ RTL: false }] };
      XLSX.utils.book_append_sheet(wb, ws, "ENTYPO PARALAVIS");

      // Export
      const fileName = `ENTYPO-PARALAVIS-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      message.success("Excel file exported successfully");
    } catch (error: any) {
      console.error("Export error:", error);
      message.error(`Export failed: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "Row",
      dataIndex: "row_number",
      key: "row_number",
      width: 60,
      sorter: true,
      render: (value: number) => <Text style={{ color: "#d1d5db" }}>{value}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description_of_goods",
      key: "description_of_goods",
      width: 200,
      render: (value: string, record: any) =>
        editingId === record.id ? (
          <Input
            value={editingData.description_of_goods}
            onChange={(e) => setEditingData({ ...editingData, description_of_goods: e.target.value })}
            style={{ width: "100%" }}
          />
        ) : (
          <Text style={{ color: "#d1d5db" }}>{value || "-"}</Text>
        ),
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
      width: 120,
      render: (value: string, record: any) =>
        editingId === record.id ? (
          <Input
            value={editingData.material}
            onChange={(e) => setEditingData({ ...editingData, material: e.target.value })}
          />
        ) : (
          <Text style={{ color: "#d1d5db" }}>{value || "-"}</Text>
        ),
    },
    {
      title: "Supplier Code",
      dataIndex: "supplier_code",
      key: "supplier_code",
      width: 120,
      render: (value: string, record: any) =>
        editingId === record.id ? (
          <Input
            value={editingData.supplier_code}
            onChange={(e) => setEditingData({ ...editingData, supplier_code: e.target.value })}
          />
        ) : (
          <Text style={{ color: "#d1d5db" }}>{value || "-"}</Text>
        ),
    },
    {
      title: "QTY (m)",
      dataIndex: "qty_meters",
      key: "qty_meters",
      width: 100,
      render: (value: number, record: any) =>
        editingId === record.id ? (
          <InputNumber
            value={editingData.qty_meters}
            onChange={(val) => setEditingData({ ...editingData, qty_meters: val || undefined })}
            style={{ width: "100%" }}
          />
        ) : (
          <Text style={{ color: "#d1d5db" }}>{value || "-"}</Text>
        ),
    },
    {
      title: "Price USD",
      dataIndex: "price_usd",
      key: "price_usd",
      width: 100,
      render: (value: number, record: any) =>
        editingId === record.id ? (
          <InputNumber
            value={editingData.price_usd}
            onChange={(val) => setEditingData({ ...editingData, price_usd: val || undefined })}
            style={{ width: "100%" }}
            prefix="$"
          />
        ) : (
          <Text style={{ color: "#d1d5db" }}>{value ? `$${value}` : "-"}</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          {editingId === record.id ? (
            <>
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => handleEdit(record)}
                style={{ color: "#60a5fa" }}
              >
                Edit
              </Button>
              {import.meta.env.DEV && (
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#1a1a1a", minHeight: "100vh" }}>
      <style>
        {`
          .ant-table-column-sorter {
            color: #d1d5db !important;
          }
          .ant-table-column-sorter-up.active,
          .ant-table-column-sorter-down.active {
            color: #60a5fa !important;
          }
        `}
      </style>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography.Title level={2} style={{ color: "#fff", margin: 0 }}>
            ENTYPO PARALAVIS
          </Typography.Title>
          <Select
            value={selectedView}
            onChange={handleViewChange}
            style={{ width: 200 }}
            options={views.map((view) => ({ label: view, value: view }))}
          />
        </div>

        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
          >
            Export to Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add New Row
          </Button>
        </Space>

        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 50 }}
          scroll={{ x: 1500 }}
          style={{
            background: "#262626",
          }}
          className="dark-theme-table"
        />
      </Space>
    </div>
  );
};
