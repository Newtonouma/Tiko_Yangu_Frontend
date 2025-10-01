import HeroSection from './components/heros/HeroSection'
import NavBar from './components/navbar/NavBar'

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <HeroSection />
    </div>
  )
}
