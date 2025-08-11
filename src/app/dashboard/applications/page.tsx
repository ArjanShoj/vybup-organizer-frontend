'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter,
  Calendar,
  MapPin,
  Star,
  MessageSquare,
  Check,
  X,
  Eye,
  User,
  Clock,
  Briefcase
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GigApplicationResponse, PerformerSummary, GigResponse, PageResponse } from '@/types/api';
import { apiClient } from '@/lib/api';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<GigApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<GigApplicationResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // First, fetch all gigs for the organizer
      const gigsResponse: PageResponse<GigResponse> = await apiClient.getGigs(0, 100); // Fetch up to 100 gigs
      const gigs = gigsResponse.content;
      
      if (gigs.length === 0) {
        setApplications([]);
        return;
      }
      
      // For each gig, fetch its applications
      const allApplications: GigApplicationResponse[] = [];
      
      for (const gig of gigs) {
        try {
          const applicationsResponse: PageResponse<GigApplicationResponse> = await apiClient.getGigApplications(gig.gigId, 0, 100);
          allApplications.push(...applicationsResponse.content);
        } catch (error) {
          console.warn(`Failed to fetch applications for gig ${gig.gigId}:`, error);
          // Continue with other gigs even if one fails
        }
      }
      
      // Sort applications by applied date (newest first)
      allApplications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      
      setApplications(allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setHasError(true);
      toast.error('Failed to load applications. Please try again.');
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAcceptApplication = async (application: GigApplicationResponse) => {
    setIsActionLoading(true);
    try {
      await apiClient.acceptApplication(application.gigId, application.id, {
        reason: 'Application accepted'
      });
      
      setApplications(prev =>
        prev.map(app =>
          app.id === application.id
            ? { ...app, status: 'ACCEPTED' as const }
            : app
        )
      );
      
      const performerName = application.performerDisplayName || 
        `${application.performerFirstName || ''} ${application.performerLastName || ''}`.trim() || 
        'Performer';
      
      toast.success(`Accepted application from ${performerName}`);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error('Failed to accept application. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectApplication = async (application: GigApplicationResponse) => {
    if (!actionMessage.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsActionLoading(true);
    try {
      await apiClient.rejectApplication(application.gigId, application.id, {
        reason: actionMessage.trim()
      });
      
      setApplications(prev =>
        prev.map(app =>
          app.id === application.id
            ? { ...app, status: 'REJECTED' as const }
            : app
        )
      );
      
      const performerName = application.performerDisplayName || 
        `${application.performerFirstName || ''} ${application.performerLastName || ''}`.trim() || 
        'Performer';
      
      toast.success(`Rejected application from ${performerName}`);
      setSelectedApplication(null);
      setActionMessage('');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'ACCEPTED': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default: return 'bg-slate-700/40 text-slate-300 border border-slate-600/60';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.performerFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.performerLastName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.performerDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.gigTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const pendingApplications = filteredApplications.filter(app => app.status === 'PENDING');
  const acceptedApplications = filteredApplications.filter(app => app.status === 'ACCEPTED');
  const rejectedApplications = filteredApplications.filter(app => app.status === 'REJECTED');

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-slate-800 rounded-lg border border-purple-500/20"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-800/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Applications</span>
              </h1>
            </div>
            
            <Card className="border border-red-500/20 bg-slate-900/60 text-white">
              <CardContent className="text-center py-16">
                <X className="h-16 w-16 mx-auto mb-6 text-red-400" />
                <h3 className="text-xl font-semibold text-slate-300 mb-3">Failed to Load Applications</h3>
                <p className="text-slate-400 mb-6">
                  There was an error loading your applications. Please check your connection and try again.
                </p>
                <Button 
                  onClick={fetchApplications}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const ApplicationCard = ({ application }: { application: GigApplicationResponse }) => {
    const performerName = application.performerDisplayName || 
      `${application.performerFirstName || ''} ${application.performerLastName || ''}`.trim() || 
      'Unknown Performer';
    
    return (
      <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-dark-800/90 to-dark-900/90 border border-purple-500/20 backdrop-blur-xl text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-slate-900 shadow-sm">
                  {application.performerAvatarUrl ? (
                    <AvatarImage src={application.performerAvatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      {(application.performerFirstName?.[0] || '?')}{(application.performerLastName?.[0] || '?')}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">
                      {performerName}
                    </h3>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-300 mb-2">
                    {application.performerRating != null && application.performerRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-purple-400 fill-current" />
                        {application.performerRating.toFixed(1)} ({application.performerReviewCount} reviews)
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-slate-400">{new Date(application.appliedAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm font-medium text-slate-300">Gig: </span>
                    <span className="text-sm text-white">{application.gigTitle}</span>
                  </div>
                  
                  {application.performerGenres && application.performerGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {application.performerGenres.map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                   {application.applicationMessage && (
                    <div className="bg-dark-800/60 border border-purple-500/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-white mb-1">Application Message:</p>
                      <p className="text-sm text-slate-200">{application.applicationMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
              {/* View Profile Button */}
              <Link href={`/dashboard/performers/${application.performerId}`}>
                <Button variant="outline" size="sm" className="w-full border-purple-500/30 text-slate-200 hover:bg-purple-500/10">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>

              {/* Action Buttons - Only show for PENDING applications */}
              {application.status === 'PENDING' && (
                <>
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleAcceptApplication(application)}
                    disabled={isActionLoading}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border border-purple-500/20 bg-slate-900 text-white">
                      <DialogHeader>
                        <DialogTitle>Decline Application</DialogTitle>
                        <DialogDescription className="text-slate-300">
                          Please provide a reason for declining this application.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rejection-reason">Reason for declining</Label>
                          <Textarea
                            id="rejection-reason"
                            value={actionMessage}
                            onChange={(e) => setActionMessage(e.target.value)}
                            placeholder="Explain why this application doesn't fit your requirements..."
                            rows={3}
                            className="bg-slate-800/60 border-purple-500/20 text-slate-100 placeholder:text-slate-400"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={() => setActionMessage('')}>
                            Cancel
                          </Button>
                          <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleRejectApplication(application)} disabled={isActionLoading}>
                            Decline Application
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              {application.status === 'ACCEPTED' && (
                <Link href={`/dashboard/messages`}>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-800/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Applications</span>
              </h1>
              <p className="text-slate-300 mt-2">
                Review and manage performer applications for your gigs
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-gradient-to-br from-dark-800/90 to-dark-900/90 border border-purple-500/20 backdrop-blur-xl text-white">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search by performer name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800/60 border-purple-500/20 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-800/60 border-purple-500/20 text-slate-100">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-purple-500/20 text-slate-100">
                      <SelectItem value="all" className="focus:bg-slate-800">All Status</SelectItem>
                      <SelectItem value="pending" className="focus:bg-slate-800">Pending</SelectItem>
                      <SelectItem value="accepted" className="focus:bg-slate-800">Accepted</SelectItem>
                      <SelectItem value="rejected" className="focus:bg-slate-800">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications Tabs */}
          {applications.length > 0 ? (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-dark-900/50 border border-purple-500/20 backdrop-blur">
                <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">
                  Pending ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="accepted" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">
                  Accepted ({acceptedApplications.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">
                  Rejected ({rejectedApplications.length})
                </TabsTrigger>
              </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingApplications.length > 0 ? (
                pendingApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              ) : (
                <Card className="border border-purple-500/20 bg-slate-900/60 text-white">
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-lg font-medium text-slate-300 mb-2">No pending applications</p>
                    <p className="text-slate-400">New applications will appear here for review.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {acceptedApplications.length > 0 ? (
                acceptedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              ) : (
                <Card className="border border-purple-500/20 bg-slate-900/60 text-white">
                  <CardContent className="text-center py-12">
                    <Check className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-lg font-medium text-slate-300 mb-2">No accepted applications</p>
                    <p className="text-slate-400">Accepted applications will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedApplications.length > 0 ? (
                rejectedApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              ) : (
                <Card className="border border-purple-500/20 bg-slate-900/60 text-white">
                  <CardContent className="text-center py-12">
                    <X className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-lg font-medium text-slate-300 mb-2">No rejected applications</p>
                    <p className="text-slate-400">Rejected applications will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
          ) : (
            <Card className="border border-purple-500/20 bg-slate-900/60 text-white">
              <CardContent className="text-center py-16">
                <Briefcase className="h-16 w-16 mx-auto mb-6 text-slate-500" />
                <h3 className="text-xl font-semibold text-slate-300 mb-3">No Applications Yet</h3>
                <p className="text-slate-400 mb-6">
                  You haven't received any applications for your gigs yet. When performers apply to your gigs, their applications will appear here.
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>💡 Make sure your gigs are published and have clear descriptions</p>
                  <p>🎵 Add relevant genres and location details to attract more performers</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;