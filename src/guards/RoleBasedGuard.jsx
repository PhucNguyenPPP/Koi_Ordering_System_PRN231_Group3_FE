import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle, CircularProgress } from '@mui/material';
import useAuth from '../hooks/useAuth';
;

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { isInitialized, user } = useAuth();

  const currentRole = user?.roleName || "Null";

  // Show loading spinner while the authentication state is initializing
  if (!isInitialized) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  // If user is null or does not have the right role, deny access
  if (!user || !accessibleRoles.includes(currentRole)) {
    return (

      <Container>
        <Alert className='mt-5' style={{fontSize: '20px'}} severity="error">
          <AlertTitle style={{fontSize: '30px'}}>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
