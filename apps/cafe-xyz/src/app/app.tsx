import React, { useContext, createContext, useState } from "react";
import { Header } from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import Order from './components/order';
import Footer from './components/footer';
import Home from './components/home';
import { LoginPage, PrivateRoute, ProvideAuth } from "./components/auth";
import Orders from "./components/orders";



export const App = () => {


  return (
    <>
    <ProvideAuth>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/mycart' component={''} />
          <PrivateRoute path='/orders' component={Orders} />
          <PrivateRoute path='/orders/:id' component={Order} />
          <PrivateRoute path='/pay' component={''} />
          <Route path='/login' component={LoginPage} />
          <Route path='/register' component={''} />
        </Switch>
        <Footer />
      </Router>
    </ProvideAuth>
    </>
  );
};

export default App;
