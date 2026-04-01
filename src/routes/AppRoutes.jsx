import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home.jsx';
import { QuizSession } from '../pages/QuizSession.jsx';
import { Results } from '../pages/Results.jsx';
import { StudentJoin } from '../pages/StudentJoin.jsx';
import { TeacherDashboard } from '../pages/TeacherDashboard.jsx';
import { MyProfile } from '../pages/MyProfile.jsx';
import { GlobalLeaderboard } from '../pages/GlobalLeaderboard.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<StudentJoin />} />
      <Route path="/teacher/:sessionId" element={<TeacherDashboard />} />
      <Route path="/play/:sessionId" element={<QuizSession />} />
      <Route path="/play/:sessionId/results" element={<Results />} />
      <Route path="/me" element={<MyProfile />} />
      <Route path="/leaderboard/global" element={<GlobalLeaderboard />} />
    </Routes>
  );
}
