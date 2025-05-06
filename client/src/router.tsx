import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/navigation';
import TopBar from '@/components/layout/top-bar';

// Import pages
import IndexRoute from './routes/index';
import ChatPage from './routes/chat';

export function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <TopBar />
      <Navigation />
      <Outlet />
      <Toaster />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<IndexRoute />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}