import React from "react";
import { Navigate, Route } from "react-router-dom";

const PrivateRoute = ({ element: Element, isAdmin, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAdmin ? <Element /> : <Navigate to="/" />}
    />
  );
};

export default PrivateRoute;
