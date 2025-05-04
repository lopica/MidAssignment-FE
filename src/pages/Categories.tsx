import { useState, useEffect } from "react";
import { Button, Modal, message, Input, Form } from "antd";
import { Category, PaginatedResult } from "../types";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../apis/categoryApi";
import AdminCategoryTable from "../components/AdminCategoryTable";
import BookListModal from "../components/BookListModal";
import { Key } from "antd/es/table/interface";

const initialData: PaginatedResult<Category> = {
  data: [],
  currentPage: 1,
  totalPage: 1,
  limit: 5,
};

export default function Categories() {
  const [responseData, setResponseData] =
    useState<PaginatedResult<Category>>(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [deletionMode, setDeletionMode] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res = await getAllCategories(currentPage);
      const formatRes = {
        ...res,
        data: res.data.map((item) => ({
          ...item,
          key: item.id ?? String(item.name),
        })),
      };
      setResponseData(formatRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);
  

  const showViewModal = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsViewModalVisible(true);
  };

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const showEditModal = (category: Category) => {
    setEditingCategory(category); // Set the category to be edited
    form.setFieldsValue({ name: category.name }); // Pre-fill the form
    setIsCreateModalVisible(true); // Reuse the create modal for editing
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await updateCategory(editingCategory.id!, { name: values.name });
        message.success("Category updated successfully!");
      } else {
        await addCategory({ name: values.name });
        message.success("Category created successfully!");
      }

      await fetchData(); // Refresh category list
      setIsCreateModalVisible(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Create/update failed:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete the selected categories?",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) => deleteCategory(id as string))
          );
          await fetchData(); // Refresh category list
          setSelectedRowKeys([]);
          setDeletionMode(false);
          message.success("Selected categories deleted.");
        } catch (error) {
          console.error("Deletion failed", error);
          message.error("Failed to delete one or more categories.");
        }
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

      <AdminCategoryTable
        data={responseData.data}
        deletionMode={deletionMode}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onViewBooks={showViewModal}
        totalItems={responseData.totalPage * responseData.limit}
        onEditCategory={showEditModal} 
        onPageChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
      />

      {/* Create/Edit Category Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Create New Category"}
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        okText={editingCategory ? "Update" : "Create"}
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

      <BookListModal
        title={`Books in "${selectedCategory}"`}
        isModalVisible={isViewModalVisible}
        handleCancel={() => setIsViewModalVisible(false)}
        selectedBooks={[]}
      />
    </div>
  );
}
