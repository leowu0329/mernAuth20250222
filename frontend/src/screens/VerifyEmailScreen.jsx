import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const VerifyEmailScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`/api/users/verify/${token}`);
        toast.success('郵件驗證成功！');
        setVerifying(false);
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || '驗證失敗');
        setVerifying(false);
        navigate('/login');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            郵件驗證
          </Typography>
          {verifying ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography align="center">
              驗證完成，正在跳轉到登入頁面...
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailScreen;
