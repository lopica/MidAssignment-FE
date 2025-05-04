import React from "react";
import { Button, Modal, Form, DatePicker, FormInstance } from "antd";
import { Book } from "../types";
import BookTable from "./BookTable";

export default function BorrowBookModal({
  isModalVisible,
  handleCancel,
  handleSubmit,
  form,
  borrowedBooks,
}: Readonly<{
  isModalVisible: boolean;
  handleCancel: () => void;
  handleSubmit: (values: any) => void;
  form: FormInstance<any>;
  borrowedBooks: Book[];
}>): React.ReactElement {
  return (
    <Modal
      title="Borrow Books"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={1100}
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: "Please select the due date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD" // Use native format
          />
        </Form.Item>

        <div className="mb-4">
          <BookTable data={borrowedBooks} />
        </div>

        <Form.Item>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
