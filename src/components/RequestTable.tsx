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
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Requestor (Email)",
      dataIndex: "requestor",
      key: "requestor",
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      sorter: (a, b) =>
        new Date(a.dateRequested).getTime() -
        new Date(b.dateRequested).getTime(),
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
      render: (status: string) => {
        const typedStatus = status as keyof typeof statusColors;
        return <Tag color={statusColors[typedStatus]}>{status}</Tag>;
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
