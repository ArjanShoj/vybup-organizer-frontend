'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your payments and billing
        </p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-12">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">Payment Management Coming Soon</p>
          <p className="text-gray-400">
            Track your payments, manage billing, and view transaction history.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;