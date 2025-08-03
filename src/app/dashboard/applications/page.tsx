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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.performer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.performer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.performer.stageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.performer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const pendingApplications = filteredApplications.filter(app => app.status === 'PENDING');
  const acceptedApplications = filteredApplications.filter(app => app.status === 'ACCEPTED');
  const rejectedApplications = filteredApplications.filter(app => app.status === 'REJECTED');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ApplicationCard = ({ application }: { application: GigApplicationResponse }) => {
    const performer = application.performer;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={performer.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {performer.firstName[0]}{performer.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {performer.firstName} {performer.lastName}
                    </h3>
                    {performer.stageName && (
                      <span className="text-sm text-gray-500">({performer.stageName})</span>
                    )}
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {performer.location}
                    </span>
                    {performer.averageRating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {performer.averageRating.toFixed(1)} ({performer.totalReviews} reviews)
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {performer.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{performer.bio}</p>
                  
                  {application.message && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">Application Message:</p>
                      <p className="text-sm text-gray-700">{application.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {performer.firstName} {performer.lastName}
                      {performer.stageName && ` (${performer.stageName})`}
                    </DialogTitle>
                    <DialogDescription>
                      Performer profile and application details
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={performer.profileImageUrl || undefined} />
                        <AvatarFallback>
                          {performer.firstName[0]}{performer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {performer.location}
                          </span>
                          {performer.averageRating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {performer.averageRating.toFixed(1)} ({performer.totalReviews} reviews)
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {performer.genres.map((genre) => (
                            <Badge key={genre} variant="secondary">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-gray-700">{performer.bio}</p>
                      </div>
                    </div>
                    
                    {application.message && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Application Message</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{application.message}</p>
                        </div>
                      </div>
                    )}
                    
                    {application.status === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="flex-1"
                          onClick={() => handleAcceptApplication(application)}
                          disabled={isActionLoading}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept Application
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <X className="h-4 w-4 mr-2" />
                              Reject Application
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Application</DialogTitle>
                              <DialogDescription>
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
                                />
                              </div>
                              
                              <div className="flex justify-end gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setActionMessage('')}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleRejectApplication(application)}
                                  disabled={isActionLoading}
                                >
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
                  <Button size="sm" className="w-full sm:w-auto">
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage performer applications for your gigs
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by performer name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length > 0 ? (
            pendingApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-500 mb-2">No pending applications</p>
                <p className="text-gray-400">New applications will appear here for review.</p>
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
            <Card>
              <CardContent className="text-center py-12">
                <Check className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-500 mb-2">No accepted applications</p>
                <p className="text-gray-400">Accepted applications will appear here.</p>
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
            <Card>
              <CardContent className="text-center py-12">
                <X className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-500 mb-2">No rejected applications</p>
                <p className="text-gray-400">Rejected applications will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsPage;