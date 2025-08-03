'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Users, 
  Star, 
  TrendingUp, 
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { GigResponse, OrganizerStatisticsDto, PageResponse } from '@/types/api';

const DashboardPage = () => {
  const [statistics, setStatistics] = useState<OrganizerStatisticsDto | null>(null);
  const [recentGigs, setRecentGigs] = useState<GigResponse[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        
        // Make parallel API calls for better performance
        const [
          statisticsResponse,
          gigsResponse,
          unreadCountResponse
        ] = await Promise.allSettled([
          apiClient.getStatistics(),
          apiClient.getGigs(0, 5), // Get first 5 gigs for recent gigs display
          apiClient.getTotalUnreadCount()
        ]);

        // Handle statistics
        if (statisticsResponse.status === 'fulfilled') {
          setStatistics(statisticsResponse.value as OrganizerStatisticsDto);
        } else {
          console.error('Failed to fetch statistics:', statisticsResponse.reason);
        }

        // Handle gigs
        if (gigsResponse.status === 'fulfilled') {
          const gigsData = gigsResponse.value as PageResponse<GigResponse>;
          setRecentGigs(gigsData.content || []);
        } else {
          console.error('Failed to fetch gigs:', gigsResponse.reason);
        }

        // Handle unread messages count
        if (unreadCountResponse.status === 'fulfilled') {
          const unreadData = unreadCountResponse.value as { count?: number };
          setUnreadMessagesCount(unreadData.count || 0);
        } else {
          console.error('Failed to fetch unread count:', unreadCountResponse.reason);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's an overview of your organizer activity.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'BOOKED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's an overview of your organizer activity.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/gigs/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Gig
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalGigsCreated || 0}</div>
            <p className="text-xs text-muted-foreground">
              {statistics?.totalGigsCompleted || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalApplicationsReceived || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all your gigs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.averageRating?.toFixed(1) || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.totalReviews || 0} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{statistics?.totalAmountPaid ? (statistics.totalAmountPaid / 100).toFixed(0) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {unreadMessagesCount > 0 && `${unreadMessagesCount} unread messages`}
              {unreadMessagesCount === 0 && 'All messages read'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/gigs/create" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Gig
              </Button>
            </Link>
            <Link href="/dashboard/applications" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Review Applications
              </Button>
            </Link>
            <Link href="/dashboard/messages" className="block">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Check Messages
                {unreadMessagesCount > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white">
                    {unreadMessagesCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Gigs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Gigs</CardTitle>
            <CardDescription>
              Your latest gig postings and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGigs.map((gig) => (
                <div key={gig.gigId} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{gig.title}</h3>
                      <Badge className={getStatusColor(gig.status)}>
                        {gig.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{gig.locationCity}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(gig.eventDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {gig.applicationsCount} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        €{gig.pricing.amountInEuros}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link href={`/dashboard/gigs/${gig.gigId}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {recentGigs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No gigs created yet.</p>
                  <Link href="/dashboard/gigs/create">
                    <Button className="mt-2">Create Your First Gig</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;