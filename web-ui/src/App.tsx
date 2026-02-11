import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Credentials from './pages/Credentials';
import Issue from './pages/Issue';
import Share from './pages/Share';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="credentials" element={<Credentials />} />
          <Route path="issue" element={<Issue />} />
          <Route path="share" element={<Share />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
