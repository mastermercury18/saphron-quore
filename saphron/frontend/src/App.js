import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  LinearProgress,
  Grid,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            <SchoolIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Adaptive Learning System
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Powered by Quantum-Inspired Reinforcement Learning
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Question Area */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                {currentQuestion && (
                  <>
                    <Box display="flex" alignItems="center" mb={3}>
                      <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="primary">
                        Question #{currentQuestion.qid + 1}
                      </Typography>
                      <Chip 
                        label={`Topic ${currentQuestion.topic}`} 
                        color="secondary" 
                        size="small" 
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
                      {currentQuestion.question}
                    </Typography>

                    {!feedback && (
                      <>
                        <RadioGroup
                          value={selectedAnswer}
                          onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                        >
                          {currentQuestion.options.map((option, index) => (
                            <FormControlLabel
                              key={index}
                              value={index}
                              control={<Radio />}
                              label={option}
                              sx={{
                                mb: 1,
                                p: 1,
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                            />
                          ))}
                        </RadioGroup>

                        <Box mt={3}>
                          <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={selectedAnswer === null || submitting}
                            fullWidth
                          >
                            {submitting ? <CircularProgress size={24} /> : 'Submit Answer'}
                          </Button>
                        </Box>
                      </>
                    )}

                    {feedback && (
                      <Box>
                        <Alert 
                          severity={feedback.correct ? "success" : "error"}
                          icon={feedback.correct ? <CheckCircleIcon /> : <CancelIcon />}
                          sx={{ mb: 3 }}
                        >
                          <Typography variant="h6">
                            {feedback.feedback}
                          </Typography>
                        </Alert>

                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleNextQuestion}
                          fullWidth
                        >
                          Next Question
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Knowledge Progress Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
              <Box display="flex" alignItems="center" mb={3}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Knowledge Progress
                </Typography>
              </Box>

              {knowledge.length > 0 && (
                <Box>
                  {knowledge.map((score, index) => (
                    <Box key={index} mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Topic {index}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {(score * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={score * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Knowledge Chart */}
              {knowledge.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Progress Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={knowledge.map((score, index) => ({ topic: `T${index}`, score: score * 100 }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Mastery']} />
                      <Bar dataKey="score" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
