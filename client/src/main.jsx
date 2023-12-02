import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import { Error, Home, Score, Login, Logout, Profile, Play } from './pages/index.js';

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
        path: '/highscores',
        element: <Score />
      },
      {
        path: '/login',
        element: <Login signup={false} />
      },
      {
        path: '/signup',
        element: <Login signup={true} />
      },
      {
        path: '/logout',
        element: <Logout />
      },
      {
        path: '/profiles/:username',
        element: <Profile />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/play',
        element: <Play />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
