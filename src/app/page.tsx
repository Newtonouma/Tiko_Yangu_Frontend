import { AuthProvider } from './contexts/AuthContext'
import HeroSection from './components/heros/HeroSection'
import NavBar from './components/navbar/NavBar'

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <NavBar />
        <HeroSection />
      </div>
    </AuthProvider>
  )
}
