import { Redirect, Route } from "react-router";

export const PrivateRoute = ({component: Component, ...rest}) => {
    const loggedIn = sessionStorage.getItem("loggedIn");


    return (
        <Route
            {...rest}
            render={(props) =>
                loggedIn === "true" ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
}