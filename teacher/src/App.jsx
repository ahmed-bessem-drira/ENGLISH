import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Classes from './pages/Classes';
import ClassDetails from './pages/ClassDetails';
import CreateLesson from './pages/CreateLesson';
import LessonBuilder from './pages/LessonBuilder';
import LessonResults from './pages/LessonResults';
import StudentResults from './pages/StudentResults';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetails />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="lessons/create" element={<CreateLesson />} />
            <Route path="lessons/:id/builder" element={<LessonBuilder />} />
            <Route path="lessons/:id/results" element={<LessonResults />} />
            <Route path="lessons/:id/results/:studentId" element={<StudentResults />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;