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

import NotFoundPage from '@/components/NotFoundPage'
import ProtectedRoute from '@/utils/ProtectedRoute'
import PersistAuth from '@/utils/PersistAuth'
import { AuthProvider } from '@/context/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <Router>
        <>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route element={<PersistAuth />}>
                <Route path="/onboarding/signin" element={<SignIn />} />
                <Route path="/onboarding/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path="/events" element={<Outlet />}>
                    <Route path="new/" element={<NewEvent />} />
                    <Route path="browse/" element={<EventPage />} />
                    <Route path="my-events/" element={<MyEvents />} />
                    <Route path="detail/:id/" element={<EventDetails />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </>
      </Router>
    </AuthProvider>
  )
}

export default App
