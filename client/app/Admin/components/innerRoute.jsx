import React from "react";
import { Redirect } from "react-router-dom";

const BookHistory = React.lazy(() => import("./contentComponents/BookHistory"));
const Users = React.lazy(() => import("./contentComponents/Users"));
const UserForm = React.lazy(() => import("./contentComponents/Users/UserForm"));
const Product = React.lazy(() => import("./contentComponents/Product"));
const ProductForm = React.lazy(() =>
  import("./contentComponents/Product/ProductForm")
);
const Home = React.lazy(() => import("./contentComponents/Home"));
const Order = React.lazy(() => import("./contentComponents/Order"));

export const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Redirect to="/book-history" />,
  },
  {
    path: "/home",
    exact: true,
    main: Home,
  },
  {
    path: "/dashboard",
    exact: true,
    main: BookHistory,
  },
  {
    path: "/order-history",
    exact: true,
    main: BookHistory,
  },
  {
    path: "/users",
    exact: true,
    main: Users,
  },
  {
    path: "/user-form",
    exact: true,
    main: UserForm,
  },
  {
    path: "/user-form/:id",
    exact: true,
    main: UserForm,
  },
  {
    path: "/products",
    exact: true,
    main: Product,
  },
  {
    path: "/product-form",
    exact: true,
    main: ProductForm,
  },
  {
    path: "/product-form/:id",
    exact: true,
    main: ProductForm,
  },
  {
    path: "/order",
    exact: true,
    main: Order,
  },
];
export default routes;
