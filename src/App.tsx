
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ArtworkDetail from './pages/ArtworkDetail';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import { AuthProvider, RequireAuth, RequireAdmin } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          } />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/admin" element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          } />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
