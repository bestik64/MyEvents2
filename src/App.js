import { Route, Switch } from "react-router";
import "./App.css";
import { Home } from "./containers/Home/Home";

function App() {
    return (
        <Switch>
            <Route component={Home} />
        </Switch>
    );
}

export default App;
