import { useHistory } from "react-router";
import "../../App.css";
import { Button } from "@mui/material";
import config from "../../config.js";

export function Login() {
    const history = useHistory();
    const gapi = window.gapi;

    const onSuccess = () => {
        sessionStorage.setItem("loggedIn", true);
        history.push("/");
    };

    const signIn = () => {
        gapi.load("client:auth2", initClient);
    };

    function initClient() {
        gapi.client
            .init({
                apiKey: config.apiKey,
                clientId: config.clientId,
                discoveryDocs: config.discoveryDocs,
                scope: config.scope,
            })
            .then(function () {
                gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                    if (isSignedIn) onSuccess();
                });
                gapi.auth2.getAuthInstance().signIn();
            });
    }

    return (
        <div className="App">
            <div className="login-container">
                <h3 className="login-header">LOGIN</h3>
                <Button onClick={signIn} className="login-button">
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
