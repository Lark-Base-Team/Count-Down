import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    createHashRouter,
    RouterProvider,
  } from "react-router-dom";
import Chart from './Chart';
import Digit from './Digit';

const router = createHashRouter([
    {
      path: '/',
      element: <App></App>
    },
    {
      path: '/chart',
      element: <Chart></Chart>
    },
    {
      path: '/digit',
      element: <Digit></Digit>
    },
  ])

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
);