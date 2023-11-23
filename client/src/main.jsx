import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import { Error, Home, Signup, Login, Profile } from './pages/index.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <App error={<Error />} />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/profiles/:username',
        element: <Profile />
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
