import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  BookOpen, 
  Target,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/question');
      setCurrentQuestion(response.data);
      setSelectedAnswer(null);
      setFeedback(null);
      setKnowledge(response.data.knowledge || []);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    try {
      setSubmitting(true);
      const response = await axios.post('http://localhost:5001/api/submit', {
        answer: selectedAnswer
      });
      setFeedback(response.data);
      setKnowledge(response.data.knowledge || []);

      // Store recent activity in localStorage
      if (currentQuestion) {
        const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        const userAnswerText = currentQuestion.options[selectedAnswer];
        const correct = response.data.correct;
        const now = new Date();
        const time = now.toLocaleString();
        activity.push({
          question: currentQuestion.question,
          userAnswer: selectedAnswer,
          userAnswerText,
          correct,
          time
        });
        // Keep only the last 20
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(-20)));
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    fetchQuestion();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your learning session...</h2>
          <p className="text-gray-500">Preparing quantum-inspired questions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Brain className="h-12 w-12 text-blue-600" />
            <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Adaptive Learning System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Powered by Quantum-Inspired Reinforcement Learning
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Question Area */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl">
                    Question #{currentQuestion?.qid + 1}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Topic {currentQuestion?.topic}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestion && (
                <>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {currentQuestion.question}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={selectedAnswer === idx ? 'default' : 'outline'}
                        className={`w-full h-12 text-lg font-medium ${selectedAnswer === idx ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedAnswer(idx)}
                        disabled={!!feedback}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  {feedback && (
                    <div className="mt-6">
                      <Alert variant={feedback.correct ? 'default' : 'destructive'}>
                        <AlertDescription className="flex items-center space-x-2">
                          {feedback.correct ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span>{feedback.feedback}</span>
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={handleNextQuestion}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 mt-4"
                      >
                        Next Question
                      </Button>
                    </div>
                  )}
                  {!feedback && (
                    <Button
                      onClick={handleSubmit}
                      className="w-full h-12 text-lg font-semibold mt-4"
                      disabled={selectedAnswer === null || submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Knowledge Progress Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <CardTitle>Knowledge Progress</CardTitle>
              </div>
              <CardDescription>
                Your mastery level across different topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {knowledge.map((score, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Topic {idx}</span>
                    <Progress value={score * 100} className="flex-1" />
                    <span className="text-xs text-gray-500">{Math.round(score * 100)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default QuizPage; 