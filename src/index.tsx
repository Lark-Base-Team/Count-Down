import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import LoadApp from './components/LoadApp';

const router = createHashRouter([
  {
    path: '/',
    element: <App></App>
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LoadApp>
      <RouterProvider router={router}></RouterProvider>
    </LoadApp>
  </React.StrictMode>
);