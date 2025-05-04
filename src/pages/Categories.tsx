import { useState } from "react";
import { Button, Modal, message, Input, Form } from "antd";
import type { Key } from "react";
import AdminCategoryTable from "../components/AdminCategoryTable";
import { Book, Category } from "../types";
import { DEFAULT_CATEGORIES } from "../context/default";
import BookListModal from "../components/BookListModal";

const initialData: Category[] = DEFAULT_CATEGORIES;

export default function Categories() {
  const [data, setData] = useState<Category[]>(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [deletionMode, setDeletionMode] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [form] = Form.useForm();

  const showViewModal = (categoryName: string, books: Book[]) => {
    setSelectedBooks(books);
    setSelectedCategory(categoryName);
    setIsViewModalVisible(true);
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        const newCategory: Category = {
          key: (data.length + 1).toString(),
          name: values.name,
          books: [],
        };
        setData([...data, newCategory]);
        setIsCreateModalVisible(false);
        message.success("Category created successfully!");
      })
      .catch(() => {});
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete the selected categories?",
      onOk: () => {
        setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
        setSelectedRowKeys([]);
        setDeletionMode(false);
        message.success("Selected categories deleted.");
      },
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button type="primary" onClick={showCreateModal}>
          Create Category
        </Button>

        {deletionMode ? (
          <>
            <Button
              danger
              disabled={!selectedRowKeys.length}
              onClick={handleDelete}
            >
              Delete Categories ({selectedRowKeys.length})
            </Button>
            <Button
              onClick={() => {
                setDeletionMode(false);
                setSelectedRowKeys([]);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button danger onClick={() => setDeletionMode(true)}>
            Delete Categories
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <AdminCategoryTable
          data={data}
          deletionMode={deletionMode}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onViewBooks={showViewModal}
        />
      </div>

      <BookListModal
        title={`Books in "${selectedCategory}"`}
        isModalVisible={isViewModalVisible}
        handleCancel={() => {
          setIsViewModalVisible(false);
          setSelectedBooks([]);
        }}
        selectedBooks={selectedBooks}
      />

      {/* Create Category Modal */}
      <Modal
        title="Create New Category"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        okText="Create"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter a category name" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
