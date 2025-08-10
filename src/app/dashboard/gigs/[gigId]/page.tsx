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
      case 'DRAFT': return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
      case 'OPEN': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'BOOKED': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'COMPLETED': return 'bg-purple-600/20 text-purple-400 border border-purple-600/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'ACCEPTED': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  useEffect(() => {
    if (gigId) {
      fetchGigDetails();
    }
  }, [gigId]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 ">
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
            <div className="content-card p-8 ">
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
                <div className="h-64 content-card"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 content-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !gig) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/dashboard/gigs">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gigs
            </Button>
          </Link>
          <Card className="luxury-card">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Gig</h3>
                <p className="text-slate-300 mb-6">{error}</p>
                <Button onClick={fetchGigDetails}>
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/gigs">
            <Button variant="outline" className="shadow-sm">
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
                <Button variant="outline" size="sm" className="shadow-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl">
                <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Gig
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Public View
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800">Duplicate</DropdownMenuItem>
                {(gig.status === 'OPEN' || gig.status === 'DRAFT') && (
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 hover:bg-red-900 focus:bg-red-900"
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
          <Card className="mb-8 border border-red-500/30 bg-red-500/10 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
                <Button onClick={() => setError(null)} variant="ghost" size="sm" className="text-red-300 hover:bg-red-500/20">
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
              <Card className="border border-purple-500/20 bg-slate-900/60 text-white shadow-xl">
                <CardHeader className="relative overflow-hidden border-b border-purple-500/25 bg-gradient-to-r from-purple-600/15 via-purple-500/10 to-fuchsia-500/10">
                  <span className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
                  <span className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="relative z-10 flex items-center gap-2 text-lg font-extrabold text-white">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">Applications</span>
                        <span className="text-slate-300">({applications.length})</span>
                      </CardTitle>
                      <CardDescription className="relative z-10 mt-1 text-slate-300">
                        Review and manage performer applications for this gig
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {applicationsLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-slate-700 rounded w-1/2 mb-3"></div>
                              <div className="h-3 bg-slate-700 rounded w-3/4"></div>
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
                            <div key={application.id} className="bg-slate-800/60 rounded-xl p-6 border border-purple-500/20">
                              <div className="text-center py-8 text-slate-400">
                                <Users className="h-8 w-8 mx-auto mb-2 text-purple-400/60" />
                                <p className="text-slate-300">Performer information not available</p>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={application.id} className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="relative">
                                  <Avatar className="h-16 w-16 border-2 border-slate-900 shadow-lg">
                                    {application.performerAvatarUrl ? (
                                      <img 
                                        src={application.performerAvatarUrl} 
                                        alt={`${application.performerFirstName || ''} ${application.performerLastName || ''}`}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {(application.performerFirstName?.[0] || '?')}{(application.performerLastName?.[0] || '?')}
                                      </div>
                                    )}
                                  </Avatar>
                                  {application.performerRating != null && application.performerRating >= 4.5 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                      <Star className="h-3 w-3 text-white fill-current" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-bold text-white">
                                      {application.performerDisplayName || 
                                       `${application.performerFirstName || ''} ${application.performerLastName || ''}`.trim() || 'Unknown Performer'}
                                    </h4>
                                    <Badge className={`${getApplicationStatusColor(application.status)} shadow-sm`}>
                                      {application.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm text-slate-300 mb-3">
                                    {application.performerRating != null && application.performerRating > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-purple-400 fill-current" />
                                        <span className="font-medium text-white">
                                          {application.performerRating.toFixed(1)}
                                        </span>
                                        <span className="text-slate-400">
                                          ({application.performerReviewCount || 0} reviews)
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  
                                  {application.performerGenres && application.performerGenres.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                      {application.performerGenres.slice(0, 3).map((genre) => (
                                        <Badge key={genre} variant="outline" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30">
                                          {genre}
                                        </Badge>
                                      ))}
                                      {application.performerGenres.length > 3 && (
                                        <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300">
                                          +{application.performerGenres.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  
                                  {application.applicationMessage && (
                                    <div className="bg-slate-800/60 border border-purple-500/20 rounded-lg p-3 mb-4">
                                      <p className="text-xs font-medium text-purple-300 mb-1">Application Message</p>
                                      <p className="text-sm text-slate-200 leading-relaxed">{application.applicationMessage}</p>
                                    </div>
                                  )}
                                  
                                  <p className="text-xs text-slate-400">
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
                                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 shadow-sm"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                
                                {application.status === 'ACCEPTED' && (
                                  <Link href={`/dashboard/messages?gigId=${gigId}`}>
                                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 shadow-sm">
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
              <Card className="border border-purple-500/20 bg-slate-900/60 text-white shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-slate-300 mb-6">
                      Your gig hasn't received any applications yet. Make sure it's published and promoted to attract performers.
                    </p>
                    {gig.status === 'DRAFT' && (
                      <Button onClick={handlePublishGig} disabled={actionLoading.publish} className="bg-purple-600 hover:bg-purple-700">
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
            <Card className="border border-purple-500/20 bg-slate-900/60 text-white shadow-xl">
              <CardHeader className="relative overflow-hidden border-b border-purple-500/25 bg-gradient-to-r from-purple-600/15 via-purple-500/10 to-fuchsia-500/10">
                <span className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
                <span className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <CardTitle className="relative z-10 flex items-center gap-2 text-lg font-extrabold text-white">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <Calendar className="h-3 w-3 text-purple-400" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">Event Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Event Date & Time</p>
                    <p className="font-semibold text-white">
                      {new Date(gig.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-slate-300">
                      {new Date(gig.eventDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Location</p>
                    <p className="font-semibold text-white">{gig.locationCity || 'Not specified'}</p>
                    <p className="text-sm text-slate-300">{gig.category}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Payment</p>
                    <p className="font-bold text-xl text-white">
                      {gig.pricing.currency} {gig.pricing.amountInEuros}
                    </p>
                    <p className="text-sm text-slate-300">Per performance</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Duration</p>
                    <p className="font-semibold text-white">
                      Not specified
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            {gig.genres.length > 0 && (
              <Card className="border border-purple-500/20 bg-slate-900/60 text-white shadow-xl">
                <CardHeader className="relative overflow-hidden border-b border-purple-500/25 bg-gradient-to-r from-purple-600/15 via-purple-500/10 to-fuchsia-500/10">
                  <span className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
                  <span className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
                  <CardTitle className="relative z-10 flex items-center gap-2 text-lg font-extrabold text-white">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                      <Music className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">Genres</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {gig.genres.map((genre) => (
                      <Badge key={genre} className="bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gig Info */}
            <Card className="border border-purple-500/20 bg-slate-900/60 text-white shadow-xl">
              <CardHeader className="relative overflow-hidden border-b border-purple-500/25 bg-gradient-to-r from-purple-600/15 via-purple-500/10 to-fuchsia-500/10">
                <span className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
                <span className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <CardTitle className="relative z-10 flex items-center gap-2 text-lg font-extrabold text-white">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                    <Target className="h-3 w-3 text-purple-400" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">Gig Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-white">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Created</span>
                  <span className="font-medium text-white">
                    {new Date(gig.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Public ID</span>
                  <code className="px-2 py-1 bg-slate-800 border border-purple-500/20 rounded text-xs font-mono text-slate-200">
                    {gig.publicId}
                  </code>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Category</span>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                    {gig.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accept Application Dialog */}
        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent className="sm:max-w-md bg-slate-900 text-white border border-slate-700">
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
              <Button
                variant="outline"
                onClick={() => setAcceptDialogOpen(false)}
                className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              >
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
          <DialogContent className="sm:max-w-md bg-slate-900 text-white border border-slate-700">
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
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              >
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