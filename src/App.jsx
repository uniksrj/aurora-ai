
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

function App() {
  return (
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
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </main>
  )
}

export default App
