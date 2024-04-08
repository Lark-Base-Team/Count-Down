import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Chart from './Chart';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>
    },
    {
        path: '/chart',
        element: <Chart></Chart>
    }
])

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
);