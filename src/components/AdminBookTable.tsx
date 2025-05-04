// components/AdminBookTable.tsx
import { useState } from 'react';
import { Table, Tag, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { JSX, Key } from 'react';
import { Book } from '../types';

type DataIndex = keyof Book;

interface AdminBookTableProps {
  data: Book[];
  loading?: boolean;
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  enableRowSelection?: boolean;
  onEdit?: (bookKey: string) => void;
}

export default function AdminBookTable({
  data,
  loading = false,
  selectedRowKeys,
  setSelectedRowKeys,
  enableRowSelection = false,
  onEdit,
}: Readonly<AdminBookTableProps>): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Book> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-2">
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
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
          <Button onClick={() => handleReset(clearFilters!)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return typeof value === 'string' && recordValue
        ? recordValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
  });

  const columns: ColumnsType<Book> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
      ...getColumnSearchProps('author'),
    },
    {
      title: 'Edition',
      dataIndex: 'editionNumber',
      key: 'editionNumber',
      sorter: (a, b) => a.editionNumber - b.editionNumber,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      filters: Array.from(new Set(data.flatMap(b => b.categories))).map(cat => ({
        text: cat,
        value: cat,
      })),
      onFilter: (value, record) => record.categories.includes(value as string),
      render: categories => (
        <>
          {categories.map((cat : string) => (
            <Tag color="blue" key={cat}>
              {cat}
            </Tag>
          ))}
        </>
      ),
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => onEdit?.(record.key)} type="primary">
          Edit
        </Button>
      ),
    },
  ];

  const rowSelection: TableProps<Book>['rowSelection'] =
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
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 5,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} books`,
      }}
    />
  );
}
