import SignInForm from '@/components/modules/auth/SignInForm';

export const metadata = {
  title: 'Sign In',
  description: 'Sign In to your account',
};

const SignInPage = () => {
  return (
    <>
      <SignInForm />
    </>
  );
};

export default SignInPage;
