import { Dispatch, Key, SetStateAction } from "react";
import { Table, Tag, Button, Input, Space } from "antd";
import { Book, Category, DataIndex } from "../types";
import { ColumnsType, TableProps } from "antd/es/table";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

export default function BookTable({
  data,
  loading = false,
  selectedRowKeys,
  setSelectedRowKeys,
  total,
  onPageChange,
}: Readonly<{
  data: Book[];
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  setSelectedRowKeys?: Dispatch<SetStateAction<React.Key[]>>;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
}>): React.ReactElement {
  const onSelectChange = (newSelectedRowKeys: Key[]): void => {
    if (setSelectedRowKeys) {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const rowSelection: TableProps<Book>["rowSelection"] =
    selectedRowKeys && setSelectedRowKeys
      ? {
          selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: (record: Book) => ({
            disabled: record.quantity === 0,
          }),
        }
      : undefined;

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ): void => {
    confirm();
  };

  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Book> => ({
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
          className="mb-2 block"
          style={{ width: 188 }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            className="bg-blue-600"
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
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: boolean | Key, record: Book): boolean => {
      if (typeof value === "string" && dataIndex !== "categories") {
        return record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : false;
      }
      return false;
    },
    render: (text) => text,
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
      title: "Edition Number",
      dataIndex: "editionNumber",
      key: "editionNumber",
      sorter: (a, b) => a.editionNumber - b.editionNumber,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
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
      filters: [
        { text: "Available", value: "available" },
        { text: "Out of Stock", value: "outofstock" },
      ],
      onFilter: (value: string | boolean | Key, record: Book): boolean => {
        if (value === "available") {
          return record.quantity > 0;
        }
        if (value === "outofstock") {
          return record.quantity === 0;
        }
        return false;
      },
    },
  ];

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      loading={loading}
      bordered
      scroll={{ x: "max-content" }}
      pagination={{
        total,
        pageSize: 5,
        showSizeChanger: false,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, pageSize) => onPageChange(page, pageSize),
      }}
    />
  );
}
