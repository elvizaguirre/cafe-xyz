import React,{ useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

export const Order = () => {
    let routeMatch = useRouteMatch();
    console.info(routeMatch);
    let params = useParams();

    return (
        <>
            <h1>{params.id}</h1>
        </>
    );
};

export default Order;