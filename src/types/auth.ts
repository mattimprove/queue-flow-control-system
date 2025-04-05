
export interface AuthFormProps {
  onSwitchMode: () => void;
}

export interface SignupFormProps extends AuthFormProps {
  onSignupSuccess: () => void;
}

export interface LoginFormProps extends AuthFormProps {
  onLoginSuccess?: () => void;
}
