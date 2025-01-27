'use client';
import { useState } from 'react';
import FormInput from '../atoms/FormInput';
import { getProfile, SIGNUP as SIGHUP } from '@/core/utils/queries';
import { IoWarningOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { decodeToken } from '@/core/utils/jwtDecode';

// STORE IMPORTS
import useUserStore from '@/store/userStore';
import { useRouter, usePathname } from 'next/navigation';
import FormBtn from '../atoms/buttons/FormBtn';

type PropTypes = {
  onSuccessSignUp?: () => void;
};

const SignUp = ({ onSuccessSignUp }: PropTypes) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser } = useUserStore();
  const router = useRouter();
  const pathName = usePathname();

  const handleSignUp = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password) {
      setError('please fill the form completely');
      setLoading(false);
      setTimeout(() => {
        setError('');
      }, 5000);
      return;
    }
    SIGHUP({ name, email, password }).then(async (res: any) => {
      if (res.access_token) {
        localStorage.setItem('token', res.access_token);
        const { id } = decodeToken(res.access_token);
        const user = await getProfile(id);
        setUser(user);
        if (!pathName.includes('auth')) {
          onSuccessSignUp && onSuccessSignUp();
        } else {
          router.push('/');
        }
        setLoading(false);
      } else {
        setError(`${res.message} try to login`);
        setLoading(false);
        setTimeout(() => {
          setError('');
        }, 5000);
        return;
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h3 className="font-bold text-[24px]">Create Your Account</h3>
      <form
        onSubmit={handleSignUp}
        className="max-w-[25vw] w-[20vw] p-2 flex flex-col mobile:max-sm:w-[95vw] mobile:max-sm:max-w-[95vw] gap-3"
      >
        <FormInput
          label={'Name'}
          onChange={(e: { target: { value: any } }) => setName(e.target.value)}
        />
        <FormInput
          label={'Email'}
          onChange={(e: { target: { value: any } }) => setEmail(e.target.value)}
        />

        <FormInput
          label="password"
          onChange={(e: { target: { value: any } }) => setPassword(e.target.value)}
        />
        <p id="password-description " className="password-description text-xs">
          Use at least 8 characters with a mix of letters, numbers, and symbols.
        </p>

        <FormBtn title="Sign Up" onClick={() => handleSignUp} isLoading={loading} />
        {error && (
          <motion.p
            initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-300 p-4 flex justify-center items-center text-xs gap-1 mobile:max-sm:mb-4"
          >
            <IoWarningOutline
              style={{
                color: 'yellow'
              }}
              size={20}
            />

            {error}
          </motion.p>
        )}
      </form>
    </div>
  );
};

export default SignUp;
