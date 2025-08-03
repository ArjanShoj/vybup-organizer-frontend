'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageCircle, TrendingUp } from 'lucide-react';

const ReviewsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage reviews and feedback from performers
        </p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-12">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">Reviews Coming Soon</p>
          <p className="text-gray-400">
            View and manage reviews from performers after completed gigs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsPage;