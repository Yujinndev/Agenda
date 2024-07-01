import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import SignIn from '@/pages/SignIn'
import Layout from '@/pages/Layout'
import NewEvent from '@/pages/event/NewEvent'
import Dashboard from '@/pages/Dashboard'
import EventPage from '@/pages/event/Event'
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
                <Route path="/signin" element={<SignIn />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/events" element={<EventPage />} />
                  <Route path="/events/new" element={<NewEvent />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </>
      </Router>
    </AuthProvider>
  )
}

export default App
