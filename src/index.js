import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3000/graphql",
    on: {
      connected: () => console.log("graphql-ws connected"),
      error: (err) => console.log("error", err),
      opened: (socket) => console.log("opened", socket),
    },
  })
);
const root = ReactDOM.createRoot(document.getElementById("root"));
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
  link: wsLink,
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: "cache-only",
  //     errorPolicy: "ignore",
  //   },
  //   query: {
  //     fetchPolicy: "network-only",
  //     errorPolicy: "all",
  //   },
  //   mutate: {
  //     errorPolicy: "all",
  //   },
  // },
});

root.render(
  <>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
