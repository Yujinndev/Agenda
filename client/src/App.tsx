import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import SignIn from '@/pages/SignIn'
import Layout from '@/pages/Layout'
import NewEvent from '@/pages/event/NewEvent'
import Dashboard from '@/pages/Dashboard'
import EventPage from '@/pages/event/Event'

function App() {
  return (
    <Router>
      <>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/events/new" element={<NewEvent />} />
          </Routes>
        </Layout>
      </>
    </Router>
  )
}

export default App
