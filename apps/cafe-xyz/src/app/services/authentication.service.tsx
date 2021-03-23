import { BehaviorSubject } from 'rxjs';

import { handleResponse } from '../helpers/handle-response';

const currentUserSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:username, password })
    };

    return fetch('api/auth/login', requestOptions)
        .then(handleResponse)
        .then(({data, ...rest}) => {
            // store user details and jwt token in session storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            currentUserSubject.next(data);

            return data;
        });
}

function logout() {
    // remove user from session storage to log user out
    sessionStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}