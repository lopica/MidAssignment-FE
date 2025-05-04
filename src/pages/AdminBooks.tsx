import React, { useState, Key } from "react";
import { Button, Modal, message, Form } from "antd";
import {
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import AdminBookTable from "../components/AdminBookTable";
import { DEFAULT_BOOKS } from "../constants";
import { Book } from "../types";
import AdminBookFormModal from "../components/AdminBookFormModal";

// Define the Book interface

// Sample data for demonstration
const data: Book[] = DEFAULT_BOOKS;

export default function AdminBooks(): React.ReactElement {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { confirm } = Modal;

  const handleEdit = (key: string): void => {
    const book = data.find((b) => b.key === key);
    if (book) {
      setEditingBook(book);
      setIsModalVisible(true);
      form.setFieldsValue(book);
    } else {
      message.error("Book not found");
    }
  };

  const handleCreate = (): void => {
    setEditingBook(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const toggleDeleteMode = (): void => {
    setDeleteMode(!deleteMode);
    setSelectedRowKeys([]);
  };

  const handleDelete = (): void => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one book to delete");
      return;
    }

    confirm({
      title: "Are you sure you want to delete these books?",
      icon: <ExclamationCircleOutlined />,
      content: `You are about to delete ${selectedRowKeys.length} books. This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Here you would typically call an API to delete the books
        message.success(`Deleted ${selectedRowKeys.length} books`);
        setSelectedRowKeys([]);
        setDeleteMode(false);
      },
      onCancel() {
        // User canceled, do nothing
      },
    });
  };

  const refreshData = (): void => {
    setLoading(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="">
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            onClick={refreshData}
            loading={loading}
            icon={<ReloadOutlined />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </Button>
          <Button
            type="primary"
            onClick={handleCreate}
            icon={<PlusOutlined />}
            className="bg-green-600 hover:bg-green-700"
          >
            Create Book
          </Button>
          {deleteMode ? (
            <>
              <Button
                type="primary"
                danger
                onClick={handleDelete}
                disabled={selectedRowKeys.length === 0}
              >
                Delete Selected ({selectedRowKeys.length})
              </Button>
              <Button onClick={toggleDeleteMode}>Cancel</Button>
            </>
          ) : (
            <Button danger onClick={toggleDeleteMode} icon={<DeleteOutlined />}>
              Delete Books
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <AdminBookTable
          data={data}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          enableRowSelection={deleteMode}
          onEdit={handleEdit}
        />
      </div>
      <AdminBookFormModal
        visible={isModalVisible}
        editingBook={editingBook}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBook(null);
        }}
        onSubmit={(values) => {
          if (editingBook) {
            message.success("Book updated successfully");
          } else {
            message.success("Book created successfully");
          }
          setIsModalVisible(false);
          setEditingBook(null);
          // TODO: Save values (API call or state update)
          console.log("Submitted values:", values);
        }}
      />
    </div>
  );
}
