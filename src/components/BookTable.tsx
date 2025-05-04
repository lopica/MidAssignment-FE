import { Dispatch, Key, SetStateAction } from "react";
import { Table, Tag, Button, Input, Space } from "antd";
import { Book, DataIndex } from "../types";
import { ColumnsType, TableProps } from "antd/es/table";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

export default function BookTable({
  data,
  loading = false,
  selectedRowKeys,
  setSelectedRowKeys
}: Readonly<{
  data: Book[];
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  setSelectedRowKeys?: Dispatch<SetStateAction<React.Key[]>>;
}>): React.ReactElement {
  const onSelectChange = (newSelectedRowKeys: Key[]): void => {
    if (setSelectedRowKeys) {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const rowSelection: TableProps<Book>["rowSelection"] = selectedRowKeys && setSelectedRowKeys
    ? {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record: Book) => ({
          disabled: record.quantity === 0, // Disable checkbox if quantity is 0
        }),
      }
    : undefined;  // If not provided, don't show row selection

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ): void => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
    // setSearchText("");
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
      render: (categories: string[]) => (
        <span>
          {categories.map((category) => (
            <Tag color="blue" key={category} className="mr-1 mb-1">
              {category}
            </Tag>
          ))}
        </span>
      ),
      filters: [
        { text: "Fiction", value: "Fiction" },
        { text: "Classic", value: "Classic" },
        { text: "Science Fiction", value: "Science Fiction" },
        { text: "Romance", value: "Romance" },
        { text: "Fantasy", value: "Fantasy" },
        { text: "Adventure", value: "Adventure" },
        { text: "Dystopian", value: "Dystopian" },
      ],
      onFilter: (value: boolean | Key, record: Book): boolean => {
        if (typeof value === "string") {
          return record.categories.includes(value);
        }
        return false;
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
      rowSelection={rowSelection} // This will be undefined if not provided
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 5,
        showSizeChanger: false,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: "max-content" }}
      loading={loading}
      bordered
    />
  );
}
