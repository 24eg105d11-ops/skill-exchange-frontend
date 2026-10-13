import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { MySkillsPage } from './pages/MySkillsPage';
import { AddSkillPage } from './pages/AddSkillPage';
import { SkillDiscoveryPage } from './pages/SkillDiscoveryPage';
import { MatchesPage } from './pages/MatchesPage';
import { UserPublicProfilePage } from './pages/UserPublicProfilePage';
import { IncomingRequestsPage } from './pages/IncomingRequestsPage';
import { OutgoingRequestsPage } from './pages/OutgoingRequestsPage';
import { ExchangeDetailsPage } from './pages/ExchangeDetailsPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminSkillsPage } from './pages/AdminSkillsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/discovery" element={<SkillDiscoveryPage />} />
              <Route path="/ai-assistant" element={<AiAssistantPage />} />

              {/* Regular User Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/my-skills" element={<ProtectedRoute><MySkillsPage /></ProtectedRoute>} />
              <Route path="/my-skills/add" element={<ProtectedRoute><AddSkillPage /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
              <Route path="/users/:id" element={<ProtectedRoute><UserPublicProfilePage /></ProtectedRoute>} />
              <Route path="/requests/incoming" element={<ProtectedRoute><IncomingRequestsPage /></ProtectedRoute>} />
              <Route path="/requests/outgoing" element={<ProtectedRoute><OutgoingRequestsPage /></ProtectedRoute>} />
              <Route path="/exchanges/:id" element={<ProtectedRoute><ExchangeDetailsPage /></ProtectedRoute>} />
              <Route path="/conversations" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

              {/* Administrator Protected Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/skills" element={<ProtectedRoute requireAdmin><AdminSkillsPage /></ProtectedRoute>} />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
