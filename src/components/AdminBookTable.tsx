import { JSX, useState } from "react";
import { Table, Tag, Input, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, ColumnType, TableProps } from "antd/es/table";
import { Book, Category } from "../types";
import { FilterConfirmProps, Key } from "antd/es/table/interface";

interface AdminBookTableProps {
  data: Book[];
  loading?: boolean;
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  enableRowSelection?: boolean;
  onEdit?: (bookKey: string) => void;
  onPageChange: (page: number, pageSize: number) => void; // Add this prop for dynamic pagination
  total: number; // Total number of books
}

export default function AdminBookTable({
  data,
  loading = false,
  selectedRowKeys,
  setSelectedRowKeys,
  enableRowSelection = false,
  onEdit,
  onPageChange,
  total,
}: Readonly<AdminBookTableProps>): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Book
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: keyof Book): ColumnType<Book> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="p-2">
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters!)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return typeof value === "string" && recordValue
        ? recordValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
  });

  const columns: ColumnsType<Book> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps("title"),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
      ...getColumnSearchProps("author"),
    },
    {
      title: "Edition",
      dataIndex: "editionNumber",
      key: "editionNumber",
      sorter: (a, b) => a.editionNumber - b.editionNumber,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      filters: Array.from(
        new Map(
          data
            .flatMap((b) => b.categories || []) // safeguard against undefined
            .filter((cat): cat is Category => !!cat && !!cat.name) // filter out undefined/null or missing name
            .map((cat) => [cat.name, cat])
        ).values()
      ).map((cat) => ({
        text: cat.name,
        value: cat.name,
      })),

      onFilter: (value, record) =>
        record.categories.some((cat) => cat.name === value),
      render: (categories: Category[] = []) => {
        const validCategories = categories.filter(cat => !!cat && !!cat.name);
        return validCategories.length > 0 ? (
          <>
            {validCategories.map(cat => (
              <Tag color="blue" key={cat.id || cat.name}>
                {cat.name}
              </Tag>
            ))}
          </>
        ) : (
          <span style={{ color: '#999' }}>No categories</span>
        );
      },
      
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => (
        <Tag color={quantity > 0 ? "green" : "red"}>
          {quantity > 0 ? `${quantity} Available` : "Out of Stock"}
        </Tag>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Availability",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? "green" : "volcano"}>
          {isAvailable ? "On" : "Off"}
        </Tag>
      ),
      filters: [
        { text: "On", value: true },
        { text: "Off", value: false },
      ],
      onFilter: (value, record) => record.isAvailable === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => onEdit?.(record.key)} type="link">
          Edit
        </Button>
      ),
    },
  ];

  const rowSelection: TableProps<Book>["rowSelection"] =
    enableRowSelection && selectedRowKeys && setSelectedRowKeys
      ? {
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }
      : undefined;

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      loading={loading}
      bordered
      scroll={{ x: "max-content" }}
      pagination={{
        total, // Total number of books
        pageSize: 5,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} books`,
        onChange: (page, pageSize) => onPageChange(page, pageSize),
      }}
    />
  );
}
