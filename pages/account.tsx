import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../hooks/useUser';

export default function Account() {
  const { user } = useUser();

  if (!user) return <p className="text-center mt-10">Please log in.</p>;

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-5">Account</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
      <Footer />
    </div>
  );
}
