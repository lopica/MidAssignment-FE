import React, { useState, useEffect, Key, useContext } from "react";
import { Button, Form, message } from "antd";
import { Book } from "../types";
import BookTable from "../components/BookTable";
import BorrowBookModal from "../components/BorrowBookModal";
import { getAllBooks } from "../apis/bookApi";
import { addRequest } from "../apis/requestApi";
import { StoreContext } from "../context/store";

export default function Books(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [data, setData] = useState<Book[]>([]);
  const [store] = useContext(StoreContext)

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const hasSelected = selectedRowKeys.length > 0;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const result = await getAllBooks(currentPage);
      console.log(result)
      // Add a unique key to each book
      const booksWithKey = result.data.map((book, index) => ({
        ...book,  // Spread the book properties
        key: String(book.id || index),  // Ensure key is a string
      }));

      setData(booksWithKey);  // Set the modified books with key
      setTotal(result.totalPage);  // Set the total number of books
    } catch (error) {
      message.error("Failed to fetch books.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBorrowClick = () => {
    const selectedBooks = data.filter((book) =>
      selectedRowKeys.includes(book.key)
    );

    if (selectedBooks.length === 0) {
      message.warning("Please select at least one book.");
      return;
    }

    setBorrowedBooks(selectedBooks);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    const dueDate = new Date(values.dueDate).toISOString();
  
    const requestPayload = {
      requestorId: store.userId, // Replace with real user ID from auth context/store
      dueDate,
      bookIds: borrowedBooks.map(book => book.id),
    };
  
    try {
      await addRequest(requestPayload);
      message.success("Books borrowed successfully.");
      setIsModalVisible(false);
      form.resetFields(); // Clear form
      setSelectedRowKeys([]); // Clear selection
    } catch (error) {
      message.error("Failed to borrow books.");
      console.error(error);
    }
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
          total={total}
          onPageChange={handlePageChange}
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
