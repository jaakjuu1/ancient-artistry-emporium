
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VerifyEmail = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="py-24 px-6 md:px-12 flex justify-center">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          
          <h1 className="text-3xl font-display text-mystic-900 mb-4">Check Your Email</h1>
          
          <p className="text-mystic-700 mb-8">
            We've sent you a verification link to confirm your email address. 
            Please check your inbox and click the link to complete your registration.
          </p>
          
          <div className="mt-8">
            <Link to="/auth/login" className="text-burgundy-700 hover:text-burgundy-900">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VerifyEmail;
