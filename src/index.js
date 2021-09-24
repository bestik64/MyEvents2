import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { Login } from "./containers/Login/Login";
import { PrivateRoute } from "./containers/Login/PrivateRoute";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route exact={true} path="/login" component={Login} />
                <PrivateRoute exact={true} path="/" component={App} />
                <PrivateRoute component={App} />
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
