import React from "react";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  FilterDropdown,
} from "@refinedev/antd";
import { Table, Space, Tag, Input, Button, Typography } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import type { BaseRecord } from "@refinedev/core";
import { ContainerItem } from "../../services/supabase";
import * as XLSX from "xlsx";

const { Text } = Typography;

export const ContainerItemsList: React.FC = () => {
  const { tableProps } = useTable<ContainerItem>({
    resource: "container_items",
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
    filters: {
      permanent: [],
    },
    pagination: {
      pageSize: 20,
    },
  });

  // Export to Excel function (preserving your original logic)
  const handleExportExcel = async () => {
    const { dataSource } = tableProps;
    if (!dataSource) return;

    const exportData = dataSource.map((item: any) => ({
      "Reference Code": item.reference_code,
      "Supplier": item.supplier,
      "CBM": item.cbm,
      "Cartons": item.cartons,
      "Gross Weight": item.gross_weight,
      "Product Cost": item.product_cost,
      "Price Terms": item.price_terms || "",
      "Payment": item.payment || 0,
      "Remaining": item.remaining || item.product_cost,
      "Status": item.status,
      "Production Days": item.production_days,
      "Production Ready": item.production_ready || "",
      "Client": item.client || "",
      "Container": item.container_name,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Container Items");

    // Style header row
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4472C4" } },
      };
    }

    XLSX.writeFile(wb, `container-items-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <List
      title="Container Items"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
        </>
      )}
    >
      <Table 
        {...tableProps} 
        rowKey="id" 
        size="small"
        pagination={{
          ...tableProps.pagination,
          showTotal: undefined,
          showSizeChanger: false,
        }}
      >
        <Table.Column
          dataIndex="reference_code"
          title="Reference"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input
                placeholder="Search reference"
                prefix={<SearchOutlined />}
              />
            </FilterDropdown>
          )}
          render={(value) => <Text strong>{value}</Text>}
        />

        <Table.Column
          dataIndex="supplier"
          title="Supplier"
          sorter
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search supplier" prefix={<SearchOutlined />} />
            </FilterDropdown>
          )}
          ellipsis
        />

        <Table.Column
          dataIndex="container_name"
          title="Container"
          sorter
          filters={[
            { text: "I110.11 SOUTH", value: "I110.11 SOUTH" },
            { text: "I110.12 NORTH", value: "I110.12 NORTH" },
          ]}
          render={(value) => (
            <Tag color={value === "I110.11 SOUTH" ? "blue" : "green"}>
              {value}
            </Tag>
          )}
        />

        <Table.Column
          dataIndex="cbm"
          title="CBM"
          sorter
          align="right"
          render={(value) => value?.toFixed(2)}
        />

        <Table.Column
          dataIndex="product_cost"
          title="Product Cost"
          sorter
          align="right"
          render={(value) => (
            <Text>${value?.toLocaleString()}</Text>
          )}
        />

        <Table.Column
          dataIndex="price_terms"
          title="Price Terms"
          sorter
          align="center"
          render={(value) => (
            <Tag color={value === 'FOB' ? 'blue' : value === 'FCA' ? 'green' : 'orange'}>
              {value || '-'}
            </Tag>
          )}
        />

        <Table.Column
          dataIndex="payment"
          title="Payment"
          sorter
          align="right"
          render={(value) => (
            <Text type="secondary">${(value || 0).toLocaleString()}</Text>
          )}
        />

        <Table.Column
          dataIndex="remaining"
          title="Remaining"
          sorter
          align="right"
          render={(value) => (
            <Text type="danger">${(value || 0).toLocaleString()}</Text>
          )}
        />

        <Table.Column
          dataIndex="status"
          title="Status"
          sorter
          filters={[
            { text: "READY TO SHIP", value: "READY TO SHIP" },
            { text: "AWAITING SUPPLIER", value: "AWAITING SUPPLIER" },
            { text: "NEED PAYMENT", value: "NEED PAYMENT" },
            { text: "PENDING", value: "PENDING" },
            { text: "IN PRODUCTION", value: "IN PRODUCTION" },
            { text: "NO ANSWER", value: "NO ANSWER" },
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
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "6px 14px",
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
          dataIndex="production_days"
          title="Prod. Days"
          sorter
          align="center"
          render={(value) => value || "-"}
        />

        <Table.Column
          dataIndex="production_ready"
          title="Ready Date"
          sorter
          render={(value) => value || "-"}
        />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          fixed="right"
          render={(_, record: BaseRecord) => (
            <Space size="small">
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
