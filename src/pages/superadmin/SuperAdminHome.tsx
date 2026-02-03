import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect SuperAdmin to Internal Admin Dashboard
const SuperAdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/internal-admin', { replace: true });
  }, [navigate]);

  return null;
};

export default SuperAdminHome;
