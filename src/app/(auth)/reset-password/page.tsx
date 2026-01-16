import ResetPasswordForm from '@/components/modules/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
};
const ResetPasswordPage = () => {
  return (
    <>
      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
