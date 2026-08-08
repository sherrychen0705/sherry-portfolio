import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutMe from './pages/AboutMe'
import HiveAi from './pages/HiveAi'
import Nexus from './pages/Nexus'
import Skinlab from './pages/Skinlab'
import Globbbe from './pages/Globbbe'
import Omnicom from './pages/Omnicom'
import Jakafi from './pages/Jakafi'
import Niktimvo from './pages/Niktimvo'
import Kevzara from './pages/Kevzara'
import Lepal from './pages/Lepal'
import NewProject from './pages/NewProject'
import NewProject2 from './pages/NewProject2'
import NewProject3 from './pages/NewProject3'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'

function App() {
  return (
    <BrowserRouter>
      <LoadingScreen />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/hiveai" element={<HiveAi />} />
        <Route path="/nexus" element={<Nexus />} />
        <Route path="/skinlab" element={<Skinlab />} />
        <Route path="/globbbe" element={<Globbbe />} />
        <Route path="/omnicom-entry" element={<Omnicom />} />
        <Route path="/jakafi" element={<Jakafi />} />
        <Route path="/niktimvo" element={<Niktimvo />} />
        <Route path="/kevzara" element={<Kevzara />} />
        <Route path="/lepal" element={<Lepal />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/new-project-2" element={<NewProject2 />} />
        <Route path="/new-project-3" element={<NewProject3 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
