import { EditUserDto } from "@cafe-xyz/data";
import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Button, Card, Container, Form, FormControl, FormGroup, Row } from 'react-bootstrap';
import { authenticationService } from "../services/authentication.service";

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext(null);

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if user is not not yet authenticated.
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)


export function LoginPage() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  if (authenticationService.currentUserValue) { 
    history.push('/');
  }

  let { from } = location.state || { from: { pathname: "/" } };
  let login = (event) => {
    const email = event.target[0].value;
    const pass = event.target[1].value;
    event.stopPropagation();
    event.preventDefault();
    authenticationService.login(email, pass).then(
        ()=>{history.replace(from)}
    );  
  };


  return (
    <div>
        <Container>
            <Form method="post" onSubmit={login}>
                <Row>
                    <FormGroup>
                        <FormControl type="email" name="email" placeholder="Your email" />
                    </FormGroup>
                </Row>
                <Row>
                    <FormGroup>
                        <FormControl type="password" name="password" placeholder="Your password" />
                    </FormGroup>
                </Row>
                <Row>
                    <Button type="submit" color="primary">Login</Button>
                </Row>
            </Form>
      </Container>
    </div>
  );
}