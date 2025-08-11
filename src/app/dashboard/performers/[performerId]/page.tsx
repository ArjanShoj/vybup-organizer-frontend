'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PerformerProfile from '@/components/dashboard/performer-profile';

const PerformerProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const performerId = params.performerId as string;

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-800/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackClick}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  Performer Profile
                </span>
              </h1>
              <p className="text-slate-300 mt-2">
                Complete profile and portfolio information
              </p>
            </div>
          </div>

          {/* Performer Profile Component */}
          {performerId && (
            <PerformerProfile 
              performerId={performerId}
              showActions={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformerProfilePage;
