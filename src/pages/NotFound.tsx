
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout showSidebars={false}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <div className="glass-card p-10 max-w-md animate-fade-up">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-orbitron font-bold mb-2 text-glow">404</h1>
          <h2 className="text-xl font-medium mb-4">Page Not Found</h2>
          
          <p className="text-gray-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
            Return to home to explore the VYB-R8R platform.
          </p>
          
          <Button className="bg-white text-black hover:bg-white/90 inline-flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
