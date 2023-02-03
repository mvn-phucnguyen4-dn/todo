import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Avatar, Typography, theme } from "antd";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { isAuthenticated, logoutClient } = useContext(AuthContext);
  return (
    <div className="header">
      <div className="header-left">ToDooooo</div>
      <div className="header-right">
        <ul className="action">
          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  to={"/signin"}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to={"/signup"}
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <li className="profile">
              <Avatar
                style={{ backgroundColor: "#ea4c89", marginRight: "5px" }}
              >
                {/* <LockOutlinedIcon /> */}
              </Avatar>
              <span
                onClick={() => {
                  logoutClient()
                }}
              >
                {localStorage.getItem("username")}
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
