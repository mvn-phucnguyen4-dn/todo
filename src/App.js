import React, { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useQuery, gql, useMutation } from "@apollo/client";
import "./App.css";
import { io } from "socket.io-client";
import SignIn from "./pages/signin/signin";
import SignUp from "./pages/signup/signup";
import Home from "./pages/home/home";
import Todo from "./pages/todos/todo";
import "graphiql/graphiql.css";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import Group from "./pages/group/groups";
import Header from "./components/Header/header";
import AuthContextProvider from "./context/AuthContext";
// const socket = io.connect("http://localhost:3000");

function App() {
  const fetcher = createGraphiQLFetcher({
    url: "http://localhost:3000/graphql",
  });
  return (
    <>
      <AuthContextProvider>
        <Header />
        <Routes>
          <Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/groups/:groupId" element={<Group />} />
            <Route path="/graphql" element={<GraphiQL fetcher={fetcher} />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
