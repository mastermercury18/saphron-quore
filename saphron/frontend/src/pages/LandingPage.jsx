import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="max-w-xl w-full bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="flex flex-col items-center">
          <div className="relative mb-2">
            <Brain className="h-14 w-14 text-blue-600" />
            <Sparkles className="h-7 w-7 text-purple-500 absolute -top-3 -right-3 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">Welcome to Saphron Quore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg text-gray-700">
            Experience adaptive, quantum-inspired learning. Our AI personalizes your journey, helping you master every topic efficiently and enjoyably.
          </p>
          <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => navigate('/quiz')}>
            Start Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default LandingPage; 