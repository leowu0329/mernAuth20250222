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
  Divider,
} from '@mui/material';
import {
  LogoutOutlined as LogoutIcon,
  WarningAmberOutlined as WarningIcon,
  Cancel as CancelIcon,
  CheckCircle as ConfirmIcon,
} from '@mui/icons-material';
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
      } catch {
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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#2c3e50',
            }}
          >
            歡迎回來，{user.name}！
          </Typography>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogoutClick}
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                backgroundColor: '#3498db',
                '&:hover': {
                  backgroundColor: '#2980b9',
                },
              }}
            >
              登出
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* 美化後的登出確認對話框 */}
      <Dialog
        open={openDialog}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '320px',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2,
          }}
        >
          <WarningIcon sx={{ color: '#f39c12' }} />
          <Typography variant="h6" component="span">
            確認登出
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          <DialogContentText sx={{ color: '#2c3e50' }}>
            您確定要登出系統嗎？
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            startIcon={<CancelIcon />}
            sx={{
              color: '#7f8c8d',
              '&:hover': {
                backgroundColor: '#f5f6f7',
              },
            }}
          >
            取消
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            startIcon={<ConfirmIcon />}
            sx={{
              bgcolor: '#e74c3c',
              '&:hover': {
                bgcolor: '#c0392b',
              },
            }}
          >
            確認登出
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeScreen;
