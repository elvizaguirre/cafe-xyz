import React, { useState } from 'react';
import { authenticationService } from '../services/authentication.service';

export const getUserLogued = () => {
  const [user, setUser] = useState<any>({});

  authenticationService.currentUser.subscribe(x => {
    if(x && user !== x.user) {
      setUser(x.user)
    } else {
      if(!x && user) {
        setUser(null)
      }
    }
  });
  return user;
};