'use client';
import { useState } from 'react';
import FormInput from '../atoms/FormInput';
// import { LOGIN } from '@/core/utils/queries';
import Spinner from '../loaders/SpinningLoader/SpinningLoader';
import { IoWarningOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';

// import { decodeToken } from '@/core/utils/jwtDecode';

// STORE IMPORTS
// import useUserStore from '@/store/userStore';
import FormBtn from '../atoms/buttons/FormBtn';
import { LOGIN } from '@/core/utils/queries';
import useUserStore from '@/store/userStore';
import { decodeToken } from '@/core/utils/jwtDecode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser } = useUserStore();
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      setError('pleace fill the form completely');
      setLoading(false);
      setTimeout(() => {
        setError('');
      }, 5000);
      return;
    }
    LOGIN({ email: email, password: password }).then((res: any) => {
      if (res.token) {
        // SAVE TOKEN TO LOCALSTORAGE SO I CAN BE DECODED LETTER AND USED
        localStorage.setItem('token', res.token);

        // DECODE TOKEN AND PASS USER DATE TO APP STORE
        const userData = decodeToken(res.token);
        setUser(userData);
        router.push('/');
        setLoading(false);
      } else {
        setError(`${res.message}`);
        setLoading(false);
        setTimeout(() => {
          setError('');
        }, 5000);
        return;
      }
    });
    // setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h3 className="font-bold text-[24px]">Login To Your Account</h3>
      <form
        onSubmit={handleLogin}
        className=" max-w-[25vw] w-[20vw] p-2 flex flex-col mobile:max-sm:w-[95vw] mobile:max-sm:max-w-[95vw] gap-3"
      >
        <FormInput
          label={'Email'}
          type="email"
          onChange={(e: { target: { value: any } }) => setEmail(e.target.value)}
        />

        <FormInput
          type="password"
          label={'Password'}
          onChange={(e: { target: { value: any } }) => setPassword(e.target.value)}
        />

        <FormBtn title="Login" isLoading={loading} onClick={() => handleLogin} />
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

export default Login;