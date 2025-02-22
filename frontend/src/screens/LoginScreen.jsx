import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'ryowu0329@gmail.com',
    password: 'leo140814',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', formData);
      toast.success('登入成功！');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || '登入失敗');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            登入
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="電子郵件"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="密碼"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登入
            </Button>
          </form>
          <Typography align="center">
            還沒有帳號？ <Link to="/register">註冊</Link>
          </Typography>
          <Typography align="center" sx={{ mt: 1 }}>
            <Link to="/forgot-password">忘記密碼？</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginScreen;
