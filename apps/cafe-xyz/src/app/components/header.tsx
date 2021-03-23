import React from 'react';
import { Link } from "react-router-dom";
import { getUserLogued } from '../helpers/observ-user';
import { authenticationService } from '../services/authentication.service';

export const Header = () => {
  const user = getUserLogued();
  return (
    <>
    <div id="header-global">
           <img src="./assets/banner.png" alt="CafeXYZ" style={{width: '100%', height:"min-content"}}/>
    </div>
    <div className="header">
      <div className="logo-nav">
        <ul className={"nav-options"}>
          <li className="option">
            <Link to={'/'} className="nav-link">Home</Link>
          </li>
          <li className="option">
            <Link to={'/mycart'} className="nav-link">My Cart</Link>
          </li>
          <li className="option">
            <Link to={'/orders'} className="nav-link">My Orders</Link>
          </li>
          <li className="option mobile-option">
            <Link to={'/login'} className="nav-link">SIGN-IN</Link>
          </li>
          <li className=" option mobile-option">
            <Link to={'/register'} className="nav-link sign-up">SIGN-UP</Link>
          </li>
        </ul>
      </div>
      {user ? (
        <>
        Welcome {user.name? user.name + ' ' + user.lastName : user.email }
        <ul className="signin-up">
          <li onClick={()=>{ authenticationService.logout()}}>
            <Link
              to={'/'}
              className="nav-link signup-btn"
            >
              Logout
            </Link>
          </li>
        </ul>
        </>
        ):(
        <>
        You are not logued in!
        <ul className="signin-up">
          <li className="sign-in">
            <Link to={'/login'} className="nav-link">SIGN-IN</Link>
          </li>
          <li>
            <Link to={'/register'} className="nav-link signup-btn">SIGN-UP</Link>
          </li>
        </ul>
        </>)}
      
    </div>
    </>
  );
};

export default Header;
