import React, { useState, Key } from "react";
import { Button, Form } from "antd";
import { Book } from "../types";
import { DEFAULT_BOOKS } from "../constants";
import BookTable from "../components/BookTable";
import BorrowBookModal from "../components/BorrowBookModal";

const data: Book[] = DEFAULT_BOOKS;

export default function Books(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const hasSelected = selectedRowKeys.length > 0;

  const handleBorrowClick = () => {
    // Filter the selected books from the data
    const selectedBooks = data.filter((book) =>
      selectedRowKeys.includes(book.key)
    );
    setBorrowedBooks(selectedBooks);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = (values: any) => {
    const dueDate = new Date(values.dueDate); // Get the native JS Date object
    console.log("Borrowed Books:", borrowedBooks);
    console.log("Due Date:", dueDate);
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-4">
        <Button
          type="primary"
          className="bg-green-600 hover:bg-green-700"
          disabled={!hasSelected}
          onClick={handleBorrowClick}
        >
          Borrow ({selectedRowKeys.length})
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <BookTable
          data={data}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>

      <BorrowBookModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        form={form}
        borrowedBooks={borrowedBooks}
      />
    </div>
  );
}
