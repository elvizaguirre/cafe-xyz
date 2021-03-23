import { Product } from '@cafe-xyz/data';
import React, { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

export const Home = () => {

    const [products, setPrducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then((_) => _.json())
            .then(setPrducts);
    }, []);
    return (
    <>
        <h1>Products</h1>
        <ul>
            {products.map((t) => (
                <li key={t.id} className={'book'}>{t.name}----{t.price}</li>
            ))}
        </ul>
    </>
    );
};

export default Home;
