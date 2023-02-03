import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { InputBase } from "@material-ui/core";
import { gql, useMutation, useQuery } from "@apollo/client";
import "./style.css";
import { notification } from "antd";
import { useAuthContext } from "../../context/AuthContext";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  input: {
    width: "100%",
    fontSize: "20px",
    marginLeft: theme.spacing(2),
    flex: 1,
    fontStyle: "italic",
    fontWeight: 300,
    color: "rgba(0, 0, 0, 0.54)",
  },

  heading: {
    width: "100%",
    fontSize: "100px",
    fontWeight: "100",
    textAlign: "center",
  },

  group: {
    border: "1px solid rgba(0, 0, 0, 0.3)",
    borderRadius: "3px",
    marginBottom: "10px",
    fontSize: "16px",
    textDecorateStyle: "none",
    background: "rgba(0, 0, 0, 0.003)",
    listStyleType: "none",
    padding: "3px 5px",
    "box-shadow": "inset 0 -2px 1px rgb(0 0 0 / 3%)",
    display: "flex",
    justifyContent: "space-between",
  },

  icon: {
    marginRight: "5px",
  },

  join: {
    border: "1px solid black",
    cursor: "pointer",
    padding: "2px 4px",
    borderRadius: "3px",
    marginLeft: "3px",
  },
}));

const GET_MY_GROUPS = gql`
  query {
    groups {
      id
      name
      size
      users {
        id
      }
    }
    myGroups {
      id
      name
      size
      users {
        id
      }
    }
    notJoinedGroup {
      id
      name
      size
      users {
        id
      }
    }
  }
`;

const UPDATE_GROUP = gql`
  mutation ($groupId: Float!, $name: String!, $size: Int!, $userIds: [Int!]!) {
    updateGroup(
      groupId: $groupId
      groupData: { name: $name, size: $size, userIds: $userIds }
    ) {
      id
      name
      size
      users {
        id
      }
    }
  }
`;

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const { data, loading, error } = useQuery(GET_MY_GROUPS, {
    fetchPolicy: "cache-first",
  });
  const [updateGroup, {}] = useMutation(UPDATE_GROUP);
  const navigate = useNavigate();
  const classes = useStyles();
  if (loading) return <p>Loading books....</p>;
  const handleOutGroup = (group) => {
    const currentUserId = parseInt(localStorage.getItem("userId"));
    const currentUserIds = group.users.map((user) => user.id);
    const newUserIds = currentUserIds.filter(
      (userId) => userId != currentUserId
    );
    updateGroup({
      variables: {
        groupId: group.id,
        name: group.name,
        size: group.size,
        userIds: [...newUserIds],
      },
      refetchQueries: [{ query: GET_MY_GROUPS }],
    })
      .then((response) => {
        notification.success({
          message: "success",
          description: `Success to out ${group.name} group!!`,
        });
      })
      .catch((error) => {
        notification.error({
          message: "error",
          description: `Fail to out ${group.name} group!! ${error.message}.`,
        });
      });
  };

  const handleJoinGroup = (group) => {
    const currentUserIds = group.users.map((user) => user.id);
    const userId = parseInt(localStorage.getItem("userId"));

    updateGroup({
      variables: {
        groupId: group.id,
        name: group.name,
        size: group.size,
        userIds: [...currentUserIds, userId],
      },
      refetchQueries: [{ query: GET_MY_GROUPS }],
    })
      .then((response) => {
        notification.success({
          message: "success",
          description: `Success to join ${group.name} group!!`,
        });
      })
      .catch((error) => {
        notification.error({
          message: "error",
          description: `Fail to join ${group.name} group!! ${error.message}.`,
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h1 className={classes.heading}>Groups</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <InputBase className={classes.input} placeholder="Join to group?" />
        </form>
        <div className="container">
          {isAuthenticated ? (
            <>
              <div className="col-6">
                <h3>Joined group</h3>
                <ul>
                  {data?.myGroups.length &&
                    data?.myGroups.map((group) => (
                      <li className={classes.group} key={group.id}>
                        <span
                          onClick={() => {
                            if (isAuthenticated)
                              navigate(`/groups/${group.id}`);
                            else
                              notification.warning({
                                message: "warn",
                                description: "Not permission! Let login...",
                              });
                          }}
                        >
                          {group.name}
                        </span>
                        <p>
                          <span>
                            {group.users.length}/{group.size}
                          </span>
                          <span
                            className={classes.join}
                            onClick={() => {
                              handleOutGroup(group);
                            }}
                          >
                            Out
                          </span>
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="col-6">
                <h3>Not joined group</h3>
                <ul>
                  {data?.notJoinedGroup.length &&
                    data?.notJoinedGroup.map((group) => (
                      <li className={classes.group} key={group.id}>
                        <span>{group.name}</span>
                        <p>
                          {group.users.length}/{group.size}
                          <span
                            className={classes.join}
                            onClick={() => {
                              handleJoinGroup(group);
                            }}
                          >
                            Join
                          </span>
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="col-6">
              <h3>List group</h3>
              <ul>
                {data?.groups.length &&
                  data?.groups.map((group) => (
                    <li className={classes.group} key={group.id}>
                      <span>{group.name}</span>
                      <p>
                        {group.users.length}/{group.size}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Box height={4}>
        <Copyright />
      </Box>
    </Container>
  );
}
