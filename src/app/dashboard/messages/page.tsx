'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock } from 'lucide-react';

const MessagesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Communicate with your hired performers
        </p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">Messages Coming Soon</p>
          <p className="text-gray-400">
            Chat functionality will be available when you accept performer applications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage;