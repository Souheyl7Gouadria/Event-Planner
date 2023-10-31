import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { queryClient } from './util/http';
import { QueryClientProvider } from '@tanstack/react-query';
import Events from './components/Events/Events.jsx';
import EventDetails from './components/Events/EventDetails.jsx';
import NewEvent from './components/Events/NewEvent.jsx';
import EditEvent , {loader as editEventLoader , action as EditEventAction} from './components/Events/EditEvent.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/events" />,
  },
  {
    path: '/events',
    element: <Events />,

    children: [
      {
        path: '/events/new',
        element: <NewEvent />,
      },
    ],
  },
  {
    path: '/events/:id',
    element: <EventDetails />,
    children: [
      {
        path: '/events/:id/edit',
        element: <EditEvent />,
        loader: editEventLoader,
        // here don't need to add any additional parameters to the editEventLoader function because the params object is already provided 
        action: EditEventAction,
      },
    ],
  },
]);

function App() {
  return <QueryClientProvider client={queryClient}> <RouterProvider router={router} /> </QueryClientProvider>;
}

export default App;
