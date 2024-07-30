import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import Home from '@/pages/Home'
import SignIn from '@/pages/SignIn'
import Layout from '@/pages/Layout'
import NewEvent from '@/pages/event/NewEvent'
import Dashboard from '@/pages/Dashboard'
import EventPage from '@/pages/event/Event'
import MyEvents from '@/pages/event/MyEvents'
import Register from '@/pages/Register'
import EventDetails from '@/pages/event/EventDetails'
import ResponseForm from '@/pages/ResponseForm'
import PublicEventDetail from '@/pages/event/PublicEventDetail'

import NotFoundPage from '@/components/NotFoundPage'
import ProtectedRoute from '@/utils/ProtectedRoute'
import PersistAuth from '@/utils/PersistAuth'
import { AuthProvider } from '@/context/AuthProvider'
import EventGroups from './pages/event/EventGroups'
import NewGroup from './pages/event/NewGroup'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/response-form" element={<ResponseForm />} />
            <Route path="/events/browse/" element={<EventPage />} />
            <Route path="/events/group/" element={<EventGroups />} />

            <Route element={<PersistAuth />}>
              <Route path="/onboarding/signin" element={<SignIn />} />
              <Route path="/onboarding/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/events" element={<Outlet />}>
                  <Route path="new/" element={<NewEvent />} />
                  <Route path="create-group/" element={<NewGroup />} />
                  <Route path="my-events/" element={<MyEvents />} />
                  <Route path="detail/:id/" element={<EventDetails />} />
                  <Route
                    path="browse/p/event/:id"
                    element={<PublicEventDetail />}
                  />
                  <Route
                    path="browse/p/group/:id"
                    element={<PublicEventDetail />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
