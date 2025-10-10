export function getPasswordStrength(password: string): string {
    if (password.length > 0) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      if (regex.test(password)) {
        return 'Strong';
      } else if (password.length >= 8) {
        return 'Medium';
      } else if (password.length >= 1) {
        return 'Weak';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }