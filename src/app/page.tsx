import HeroSection from './components/heros/HeroSection'
import NavBar from './components/navbar/NavBar'
import EventsSection from './components/events/EventsSection'
import StatisticsSection from './components/statistics/StatisticsSection'
import Footer from './components/footer/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <HeroSection />
      <EventsSection />
      <StatisticsSection />
      <Footer />
    </div>
  )
}
