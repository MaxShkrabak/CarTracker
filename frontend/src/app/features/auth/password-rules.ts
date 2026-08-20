export interface PasswordRule {
    label: string;
    met: boolean;
}

export function passwordRules(password: string): PasswordRule[] {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'An uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'A lowercase letter', met: /[a-z]/.test(password) },
      { label: 'A number', met: /\d/.test(password) },
      { label: 'A special character', met: /[^A-Za-z0-9]/.test(password) },
    ];
}