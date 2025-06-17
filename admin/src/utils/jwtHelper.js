export const getUserRoleFromToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role; // e.g. "ROLE_SUPER_ADMIN"
  } catch (error) {
    return '';
  }
};
