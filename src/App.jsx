import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/sign up/SignUp"
import SignIn from "./pages/auth/sign in/SignIn"
import Dashboard from "./pages/dashboard/Dashboard"
import useAuth from "./hooks/useAuth"
import Core from "./components/layout/core/Core"
import Transactions from "./pages/transactions/Transactions"
import Accounts from "./pages/accounts/Accounts"
import Budget from "./pages/budget/Budget"
import Reports from "./pages/reports/Reports"
import Profile from "./pages/profile/Profile"
import InvalidPage from "./pages/invalid page/InvalidPage"

const AuthLoadingScreen = () => (
  <div className="min-h-screen centerXY p-4">
    <p className="text-muted">Loading your account...</p>
  </div>
)

function App() {

  const PublicRoute = () => {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) return <AuthLoadingScreen />;

    return user ? <Navigate to="/dashboard" replace /> : <Outlet />
  }

  const ProtectedRoute = () => {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) return <AuthLoadingScreen />;

    return user ? <Outlet /> : <Navigate to="/" replace />
  }

  return (
    <>
      <BrowserRouter basename="/traced/">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route index element={<SignIn />} />
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Core />} >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<InvalidPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
