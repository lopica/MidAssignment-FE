import { useContext, useEffect, useState } from "react";
import { Modal, message } from "antd";
import { Book, Request, UpdateRequestDto } from "../types";
import { DEFAULT_REQUESTS } from "../constants";
import AdminRequestTable from "../components/AdminRequestTable";
import BookListModal from "../components/BookListModal";
import { getAllRequests, updateRequest } from "../apis/requestApi";
import { StoreContext } from "../context/store";

const statusMap: Record<0 | 1 | 2, string> = {
  0: "Approved",
  1: "Rejected",
  2: "Waiting",
};

export default function AdminRequests() {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requests, setRequests] = useState<Request[]>(DEFAULT_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [store] = useContext(StoreContext)

  const showModal = (books: Book[]) => {
    setSelectedBooks(books);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooks([]);
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        const res = await getAllRequests(1); // 1st page, no userId
        const result = res.data;

        // Optional: assign a `key` if your API doesn't return one
        const mapped = result.map((r, idx) => ({
          ...r,
          key: r.id || idx.toString(), // for AntD table
        }));

        setRequests(mapped);
      } catch (error) {
        console.error("Failed to fetch requests", error);
        message.error("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  const handleStatusChange = async (key: string, newStatus: Request["status"]) => {
    const record = requests.find((r) => r.key === key);
    if (!record) return;
    // console.log(record)
    Modal.confirm({
      title: `Change status to "${statusMap[newStatus]}"?`,
      content: `Are you sure you want to mark this request as "${statusMap[newStatus]}"? This action cannot be undone.`,
      okText: "Yes",
      cancelText: "Cancel",
      async onOk() {
        try {
          const payload: UpdateRequestDto = {
            status: newStatus,
            approverId: store.userId, // Replace with real approver ID (maybe from auth)
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
            bookIds: record.books.map((book) => book.id),
          };
  
          await updateRequest(record.id, payload);
  
          // Update UI
          setRequests((prev) =>
            prev.map((r) => (r.key === key ? { ...r, status: newStatus } : r))
          );
  
          message.success(`Status updated successfully to "${newStatus}"`);
        } catch (error) {
          console.error("Update failed", error);
          message.error("Failed to update request status.");
        }
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
