import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
  FormInstance,
  message,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { Book, Category } from "../types";
import { getAllCategoriesWithoutPagination } from "../apis/categoryApi"; // Add your category API import

interface AdminBookFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Book) => void;
  editingBook: Book | null;
  form: FormInstance<any>;
}

export default function AdminBookFormModal({
  visible,
  onCancel,
  onSubmit,
  editingBook,
  form,
}: Readonly<AdminBookFormModalProps>): React.ReactElement {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false); // For loading state

  // Fetch categories when the modal is visible
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getAllCategoriesWithoutPagination(); // You can also use paginated version
        setCategoryOptions(response); // Assuming response.data is an array of categories
      } catch (error) {
        message.error("Failed to fetch categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  useEffect(() => {
    if (editingBook) {
      form.setFieldsValue(editingBook);
    } else {
      form.resetFields();
    }
  }, [editingBook, form]);

  // Dynamically set initial values for form when creating or editing
  const initialValues = {
    title: editingBook?.title ?? "",
    author: editingBook?.author ?? "",
    editionNumber: editingBook?.editionNumber ?? 1,
    categories: editingBook?.categories
      ? editingBook.categories.map((cat) => cat.id)
      : [],
    quantity: editingBook?.quantity ?? 0,
    isAvailable: editingBook?.isAvailable ?? true,
  };

  const handleFormSubmit = async (values: Book) => {
    try {
      onSubmit(values);

      // Close the modal and reset form
      form.resetFields();
    } catch (error) {
      message.error("Failed to save the book.");
    }
  };

  return (
    <Modal
      title={editingBook ? "Edit Book" : "Create Book"}
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleFormSubmit(values); // Call the custom submit function
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      okText={editingBook ? "Update" : "Create"}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues} // Use dynamically set initialValues
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the book title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: "Please input the author!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Edition Number"
          name="editionNumber"
          rules={[
            { required: true, message: "Please input the edition number!" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        {/* Categories Section */}
        <Form.List name="categories">
          {(fields, { add, remove }) => (
            <>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {fields.map(({ key, ...field }) => (
                  <Space key={key} align="baseline" style={{ display: "flex" }}>
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      rules={[{ required: false }]}
                      style={{ flex: 1 }}
                    >
                      <Select
                        placeholder="Select a category"
                        style={{ width: "200px" }}
                        loading={loadingCategories}
                        value={form.getFieldValue("categories")?.[field.name]}
                        onChange={(value) => {
                          const current =
                            form.getFieldValue("categories") || [];
                          current[field.name] = value;
                          form.setFieldsValue({ categories: current });
                        }}
                      >
                        {categoryOptions
                          .filter((cat) => {
                            const selected =
                              form.getFieldValue("categories") || [];
                            // Allow the current selection in its own Select
                            return (
                              !selected.includes(cat.id) ||
                              selected[field.name] === cat.id
                            );
                          })
                          .map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                              {cat.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <CloseOutlined
                      onClick={() => remove(field.name)}
                      style={{ color: "#999", cursor: "pointer", fontSize: 16 }}
                    />
                  </Space>
                ))}
              </div>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Category
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {editingBook && (
          <>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter the quantity" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Available"
              name="isAvailable"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
