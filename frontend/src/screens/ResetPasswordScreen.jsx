import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const { password, confirmPassword } = formData;

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
      await axios.put(`/api/users/reset-password/${token}`, { password });
      toast.success('密碼重設成功！');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || '密碼重設失敗');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            重設密碼
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="新密碼"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="確認新密碼"
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
              重設密碼
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordScreen;
