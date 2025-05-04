import { useState } from "react";
import { Modal, message } from "antd";
import { Book, Request } from "../types";
import { DEFAULT_REQUESTS } from "../context/default";
import AdminRequestTable from "../components/AdminRequestTable";
import BookListModal from "../components/BookListModal";

export default function AdminRequests() {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requests, setRequests] = useState<Request[]>(DEFAULT_REQUESTS);

  const showModal = (books: Book[]) => {
    setSelectedBooks(books);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooks([]);
  };

  const handleStatusChange = (key: string, newStatus: Request["status"]) => {
    const record = requests.find((r) => r.key === key);
    if (!record) return;

    Modal.confirm({
      title: `Change status to "${newStatus}"?`,
      content: `Are you sure you want to mark this request as "${newStatus}"? This action cannot be undone.`,
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        setRequests((prev) =>
          prev.map((r) => (r.key === key ? { ...r, status: newStatus } : r))
        );
        message.success(`Status changed to ${newStatus}`);
      },
    });
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <AdminRequestTable
          requests={requests}
          onStatusChange={handleStatusChange}
          onViewBooks={showModal}
        />
      </div>

      <BookListModal
        title="Requested Books"
        selectedBooks={selectedBooks}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
    </div>
  );
}
