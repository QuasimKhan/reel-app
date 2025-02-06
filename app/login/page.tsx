"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect authenticated users away from the login page.
  useEffect(() => {
    if (status === 'loading') return; // Wait until the session is fully loaded.
    if (session) {
      router.push('/');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use NextAuth's signIn method for the credentials provider.
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error(result.error || 'Login failed');
    } else {
      toast.success('Login successful');
      // Redirect after a short delay so the user can see the toast notification.
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  // Optionally, you can render a loader or nothing while checking the session.
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link href="/register" className="link link-hover text-sm">
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
