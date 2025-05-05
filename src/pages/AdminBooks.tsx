import React, { useState, useEffect } from "react";
import { Button, Form, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminBookTable from "../components/AdminBookTable";
import { Book, CreateBookDto, UpdateBookDto } from "../types";
import { getAllBooks, addBook, updateBook, deleteBook } from "../apis/bookApi"; // Add the addBook API
import AdminBookFormModal from "../components/AdminBookFormModal";
import { Key } from "antd/es/table/interface";

export default function AdminBooks(): React.ReactElement {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalBooks, setTotalBooks] = useState<number>(0); // For total books count
  const [books, setBooks] = useState<Book[]>([]); // Book data to display
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();

  // Fetch books
  const fetchBooks = async (page: number) => {
    try {
      const res = await getAllBooks(page); // Fetch books with pagination
      setBooks(
        res.data.map((b) => ({
          ...b,
          key: b.id,
        }))
      );
      setTotalBooks(res.totalPage); // Set total books count from API response
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch books.");
    }
  };

  useEffect(() => {
    if (editingBook) {
      form.setFieldsValue({
        ...editingBook,
        categories: editingBook.categories.map((cat) => cat.id),
      });
    } else {
      form.resetFields();
    }
  }, [editingBook, form]);

  // Fetch books on page or pageSize change
  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page); // Update current page
    setPageSize(pageSize); // Update page size
  };

  // Handle creating a new book (opens modal)
  const handleCreate = (): void => {
    setEditingBook(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  useEffect(() => console.log(books), [books]);

  // Handle submitting the form from modal
  const handleSubmit = async (values: any) => {
    try {
      const categoryIds = values.categories;
      console.log(categoryIds);
      if (editingBook) {
        await updateBook(editingBook.id, {
          ...values,
          categoryIds,
        } as UpdateBookDto);
        message.success("Book updated successfully");
      } else {
        const requestData: CreateBookDto = {
          title: values.title,
          author: values.author,
          editionNumber: values.editionNumber,
          categoryIds,
        };
        await addBook(requestData);
        message.success("Book created successfully");
      }

      setIsModalVisible(false);
      setEditingBook(null);
      fetchBooks(currentPage);
    } catch (error) {
      console.error(error);
      message.error("Failed to save the book");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Book
        </Button>
        {deleteMode && (
          <>
            <Button
              danger
              onClick={() => {
                Modal.confirm({
                  title: "Are you sure you want to delete the selected books?",
                  content: `This action cannot be undone.`,
                  okText: "Yes, Delete",
                  okType: "danger",
                  cancelText: "Cancel",
                  onOk: async () => {
                    try {
                      await Promise.all(
                        selectedRowKeys.map((id) => deleteBook(id as string))
                      );
                      message.success("Selected books deleted successfully");
                      setSelectedRowKeys([]);
                      setDeleteMode(false);
                      fetchBooks(currentPage);
                    } catch (error) {
                      console.error(error);
                      message.error("Failed to delete selected books");
                    }
                  },
                });
              }}
              disabled={selectedRowKeys.length === 0}
            >
              Delete Selected ({selectedRowKeys.length})
            </Button>

            <Button onClick={() => setDeleteMode(false)}>Cancel</Button>
          </>
        )}
        {!deleteMode && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteMode(true)}
          >
            Delete Books
          </Button>
        )}
      </div>

      <AdminBookTable
        data={books}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        enableRowSelection={deleteMode}
        onPageChange={handlePageChange}
        total={totalBooks * 5}
        onEdit={(bookKey: string) => {
          const bookToEdit = books.find((book) => book.key === bookKey);
          console.log(bookKey);
          if (bookToEdit) {
            setEditingBook(bookToEdit);
            setIsModalVisible(true);
          }
        }}
      />

      <AdminBookFormModal
        visible={isModalVisible}
        editingBook={editingBook}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBook(null);
        }}
        onSubmit={handleSubmit} // Call handleSubmit on form submit
        form={form} // Pass the form instance to the modal
      />
    </div>
  );
}
