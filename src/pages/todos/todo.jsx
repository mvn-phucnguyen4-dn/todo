import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { InputBase } from "@material-ui/core";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router-dom";
import { notification } from "antd";
// import "./style.css";

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
    fontSize: "80px",
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
}));

const CREATE_TODO = gql`
  mutation (
    $name: String!
    $description: String!
    $status: Boolean!
    $groupId: Int!
  ) {
    createTodo(
      todoData: {
        name: $name
        description: $description
        status: $status
        groupId: $groupId
      }
    ) {
      id
    }
  }
`;

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

const TODOS_SUBSCRIPTION = gql`
  subscription {
    todoAdded {
      id
      name
      user {
        id
        username
      }
    }
  }
`;
export default function Todo() {
  const [todo, setTodo] = useState("");
  let { groupId } = useParams();
  const { data, loading, error } = useQuery(GET_TODOS_BY_GROUP, {
    variables: {
      groupId: parseFloat(groupId),
    },
    fetchPolicy: "cache-first",
  });
  const {
    data: dataSub,
    loading: loadingSub,
    error: errorSub,
  } = useSubscription(TODOS_SUBSCRIPTION, {
    fetchPolicy: "cache-first",
    // variables: { groupId },
  });
  const [createTodo] = useMutation(CREATE_TODO);
  const classes = useStyles();

  const handleCreateTodo = (e) => {
    e.preventDefault();
    createTodo({
      variables: {
        name: todo,
        description: `description ${todo}`,
        status: false,
        groupId: parseInt(groupId),
      },
      // refetchQueries: [
      //   {
      //     query: GET_TODOS_BY_GROUP,
      //     variables: {
      //       groupId: parseFloat(groupId),
      //     },
      //   },
      // ],
    }).then((response) => {
      setTodo((prev) => "");
      notification.success({
        message: "success",
        description: "Create todo success!!",
      });
    });
  };

  const handleChangeTodo = (e) => {
    setTodo(e.target.value);
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <h1 className={classes.heading}>Groups {groupId}</h1>
        <form onSubmit={handleCreateTodo}>
          <InputBase
            onChange={handleChangeTodo}
            className={classes.input}
            placeholder="Todo in today?"
            value={todo}
          />
        </form>
        <ul>
          {console.log(dataSub, "data")}
          <p>{dataSub ? dataSub.todoAdded.name : "Nothing"}</p>
          {data?.groupById?.todos?.length &&
            data?.groupById?.todos.map((todo) => (
              <li className={classes.group} key={todo.id}>
                <span>{todo.name}</span>
              </li>
            ))}
        </ul>
      </div>

      <Box height={4}>
        <Copyright />
      </Box>
    </Container>
  );
}
