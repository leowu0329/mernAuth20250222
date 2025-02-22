import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/forgot-password', { email });
      setIsSubmitted(true);
      toast.success('重設密碼郵件已發送，請查收');
    } catch (error) {
      toast.error(error.response?.data?.message || '發送重設密碼郵件失敗');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            忘記密碼
          </Typography>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="電子郵件"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                發送重設密碼郵件
              </Button>
            </form>
          ) : (
            <Typography align="center">
              重設密碼郵件已發送，請查收您的信箱
            </Typography>
          )}
          <Typography align="center">
            <Link to="/login">返回登入</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordScreen;
