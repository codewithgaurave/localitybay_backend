import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { ROUTES } from "./constants/routes";
import { HomePage } from "./components/HomePage";
import { UserProfile } from "./components/UserProfile";
import { EditProfile } from "./components/EditProfile";
import { MeetupListing } from "./components/MeetupListing";
import { MeetupDetails } from "./components/MeetupDetails";
import { CreateMeetup } from "./components/CreateMeetup";
import { CommunitiesPage } from "./components/CommunitiesPage";
import { ChatGroupListing } from "./components/ChatGroupListing";
import { CreateChatGroup } from "./components/CreateChatGroup";
import { ChatGroupDetail } from "./components/ChatGroupDetail";
import { NoticesPage } from "./components/NoticesPage";
import { CreateNotice } from "./components/CreateNotice";
import { CreateAdvertisement } from "./components/CreateAdvertisement";
import { LocalAdvertisement } from "./components/LocalAdvertisement";
import { ServicesPage } from "./components/ServicesPage";
import { ServiceMessagesPage } from "./components/ServiceMessagesPage";
import { RegisterServiceProvider } from "./components/RegisterServiceProvider";
import { AdminPanel } from "./components/AdminPanel";
import { WalkthroughPage } from "./components/WalkthroughPage";
import { VerificationRequest } from "./components/VerificationRequest";
import { SettingsPage } from "./components/SettingsPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { InterestsSelection } from "./components/InterestsSelection";
import { PhotoUpload } from "./components/PhotoUpload";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.HOME} replace />
  );
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Profile Routes */}
        <Route path="profile" element={<UserProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />

        {/* Meetup Routes */}
        <Route path="meetups" element={<MeetupListing />} />
        <Route path="meetups/:id" element={<MeetupDetails />} />
        <Route path="create-meetup" element={<CreateMeetup />} />

        {/* Communities (formerly Messages) */}
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="chat-groups" element={<ChatGroupListing />} />
        <Route path="chat-groups/:id" element={<ChatGroupDetail />} />
        <Route path="create-chat-group" element={<CreateChatGroup />} />

        {/* Notices Routes */}
        <Route path="notices" element={<NoticesPage />} />
        <Route path="create-notice" element={<CreateNotice />} />
        <Route path="create-advertisement" element={<CreateAdvertisement />} />

        {/* Services Routes */}
        <Route path="services" element={<ServicesPage />} />
        <Route path="service-messages" element={<ServiceMessagesPage />} />
        <Route path="register-service" element={<RegisterServiceProvider />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminPanel />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Other Routes */}
        <Route path="local-ad" element={<LocalAdvertisement />} />
        <Route path="walkthrough" element={<WalkthroughPage />} />
        <Route path="verification" element={<VerificationRequest />} />
        <Route path="interests-selection" element={<InterestsSelection />} />
        <Route path="photo-upload" element={<PhotoUpload />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
