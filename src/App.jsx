
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Footer from './component/sites/footer'
import Navbar from './component/sites/navbar'
import HomeLanding from './component/routes/home-landing'
import Generate from './component/routes/generate'
import Pricing from './component/routes/pricing'
import About from './component/routes/about'
import Contact from './component/routes/contect'
import ThemeToggle from './component/themetoggle'
import Login from './component/auth/Login'
import Signup from './component/auth/Signup'
import { AuthProvider } from './context/AuthContext'
import PaymentSuccess from './component/PaymentSuccess'
import ForgotPassword from './component/auth/ForgotPassword'
import { AdminImage } from './component/admin/AdminImage'
import AdminRoute from './component/admin/AdminRoute'
import Unauthorized from './component/pages/Unauthorized'

function App() {
  return (
    <AuthProvider>
      <main className="min-h-dvh bg-card text-foreground">
        <BrowserRouter>
          <Navbar />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<HomeLanding />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/adminImagePage"
                element={
                  <AdminRoute>
                    <AdminImage />
                  </AdminRoute>
                }
              />
              <Route path="/unauthorized" element={< Unauthorized />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </main>
    </AuthProvider>
  )
}

export default App
