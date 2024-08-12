import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import Home from '@/pages/Home'
import Layout from '@/pages/Layout'
import SignIn from '@/pages/SignIn'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'

import EventsPage from '@/pages/event/Events'
import MyEvents from '@/pages/event/MyEvents'
import NewEvent from '@/pages/event/NewEvent'
import ResponseForm from '@/pages/ResponseForm'
import FeedbackForm from '@/pages/event/FeedbackForm'
import EventDetails from '@/pages/event/EventDetails'
import PublicEventDetail from '@/pages/event/PublicEventDetail'

import GroupsPage from '@/pages/group/Groups'
import MyGroups from '@/pages/group/MyGroups'
import NewGroup from '@/pages/group/NewGroup'
import GroupDetails from '@/pages/group/GroupDetails'
import PublicGroupDetail from '@/pages/group/PublicGroupDetail'

import PersistAuth from '@/utils/PersistAuth'
import ProtectedRoute from '@/utils/ProtectedRoute'
import ScrollToAnchor from '@/utils/ScrollToAnchor'
import NotFoundPage from '@/components/NotFoundPage'
import { AuthProvider } from '@/context/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToAnchor />

        <Routes>
          <Route element={<Layout />}>
            <Route element={<PersistAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="/response-form" element={<ResponseForm />} />
              <Route path="/events/browse/" element={<EventsPage />} />
              <Route path="/groups/browse/" element={<GroupsPage />} />
              <Route path="/onboarding/signin" element={<SignIn />} />
              <Route path="/onboarding/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<Outlet />}>
                  <Route path="new/" element={<NewEvent />} />
                  <Route path="my-events/" element={<MyEvents />} />
                  <Route path="feedback/:id/" element={<FeedbackForm />} />
                  <Route path="detail/:id/" element={<EventDetails />} />
                  <Route path="browse/p/:id" element={<PublicEventDetail />} />
                </Route>
                <Route path="/groups" element={<Outlet />}>
                  <Route path="new/" element={<NewGroup />} />
                  <Route path="my-groups/" element={<MyGroups />} />
                  <Route path="detail/:id/" element={<GroupDetails />} />
                  <Route path="browse/p/:id" element={<PublicGroupDetail />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
