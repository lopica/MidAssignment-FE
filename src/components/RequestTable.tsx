import { Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Book, Request, statusColors } from "../types";

export default function RequestTable({
  data,
  showModal,
}: Readonly<{ data: Request[]; showModal: (books: Book[]) => void }>) {
  const columns: ColumnsType<Request> = [
    {
      title: "Ordinal",
      key: "ordinal",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Requestor (Email)",
      dataIndex: "requestorEmail",
      key: "requestorEmail",
    },
    {
      title: "Date Requested",
      dataIndex: "requestDate", // ✅ fixed typo
      key: "requestDate",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sorter: (a, b) =>
        new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
    },
    {
      title: "Books",
      dataIndex: "books",
      key: "books",
      render: (books: Book[]) => (
        <div className="flex items-center gap-2 flex-wrap">
          <Button type="link" size="small" onClick={() => showModal(books)}>
            View Details
          </Button>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: 0 | 1 | 2) => {
        const statusMap: Record<0 | 1 | 2, "approved" | "rejected" | "waiting"> =
          { 0: "approved", 1: "rejected", 2: "waiting" };

        const statusLabel = statusMap[status];
        return <Tag color={statusColors[statusLabel]}>{statusLabel}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 5,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} requests`,
      }}
      scroll={{ x: "max-content" }}
      bordered
    />
  );
}
