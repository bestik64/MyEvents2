import React from "react";
import { useHistory } from "react-router";
import "../../App.css";
import { Button } from "@mui/material";
import { Calendar } from "../Calendar/Calendar";

export function Home() {
    const history = useHistory();

    const onLogoutSuccess = () => {
        sessionStorage.setItem("loggedIn", false);
        history.push("/");
    };

    function preSignOut() {
        window.gapi.load("client:auth2", signOut);
    }

    function signOut() {
        window.gapi.auth2.getAuthInstance().signOut();
        window.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
            if (!isSignedIn) onLogoutSuccess();
        });
    }
    return (
        <div>
            <div className="header-container">
                <h2 className="home-header">My Events 2</h2>
                <Button onClick={preSignOut} className="logout-button">
                    SIGN OUT
                </Button>
            </div>
            <Calendar />
        </div>
    );
}
