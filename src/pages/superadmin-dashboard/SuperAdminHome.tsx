import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect SuperAdmin to SuperAdmin Dashboard
const SuperAdminHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard/superadmin', { replace: true });
  }, [navigate]);

  return null;
};

export default SuperAdminHome;

