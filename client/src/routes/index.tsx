import { Navigate } from 'react-router-dom';

export default function IndexRoute() {
  return <Navigate to="/chat" replace />;
}