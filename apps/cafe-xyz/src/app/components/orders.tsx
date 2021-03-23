import React,{ useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { Cart } from '@cafe-xyz/data';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const Orders = () => {

    const [carts, setCarts] = useState<Cart[]>([]);

    const requestOptions = { method: 'GET', headers: authHeader() };

    useEffect(() => {
        fetch('/api/cart', requestOptions)
            .then(handleResponse)
            .then((_) => _.data)
            .then(setCarts);
    }, []);

    return (
        <>
            <h1>Orders</h1>
            <ul>
            {carts.map((t) => (
                <li key={t.id} className={'cart'}>{t.content.map((o)=>(o.product.name)).join('+')}----{t.content.map((o)=>(o.amount)).join('+')}</li>
            ))}
        </ul>
        </>
    );
};

export default Orders;