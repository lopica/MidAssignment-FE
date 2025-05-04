import React from "react";
import { Table, Tag, Button, Select, Input, Space } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import { Book, Request, statusColors } from "../types";

const { Option } = Select;

type DataIndex = keyof Request;

interface AdminRequestTableProps {
  requests: Request[];
  onStatusChange: (key: string, newStatus: Request["status"]) => void;
  onViewBooks: (books: Book[]) => void;
}

export default function AdminRequestTable({
  requests,
  onStatusChange,
  onViewBooks,
}: Readonly<AdminRequestTableProps>) {
  const [searchText, setSearchText] = React.useState('');
  const [searchedColumn, setSearchedColumn] = React.useState('');

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Request> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<Request> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      ...getColumnSearchProps("key"),
    },
    {
      title: "Requestor",
      dataIndex: "requestor",
      key: "requestor",
      ...getColumnSearchProps("requestor"),
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sorter: (a, b) =>
        new Date(a.dateRequested).getTime() - new Date(b.dateRequested).getTime(),
    },
    {
      title: "Books",
      dataIndex: "books",
      key: "books",
      render: (books: Book[]) => (
        <Button type="link" size="small" onClick={() => onViewBooks(books)}>
          View Details
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Waiting", value: "waiting" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_status: Request["status"], record) => {
        const isFinal = record.status === "approved" || record.status === "rejected";
        return (
          <Select
            value={record.status}
            onChange={(value) => onStatusChange(record.key, value)}
            disabled={isFinal}
            style={{ width: 140 }}
          >
            <Option value="waiting">
              <Tag color={statusColors.waiting}>Waiting</Tag>
            </Option>
            <Option value="approved">
              <Tag color={statusColors.approved}>Approved</Tag>
            </Option>
            <Option value="rejected">
              <Tag color={statusColors.rejected}>Rejected</Tag>
            </Option>
          </Select>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={requests}
      rowKey="key"
      pagination={{
        pageSize: 5,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} requests`,
      }}
      scroll={{ x: "max-content" }}
      bordered
    />
  );
}
