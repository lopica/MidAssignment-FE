import { useState } from "react";
import { DEFAULT_REQUESTS } from "../constants";
import RequestTable from "../components/RequestTable";
import RequestBookModal from "../components/BookListModal";
import { Book, Request } from "../types";

// Sample data
const requestData: Request[] = DEFAULT_REQUESTS;

export default function Requests() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

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
