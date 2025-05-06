import { useContext } from "react";
import {
  BookOutlined,
  SnippetsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Avatar, Dropdown, message } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import { StoreContext } from "../context/store";
import { useAuth } from "../hooks/useAuth";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "1",
    icon: <BookOutlined />,
    label: "Books",
  },
  {
    key: "2",
    icon: <SnippetsOutlined />,
    label: "Requests",
  },
  {
    key: "3",
    icon: <UnorderedListOutlined />,
    label: "Categories",
  },
];

const userMenu = [
  {
    key: "1",
    label: <span className="text-red-600 font-medium">Logout</span>,
  },
];

const pathToKeyMap: Record<string, string> = {
  "/books": "1",
  "/requests": "2",
  "/categories": "3",
};

const titleMap: Record<string, string> = {
  "/books": "Books Management",
  "/requests": "Requests Management",
  "/categories": "Categories Management",
};

export default function CustomLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [store] = useContext(StoreContext);
  const pageTitle = titleMap[location.pathname] ?? "";
  const { logout } = useAuth();

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => console.log(broken)}
        onCollapse={(collapsed, type) => console.log(collapsed, type)}
      >
        <div className="flex justify-center">
          <img src="/nash_tech.png" alt="Logo" className="h-24 object-cover" />
        </div>
        <div className="h-14 flex items-center justify-center text-white text-lg font-bold border-b border-gray-700">
          <p>Library Management</p>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathToKeyMap[location.pathname]]}
          onClick={({ key }) => {
            switch (key) {
              case "1":
                navigate("/books");
                break;
              case "2":
                navigate("/requests");
                break;
              case "3":
                navigate("/categories");
                break;
            }
          }}
          items={store.role === "user" ? items.slice(0, 2) : items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="font-semibold text-lg">{pageTitle}</span>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Dropdown
              menu={{
                items: userMenu,
                onClick: async ({ key }: any) => {
                  if (key === "1") {
                    try {
                      await logout();
                      message.success("Logout successful!");
                      navigate("/");
                    } catch (error: any) {
                      message.error("Logout failed.");
                    }
                  }
                },
              }}
              placement="bottomRight"
            >
              <Avatar icon={<UserOutlined />} className="cursor-pointer" />
            </Dropdown>
          </div>
        </Header>

        <Content style={{ padding: "1rem", overflow: "auto" }}>
          <div
            style={{
              padding: 20,
              minHeight: "calc(100vh - 15rem)", // Adjust for header + footer
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
