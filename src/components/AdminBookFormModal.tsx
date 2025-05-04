import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Button, Space } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Book } from '../types';

interface AdminBookFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Book) => void;
  editingBook: Book | null;
}

const categoryOptions = [
  'Fiction',
  'Classic',
  'Science Fiction',
  'Romance',
  'Fantasy',
  'Adventure',
  'Dystopian',
];

export default function AdminBookFormModal({
  visible,
  onCancel,
  onSubmit,
  editingBook,
}: Readonly<AdminBookFormModalProps>): React.ReactElement {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editingBook) {
      form.setFieldsValue(editingBook);
    } else {
      form.resetFields();
    }
  }, [editingBook, form]);

  // Dynamically set initial values for form when creating or editing
  const initialValues = {
    title: editingBook?.title ?? '',
    author: editingBook?.author ?? '',
    editionNumber: editingBook?.editionNumber ?? 1,
    categories: editingBook?.categories ?? [],
    quantity: editingBook?.quantity ?? 0,
    isAvailable: editingBook?.isAvailable ?? true,
  };

  return (
    <Modal
      title={editingBook ? 'Edit Book' : 'Create Book'}
      open={visible}
      onCancel={() => {
        onCancel();
        // form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      okText={editingBook ? 'Update' : 'Create'}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues} // Use dynamically set initialValues
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input the book title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: 'Please input the author!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Edition Number"
          name="editionNumber"
          rules={[{ required: true, message: 'Please input the edition number!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        {/* Categories Section */}
        <Form.List name="categories">
          {(fields, { add, remove }) => (
            <>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" style={{ display: 'flex' }}>
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      rules={[{ required: false }]}
                      style={{ flex: 1 }}
                    >
                      <Select
                        placeholder="Select a category"
                        style={{ width: '200px' }} // width set to ensure consistency
                      >
                        {categoryOptions.map((cat) => (
                          <Select.Option key={cat} value={cat}>
                            {cat}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <CloseOutlined
                      onClick={() => remove(field.name)}
                      style={{ color: '#999', cursor: 'pointer', fontSize: 16 }}
                    />
                  </Space>
                ))}
              </div>
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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
              rules={[{ required: true, message: 'Please enter the quantity' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Available" name="isAvailable" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
