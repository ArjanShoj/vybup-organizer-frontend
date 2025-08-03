'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="text-center py-12">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">Settings Coming Soon</p>
          <p className="text-gray-400">
            Configure notifications, privacy settings, and account preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;