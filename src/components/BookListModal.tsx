// components/BookListModal.tsx
import { Modal } from "antd";
import { Book } from "../types";
import BookTable from "./BookTable";

export default function BookListModal({
  isModalVisible,
  handleCancel,
  selectedBooks,
  title,
}: Readonly<{
  isModalVisible: boolean;
  handleCancel: () => void;
  selectedBooks: Book[];
  title?: string;
}>) {
  return (
    <Modal
      title={title || "Books"}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={1100}
    >
      <BookTable data={selectedBooks} />
    </Modal>
  );
}
