import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";
import { Book, Category } from "../types";

type AdminCategoryTableProps = {
  data: Category[];
  deletionMode: boolean;
  selectedRowKeys: Key[];
  onSelectionChange: (keys: Key[]) => void;
  onViewBooks: (categoryName: string, books: Book[]) => void;
  totalItems: number;
  onEditCategory: (category: Category) => void; 
  onPageChange: (page: number, pageSize: number) => void;
};

export default function AdminCategoryTable({
  data,
  deletionMode,
  selectedRowKeys,
  onSelectionChange,
  onViewBooks,
  totalItems,
  onEditCategory, 
  onPageChange
}: Readonly<AdminCategoryTableProps>) {
  const columns: ColumnsType<Category> = [
    {
      title: "Ordinal",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Books",
      dataIndex: "books",
      key: "books",
      render: (books: Book[], record) => (
        <Button type="link" onClick={() => onViewBooks(record.name, books)}>
          View Details
        </Button>
      ),
    },
    {
      title: "Action",
      render: (_text, record) => (
        <Button
          type="link"
          onClick={() => onEditCategory(record)} // Trigger the edit modal with the category
        >
          Edit
        </Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectionChange,
  };

  return (
    <Table
      rowSelection={deletionMode ? rowSelection : undefined}
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 5,
        total: totalItems,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} categories`,
      }}
      onChange={(pagination) => onPageChange(pagination.current!, pagination.pageSize!)}
      bordered
    />
  );
}
