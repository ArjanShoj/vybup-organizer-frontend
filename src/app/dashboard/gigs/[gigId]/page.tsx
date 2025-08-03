'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Share2,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  TrendingUp,
  Music,
  Camera,
  Heart,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api';
import { GigResponse, GigApplicationResponse, PageResponse } from '@/types/api';

const GigDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const gigId = params?.gigId as string;

  const [gig, setGig] = useState<GigResponse | null>(null);
  const [applications, setApplications] = useState<GigApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Action states
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedApplication, setSelectedApplication] = useState<GigApplicationResponse | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchGigDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getGigDetails(gigId) as GigResponse;
      setGig(response);
      
      // Fetch applications if gig has any
      if (response.applicationsCount > 0) {
        await fetchApplications();
      }
    } catch (error) {
      console.error('Error fetching gig details:', error);
      setError('Failed to load gig details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      const response = await apiClient.getGigApplications(gigId, 0, 50) as PageResponse<GigApplicationResponse>;
      setApplications(response.content || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handlePublishGig = async () => {
    try {
      setActionLoading(prev => ({ ...prev, publish: true }));
      await apiClient.publishGig(gigId);
      await fetchGigDetails(); // Refresh
    } catch (error) {
      console.error('Error publishing gig:', error);
      setError('Failed to publish gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, publish: false }));
    }
  };

  const handleCompleteGig = async () => {
    try {
      setActionLoading(prev => ({ ...prev, complete: true }));
      await apiClient.completeGig(gigId);
      await fetchGigDetails(); // Refresh
    } catch (error) {
      console.error('Error completing gig:', error);
      setError('Failed to complete gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, complete: false }));
    }
  };

  const handleCancelGig = async () => {
    try {
      setActionLoading(prev => ({ ...prev, cancel: true }));
      await apiClient.cancelGig(gigId, 'Cancelled by organizer');
      await fetchGigDetails(); // Refresh
    } catch (error) {
      console.error('Error cancelling gig:', error);
      setError('Failed to cancel gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, cancel: false }));
    }
  };

  const handleAcceptApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [`accept-${selectedApplication.id}`]: true }));
      await apiClient.acceptApplication(gigId, selectedApplication.id, {});
      await fetchGigDetails(); // Refresh all data
      setAcceptDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error accepting application:', error);
      setError('Failed to accept application. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`accept-${selectedApplication?.id}`]: false }));
    }
  };

  const handleRejectApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [`reject-${selectedApplication.id}`]: true }));
      await apiClient.rejectApplication(gigId, selectedApplication.id, { reason: rejectReason });
      await fetchGigDetails(); // Refresh all data
      setRejectDialogOpen(false);
      setSelectedApplication(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting application:', error);
      setError('Failed to reject application. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject-${selectedApplication?.id}`]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'OPEN': return 'bg-green-100 text-green-800 border-green-300';
      case 'BOOKED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  useEffect(() => {
    if (gigId) {
      fetchGigDetails();
    }
  }, [gigId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded w-20"></div>
                <div className="h-9 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            
            {/* Hero skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !gig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/dashboard/gigs">
            <Button variant="ghost" className="mb-6 hover:bg-white/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gigs
            </Button>
          </Link>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gig</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={fetchGigDetails} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!gig) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/gigs">
            <Button variant="ghost" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gigs
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            {gig.status === 'DRAFT' && (
              <>
                <Link href={`/dashboard/gigs/${gigId}/edit`}>
                  <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 shadow-sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  onClick={handlePublishGig}
                  disabled={actionLoading.publish}
                  className="bg-green-600 hover:bg-green-700 shadow-sm"
                >
                  {actionLoading.publish ? 'Publishing...' : 'Publish Gig'}
                </Button>
              </>
            )}
            
            {gig.status === 'BOOKED' && (
              <Button 
                size="sm" 
                onClick={handleCompleteGig}
                disabled={actionLoading.complete}
                className="bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                {actionLoading.complete ? 'Completing...' : 'Mark as Completed'}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 shadow-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Gig
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Public View
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                {(gig.status === 'OPEN' || gig.status === 'DRAFT') && (
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600"
                    onClick={handleCancelGig}
                    disabled={actionLoading.cancel}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {actionLoading.cancel ? 'Cancelling...' : 'Cancel Gig'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <Button onClick={() => setError(null)} variant="ghost" size="sm" className="text-red-700 hover:bg-red-100">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold">{gig.title}</h1>
                  <Badge className={`${getStatusColor(gig.status)} shadow-sm`}>
                    {gig.status}
                  </Badge>
                </div>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  {gig.description}
                </p>
                
                {/* Key Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-100">Applications</p>
                        <p className="text-xl font-bold">{gig.applicationsCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-100">Payment</p>
                        <p className="text-xl font-bold">
                          {gig.pricing.currency} {gig.pricing.amountInEuros}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-100">Event Date</p>
                        <p className="text-lg font-bold">
                          {new Date(gig.eventDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applications */}
            {gig.applicationsCount > 0 ? (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        Applications ({applications.length})
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Review and manage performer applications for this gig
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {applicationsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-xl p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => {
                        // Check if performer data is available in the flattened structure
                        const hasPerformerData = application.performerFirstName || application.performerLastName || application.performerDisplayName;
                        
                        if (!hasPerformerData) {
                          return (
                            <div key={application.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <div className="text-center py-8 text-gray-500">
                                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Performer information not available</p>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={application.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="relative">
                                  <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                                    {application.performerAvatarUrl ? (
                                      <img 
                                        src={application.performerAvatarUrl} 
                                        alt={`${application.performerFirstName || ''} ${application.performerLastName || ''}`}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                        {(application.performerFirstName?.[0] || '?')}{(application.performerLastName?.[0] || '?')}
                                      </div>
                                    )}
                                  </Avatar>
                                  {application.performerRating != null && application.performerRating >= 4.5 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                      <Star className="h-3 w-3 text-white fill-current" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-bold text-gray-900">
                                      {application.performerDisplayName || 
                                       `${application.performerFirstName || ''} ${application.performerLastName || ''}`.trim() || 'Unknown Performer'}
                                    </h4>
                                    <Badge className={`${getApplicationStatusColor(application.status)} shadow-sm`}>
                                      {application.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    {application.performerRating != null && application.performerRating > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="font-medium text-gray-900">
                                          {application.performerRating.toFixed(1)}
                                        </span>
                                        <span className="text-gray-500">
                                          ({application.performerReviewCount || 0} reviews)
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  
                                  {application.performerGenres && application.performerGenres.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                      {application.performerGenres.slice(0, 3).map((genre) => (
                                        <Badge key={genre} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                          {genre}
                                        </Badge>
                                      ))}
                                      {application.performerGenres.length > 3 && (
                                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                          +{application.performerGenres.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  
                                  {application.applicationMessage && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                      <p className="text-xs font-medium text-blue-800 mb-1">Application Message</p>
                                      <p className="text-sm text-blue-700 leading-relaxed">{application.applicationMessage}</p>
                                    </div>
                                  )}
                                  
                                  <p className="text-xs text-gray-500">
                                    Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 min-w-0 sm:min-w-[140px]">
                                {application.status === 'PENDING' && gig.status === 'OPEN' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedApplication(application);
                                        setAcceptDialogOpen(true);
                                      }}
                                      disabled={actionLoading[`accept-${application.id}`]}
                                      className="bg-green-600 hover:bg-green-700 shadow-sm"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedApplication(application);
                                        setRejectDialogOpen(true);
                                      }}
                                      disabled={actionLoading[`reject-${application.id}`]}
                                      className="border-red-200 text-red-700 hover:bg-red-50 shadow-sm"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                
                                {application.status === 'ACCEPTED' && (
                                  <Link href={`/dashboard/messages?gigId=${gigId}`}>
                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Chat
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Your gig hasn't received any applications yet. Make sure it's published and promoted to attract performers.
                    </p>
                    {gig.status === 'DRAFT' && (
                      <Button onClick={handlePublishGig} disabled={actionLoading.publish} className="bg-blue-600 hover:bg-blue-700">
                        {actionLoading.publish ? 'Publishing...' : 'Publish Gig'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Gig Details */}
          <div className="space-y-6">
            {/* Event Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(gig.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(gig.eventDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{gig.locationCity || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">{gig.category}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-bold text-xl text-gray-900">
                      {gig.pricing.currency} {gig.pricing.amountInEuros}
                    </p>
                    <p className="text-sm text-gray-600">Per performance</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      Not specified
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            {gig.genres.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Music className="h-3 w-3 text-purple-600" />
                    </div>
                    Genres
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {gig.genres.map((genre) => (
                      <Badge key={genre} className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 transition-colors">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gig Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Target className="h-3 w-3 text-gray-600" />
                  </div>
                  Gig Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(gig.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Public ID</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                    {gig.publicId}
                  </code>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    {gig.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accept Application Dialog */}
        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                Accept Application
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Are you sure you want to accept <span className="font-semibold">{selectedApplication?.performerDisplayName || `${selectedApplication?.performerFirstName || ''} ${selectedApplication?.performerLastName || ''}`.trim() || 'this performer'}</span>'s application? 
                <br /><br />
                This will automatically reject all other applications and mark the gig as booked.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAcceptDialogOpen(false)} className="bg-gray-50 hover:bg-gray-100">
                Cancel
              </Button>
              <Button 
                onClick={handleAcceptApplication}
                disabled={actionLoading[`accept-${selectedApplication?.id}`]}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading[`accept-${selectedApplication?.id}`] ? 'Accepting...' : 'Accept Application'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Application Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                Reject Application
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Please provide a reason for rejecting <span className="font-semibold">{selectedApplication?.performerDisplayName || `${selectedApplication?.performerFirstName || ''} ${selectedApplication?.performerLastName || ''}`.trim() || 'this performer'}</span>'s application.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="bg-gray-50 hover:bg-gray-100">
                Cancel
              </Button>
              <Button 
                onClick={handleRejectApplication}
                disabled={actionLoading[`reject-${selectedApplication?.id}`]}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading[`reject-${selectedApplication?.id}`] ? 'Rejecting...' : 'Reject Application'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GigDetailPage;