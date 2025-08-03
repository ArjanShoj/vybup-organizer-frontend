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
  DollarSign,
  Clock,
  Target,
  Award,
  Activity,
  Mail,
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Zap
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-72"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-40 mt-4 sm:mt-0"></div>
            </div>
            
            {/* Hero skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Welcome back! Here's an overview of your organizer activity.
              </p>
            </div>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800 border-green-300';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'BOOKED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const completionRate = statistics ? 
    (statistics.totalGigsCompleted / Math.max(statistics.totalGigsCreated, 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your events today.
            </p>
          </div>
          <div className="mt-6 sm:mt-0">
            <Link href="/dashboard/gigs/create">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200">
                <Plus className="h-5 w-5 mr-2" />
                Create New Gig
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Statistics Section */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-1">
                  {statistics?.totalGigsCreated || 0}
                </div>
                <p className="text-blue-100 text-sm">Total Gigs Created</p>
                <div className="mt-2 text-xs text-blue-200">
                  {statistics?.totalGigsCompleted || 0} completed
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-1">
                  {statistics?.totalApplicationsReceived || 0}
                </div>
                <p className="text-blue-100 text-sm">Applications Received</p>
                <div className="mt-2 text-xs text-blue-200">
                  Across all your gigs
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-1">
                  {statistics?.averageRating?.toFixed(1) || 'N/A'}
                </div>
                <p className="text-blue-100 text-sm">Average Rating</p>
                <div className="mt-2 text-xs text-blue-200">
                  {statistics?.totalReviews || 0} reviews total
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-1">
                  €{statistics?.totalAmountPaid ? (statistics.totalAmountPaid / 100).toFixed(0) : '0'}
                </div>
                <p className="text-blue-100 text-sm">Total Earnings</p>
                <div className="mt-2 text-xs text-blue-200">
                  From completed gigs
                </div>
              </div>
            </div>

            {/* Progress Section */}
            {statistics && statistics.totalGigsCreated > 0 && (
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">Completion Rate</span>
                  <span className="text-sm font-semibold">{completionRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks to help you manage your events
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Link href="/dashboard/gigs/create" className="block">
                <Button variant="outline" className="w-full justify-start h-12 text-left hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Create New Gig</div>
                      <div className="text-xs text-gray-500">Post a new event for performers</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-blue-600" />
                </Button>
              </Link>
              
              <Link href="/dashboard/applications" className="block">
                <Button variant="outline" className="w-full justify-start h-12 text-left hover:bg-green-50 hover:border-green-200 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Review Applications</div>
                      <div className="text-xs text-gray-500">Manage performer applications</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-green-600" />
                </Button>
              </Link>
              
              <Link href="/dashboard/messages" className="block">
                <Button variant="outline" className="w-full justify-start h-12 text-left hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Check Messages</div>
                      <div className="text-xs text-gray-500">Communicate with performers</div>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {unreadMessagesCount > 0 && (
                      <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
                        {unreadMessagesCount}
                      </Badge>
                    )}
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600" />
                  </div>
                </Button>
              </Link>

              <div className="pt-4 border-t">
                <Link href="/dashboard/gigs" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Gigs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Gigs */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    Recent Gigs
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Your latest event postings and their current status
                  </CardDescription>
                </div>
                <Link href="/dashboard/gigs">
                  <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                    View All
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentGigs.map((gig) => (
                  <div key={gig.gigId} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{gig.title}</h3>
                            <p className="text-sm text-gray-600">{gig.locationCity}</p>
                          </div>
                          <Badge className={`${getStatusColor(gig.status)} shadow-sm`}>
                            {gig.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-3 w-3 text-blue-600" />
                            </div>
                            <span>{new Date(gig.eventDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="h-3 w-3 text-green-600" />
                            </div>
                            <span>{gig.applicationsCount} applications</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                              <DollarSign className="h-3 w-3 text-yellow-600" />
                            </div>
                            <span className="font-medium">€{gig.pricing.amountInEuros}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <Link href={`/dashboard/gigs/${gig.gigId}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                            View Details
                            <ArrowUpRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentGigs.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Create Your First Gig?</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start by posting your first event and connect with talented performers in your area.
                    </p>
                    <Link href="/dashboard/gigs/create">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Gig
                        <Sparkles className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        {statistics && statistics.totalGigsCreated > 0 && (
          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                Performance Insights
              </CardTitle>
              <CardDescription>
                Track your success as an event organizer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    {completionRate.toFixed(0)}%
                  </div>
                  <p className="text-sm text-green-700">Completion Rate</p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    {statistics.totalApplicationsReceived > 0 ? 
                      (statistics.totalApplicationsReceived / statistics.totalGigsCreated).toFixed(1) : '0'}
                  </div>
                  <p className="text-sm text-blue-700">Avg Applications per Gig</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {statistics.averageRating?.toFixed(1) || 'N/A'}
                  </div>
                  <p className="text-sm text-purple-700">Organizer Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;