import React from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Todo from "../todos/todo";
import "./groups.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const GET_TODOS_BY_GROUP = gql`
  query ($groupId: Float!) {
    groupById(groupId: $groupId) {
      id
      todos {
        id
        name
      }
      users {
        id
      }
    }
  }
`;

export default function Group() {
  let { groupId } = useParams();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Todo></Todo>
    // <Layout>
    //   <Sider
    //     breakpoint="lg"
    //     collapsedWidth="0"
    //     onBreakpoint={(broken) => {
    //       console.log(broken);
    //     }}
    //     onCollapse={(collapsed, type) => {
    //       console.log(collapsed, type);
    //     }}
    //   >
    //     <div className="logo" />
    //     <Menu
    //       theme="dark"
    //       mode="inline"
    //       defaultSelectedKeys={["4"]}
    //       items={[
    //         UserOutlined,
    //         VideoCameraOutlined,
    //         UploadOutlined,
    //         UserOutlined,
    //       ].map((icon, index) => ({
    //         key: String(index + 1),
    //         icon: React.createElement(icon),
    //         label: `nav ${index + 1}`,
    //       }))}
    //     />
    //   </Sider>
    //   <Layout>
    //     <Header style={{ padding: 0, background: colorBgContainer }} />
    //     <Content style={{ margin: "24px 16px 0" }}>
    //       <div
    //         style={{
    //           padding: 24,
    //           minHeight: 360,
    //           background: colorBgContainer,
    //         }}
    //       >
    //         content
    //       </div>
    //     </Content>
    //     <Footer style={{ textAlign: "center" }}>
    //       Ant Design ©2023 Created by Ant UED
    //     </Footer>
    //   </Layout>
    // </Layout>
  );
}
