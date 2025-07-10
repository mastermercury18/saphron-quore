import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { TrendingUp, BarChart3, User } from 'lucide-react';

function DashboardPage() {
  const [mastery, setMastery] = useState(null);
  const [topics, setTopics] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [profileStats, setProfileStats] = useState({ total: 0, correct: 0 });

  useEffect(() => {
    // Fetch mastery and profile info
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/stats');
        setKnowledge(res.data.knowledge || []);
        setTopics(res.data.topics || []);
        if (res.data.knowledge && res.data.knowledge.length > 0) {
          const avg = res.data.knowledge.reduce((a, b) => a + b, 0) / res.data.knowledge.length;
          setMastery(Math.round(avg * 100));
        } else {
          setMastery(null);
        }
      } catch (e) {
        setMastery(null);
      }
    };
    fetchStats();
    // Load recent activity from localStorage
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    setRecentActivity(activity);
    // Calculate profile stats
    const total = activity.length;
    const correct = activity.filter(a => a.correct).length;
    setProfileStats({ total, correct });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your learning progress, mastery, and recent activity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Progress Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle>Progress</CardTitle>
            </div>
            <CardDescription>See your overall mastery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {mastery !== null ? `${mastery}%` : '--%'}
            </div>
            <div className="text-sm text-gray-500">
              {mastery !== null ? 'Updated dynamically' : '(No data yet)'}
            </div>
            <div className="mt-4 space-y-2">
              {knowledge.map((score, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-700">{topics[idx] || `Topic ${idx}`}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div style={{ width: `${Math.round(score * 100)}%` }} className="h-2 bg-blue-500 rounded" />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(score * 100)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Recent Activity Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Latest quiz sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-gray-500">No recent activity yet.</div>
            ) : (
              <ul className="space-y-2">
                {recentActivity.slice(-7).reverse().map((a, i) => (
                  <li key={i} className="flex flex-col text-sm bg-gray-50 rounded p-2">
                    <span className="font-medium">Q: {a.question}</span>
                    <span>Your answer: {a.userAnswerText}</span>
                    <span className={a.correct ? 'text-green-600' : 'text-red-600'}>
                      {a.correct ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {/* Profile Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-pink-600" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your learning profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2">Total Questions Answered: <span className="font-bold">{profileStats.total}</span></div>
            <div className="mb-2">Accuracy: <span className="font-bold">{profileStats.total > 0 ? `${Math.round((profileStats.correct / profileStats.total) * 100)}%` : '--'}</span></div>
            <div className="mb-2">Mastery by Topic:</div>
            <ul className="text-xs space-y-1">
              {knowledge.map((score, idx) => (
                <li key={idx}>
                  {topics[idx] || `Topic ${idx}`}: {Math.round(score * 100)}%
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage; 