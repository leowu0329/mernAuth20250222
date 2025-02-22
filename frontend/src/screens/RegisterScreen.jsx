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

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'ryowu',
    email: 'ryowu0329@gmail.com',
    password: 'leo140814',
    confirmPassword: 'leo140814',
  });

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('密碼不匹配');
      return;
    }
    try {
      const res = await axios.post('/api/users', {
        name,
        email,
        password,
      });
      toast.success('註冊成功！請查收驗證郵件');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || '註冊失敗');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            註冊
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="姓名"
              name="name"
              value={name}
              onChange={handleChange}
              margin="normal"
              required
            />
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
            <TextField
              fullWidth
              label="確認密碼"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
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
              註冊
            </Button>
          </form>
          <Typography align="center">
            已有帳號？ <Link to="/login">登入</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterScreen;
