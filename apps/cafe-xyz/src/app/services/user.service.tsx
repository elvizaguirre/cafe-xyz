import { authHeader } from '../helpers/auth-header';
import {  handleResponse } from '../helpers/handle-response';

export const userService = {
    getAll
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch('api/users', requestOptions).then(handleResponse);
}