/**
 * App Navigator
 *
 * Defines the routing structure of the application using React Router.
 * It organizes public and protected routes, ensuring that only
 * authenticated users can access admin-related screens.
 *
 * Structure:
 * - Public Routes:
 *     Signin
 *     Forgot Password
 *     Reset Password
 * - Protected Routes: Wrapped with ProtectedRoute and DashboardLayout
 *   - Dashboard
 * - Fallback: 404 Not Found page
 */

import { Routes, Route } from "react-router-dom";

// Authentication
import Signin from "../screens/auth/Signin/Signin.auth";
import ForgotPassword from "../screens/auth/Forgot-password/ForgotPassword.auth";
import ResetPassword from "../screens/auth/Reset-password/ResetPassword.auth";

// Not Found
import NotFound from "../screens/Not-found/Not-Found";

/**
 * Application routing configuration.
 *
 * @returns {JSX.Element} The route definitions for the app.
 */
const AppNavigator = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Signin />} />
      <Route path="/super-admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/super-admin/reset-password" element={<ResetPassword />} />

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppNavigator;
