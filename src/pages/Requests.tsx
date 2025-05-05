import { useEffect, useState } from "react";
import RequestTable from "../components/RequestTable";
import RequestBookModal from "../components/BookListModal";
import { Book, Request, PaginatedResult } from "../types";
import { getAllRequests } from "../apis/requestApi"; // ← make sure path is correct
import { message } from "antd";

export default function Requests() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [requestData, setRequestData] = useState<Request[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchRequests = async () => {
    try {
      const result = await getAllRequests(currentPage);

      const mapped = result.data.map((item) => ({
        ...item,
        key: item.id, // required by Ant Design table
      }));

      setRequestData(mapped);
    } catch (error) {
      message.error("Failed to fetch requests.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const showModal = (books: Book[]) => {
    setSelectedBooks(books);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooks([]);
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <RequestTable data={requestData} showModal={showModal} />
      </div>

      <RequestBookModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        selectedBooks={selectedBooks}
      />
    </div>
  );
}
