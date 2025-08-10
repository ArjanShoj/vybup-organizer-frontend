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
import { GigApplicationResponse, PerformerSummary } from '@/types/api';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<GigApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<GigApplicationResponse | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Simulated applications data since backend is not running
        setApplications([
          {
            id: 'app-1',
            gigId: '1',
            performerId: 'perf-1',
            performer: {
              id: 'perf-1',
              firstName: 'Sarah',
              lastName: 'Johnson',
              stageName: 'SJ Jazz',
              profileImageUrl: null,
              genres: ['Jazz', 'Blues', 'Soul'],
              location: 'Amsterdam',
              bio: 'Professional jazz vocalist with 10+ years of experience performing at corporate events and private parties.',
              averageRating: 4.9,
              totalReviews: 42
            },
            status: 'PENDING',
            message: 'I have extensive experience performing jazz music at corporate events. I can provide a full three-piece ensemble with piano and bass. My repertoire includes classic standards and contemporary jazz arrangements perfect for your event.',
            appliedAt: '2024-01-21T14:30:00Z'
          },
          {
            id: 'app-2',
            gigId: '1',
            performerId: 'perf-2',
            performer: {
              id: 'perf-2',
              firstName: 'Marcus',
              lastName: 'Williams',
              stageName: 'The Jazz Collective',
              profileImageUrl: null,
              genres: ['Jazz', 'Fusion', 'Blues'],
              location: 'Amsterdam',
              bio: 'Award-winning jazz trio specializing in sophisticated background music for corporate and private events.',
              averageRating: 4.7,
              totalReviews: 28
            },
            status: 'PENDING',
            message: 'Our trio has performed at numerous corporate events including those for major banks and tech companies. We pride ourselves on creating the perfect ambient atmosphere while maintaining the highest level of professionalism.',
            appliedAt: '2024-01-21T16:45:00Z'
          },
          {
            id: 'app-3',
            gigId: '2',
            performerId: 'perf-3',
            performer: {
              id: 'perf-3',
              firstName: 'Alex',
              lastName: 'Rodriguez',
              stageName: 'DJ Alex R',
              profileImageUrl: null,
              genres: ['House', 'Pop', 'R&B', 'Dance'],
              location: 'Rotterdam',
              bio: 'Professional wedding DJ with over 8 years of experience. Specializing in reading the crowd and keeping the dance floor packed all night.',
              averageRating: 4.8,
              totalReviews: 95
            },
            status: 'ACCEPTED',
            message: 'I would love to DJ your wedding reception! I have extensive experience with weddings and always work closely with couples to ensure their special day is perfect. I bring a premium sound system and lighting setup.',
            appliedAt: '2024-01-19T09:15:00Z'
          },
          {
            id: 'app-4',
            gigId: '1',
            performerId: 'perf-4',
            performer: {
              id: 'perf-4',
              firstName: 'Emma',
              lastName: 'Thompson',
              stageName: null,
              profileImageUrl: null,
              genres: ['Jazz', 'Classical', 'Pop'],
              location: 'Utrecht',
              bio: 'Classically trained pianist with jazz specialization. Perfect for elegant background music at corporate events.',
              averageRating: 4.6,
              totalReviews: 18
            },
            status: 'REJECTED',
            message: 'I would be delighted to perform at your corporate event. As a solo pianist, I can provide elegant jazz standards that create the perfect atmosphere for networking and conversation.',
            appliedAt: '2024-01-20T11:20:00Z'
          }
        ]);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAcceptApplication = async (application: GigApplicationResponse) => {
    setIsActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prev =>
        prev.map(app =>
          app.id === application.id
            ? { ...app, status: 'ACCEPTED' as const }
            : app
        )
      );
      
      toast.success(`Accepted application from ${application.performer.firstName} ${application.performer.lastName}`);
      setSelectedApplication(null);
    } catch (error) {
      toast.error('Failed to accept application');
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prev =>
        prev.map(app =>
          app.id === application.id
            ? { ...app, status: 'REJECTED' as const }
            : app
        )
      );
      
      toast.success(`Rejected application from ${application.performer.firstName} ${application.performer.lastName}`);
      setSelectedApplication(null);
      setActionMessage('');
    } catch (error) {
      toast.error('Failed to reject application');
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
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-slate-200 hover:bg-purple-500/10" onClick={() => setSelectedApplication(application)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl border border-purple-500/20 bg-slate-900 text-white">
                  <DialogHeader>
                    <DialogTitle>
                      {performerName}
                    </DialogTitle>
                    <DialogDescription className="text-slate-300">
                      Performer profile and application details for "{application.gigTitle}"
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-slate-900">
                        {application.performerAvatarUrl ? (
                          <AvatarImage src={application.performerAvatarUrl} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-lg">
                            {(application.performerFirstName?.[0] || '?')}{(application.performerLastName?.[0] || '?')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1">
                        {application.performerRating != null && application.performerRating > 0 && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 text-purple-400 fill-current" />
                            <span className="font-medium text-white">{application.performerRating.toFixed(1)}</span>
                            <span className="text-slate-400">({application.performerReviewCount} reviews)</span>
                          </div>
                        )}
                        
                        {application.performerGenres && application.performerGenres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {application.performerGenres.map((genre) => (
                              <Badge key={genre} variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {application.applicationMessage && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Application Message</h4>
                        <div className="bg-slate-800/60 border border-purple-500/20 p-4 rounded-lg">
                          <p className="text-slate-200">{application.applicationMessage}</p>
                        </div>
                      </div>
                    )}
                    
                    {application.status === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptApplication(application)}
                          disabled={isActionLoading}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept Application
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10">
                              <X className="h-4 w-4 mr-2" />
                              Reject Application
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border border-purple-500/20 bg-slate-900 text-white">
                            <DialogHeader>
                              <DialogTitle>Reject Application</DialogTitle>
                              <DialogDescription className="text-slate-300">
                                Please provide a reason for rejecting this application.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="rejection-reason">Reason for rejection</Label>
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
                                  Reject Application
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              {application.status === 'ACCEPTED' && (
                <Link href={`/dashboard/messages`}>
                  <Button size="sm" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
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
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;