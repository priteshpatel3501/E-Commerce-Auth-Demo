import React, { Component, Suspense } from "react";
import routes from "../innerRoute";
import { Route, Switch } from "react-router-dom";
// import SupportChat from './SupportChat';
import Footer from "../wrapperComponents/footer";
import Loader from "../Reusable/Loader";
// import Error404 from '../reusables/Error404';
// const Error404 = React.lazy(() => import('../reusables/Error404'));
class Content extends Component {
  render() {
    return (
      <div id="page-wrapper">
        <Suspense fallback={<Loader />}>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                strict
                render={() => <route.main />}

                // component={route.main}
              />
            ))}
            {/* <Route
							// component={Error404}
							render={() => <Error404 />}
						/> */}
          </Switch>
        </Suspense>
        {/* <SupportChat/> */}
        <Footer />
      </div>
    );
  }
}
export default Content;
