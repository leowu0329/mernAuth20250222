import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import axios from 'axios';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/users/profile');
        setUser(res.data);
      } catch (error) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await axios.post('/api/users/logout');
      setOpenDialog(false);
      navigate('/login');
    } catch (error) {
      console.error('登出失敗', error);
    }
  };

  const handleLogoutCancel = () => {
    setOpenDialog(false);
  };

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            歡迎回來，{user.name}！
          </Typography>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogoutClick}
            >
              登出
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* 登出確認對話框 */}
      <Dialog open={openDialog} onClose={handleLogoutCancel}>
        <DialogTitle>確認登出</DialogTitle>
        <DialogContent>
          <DialogContentText>您確定要登出嗎？</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            取消
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="primary"
            variant="contained"
          >
            確認登出
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeScreen;
