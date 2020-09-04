import React, { Component, Suspense } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Auth/LoginComponent";
import Home from "./components/home";
import { Provider } from "react-redux";
import history from "./history";
import Loader from "./components/Reusable/Loader";

const SecretRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated =
    localStorage.getItem("auth_Token") === null ? false : true;
  // const isAuthenticated = true;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated === true ? (
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
};

class Routes extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      if (window) {
        window.console.log = function () {};
      }
    }
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <SecretRoute path="/" component={Home} />
            <Route
              render={() => (
                <Suspense fallback={<Loader />}>404 Not Found</Suspense>
              )}
            />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
export default Routes;
