import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Join from './pages/Join';
import SessionStart from './pages/SessionStart';
import Question from './pages/Question';
import Result from './pages/Result';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/session/:token" element={<SessionStart />} />
        <Route path="/session/:token/question" element={<Question />} />
        <Route path="/session/:token/result" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;