import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const VerifyEmailScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('驗證中...');
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    let timeoutId;

    const verifyEmail = async () => {
      if (hasAttempted) {
        return;
      }

      try {
        const response = await axios.get(`/api/users/verify/${token}`);
        const { alreadyVerified } = response.data;

        if (alreadyVerified) {
          setVerificationStatus('此帳號已經驗證過了，即將跳轉到登入頁面...');
        } else {
          setVerificationStatus('驗證成功！即將跳轉到登入頁面...');
        }

        timeoutId = setTimeout(() => {
          setVerifying(false);
          navigate('/login');
        }, 3000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || '驗證失敗';
        setVerificationStatus(`驗證失敗：${errorMessage}`);

        timeoutId = setTimeout(() => {
          setVerifying(false);
          navigate('/login');
        }, 5000);
      }

      setHasAttempted(true);
    };

    verifyEmail();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, navigate, hasAttempted]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            郵件驗證
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" my={4}>
            {verifying && <CircularProgress sx={{ mb: 2 }} />}
            <Typography
              align="center"
              color={verificationStatus.includes('失敗') ? 'error' : 'primary'}
              variant="h6"
            >
              {verificationStatus}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailScreen;
