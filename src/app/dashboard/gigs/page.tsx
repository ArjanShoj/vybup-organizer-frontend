'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal,
  Briefcase,
  Activity,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Music,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { GigResponse, PageResponse } from '@/types/api';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

const GigsPage = () => {
  const [gigs, setGigs] = useState<GigResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Action loading states
  const [actionLoading, setActionLoading] = useState<{ [gigId: string]: boolean }>({});

  const fetchGigs = async (page: number = currentPage, search: string = '', status: string = statusFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getGigs(page, pageSize) as PageResponse<GigResponse>;
      
      setGigs(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(response.number);
      
    } catch (error) {
      console.error('Error fetching gigs:', error);
      setError('Failed to load gigs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGigs();
  }, []);

  // Fetch on page change
  useEffect(() => {
    if (currentPage > 0) {
      fetchGigs(currentPage);
    }
  }, [currentPage]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 0) {
        fetchGigs(0, searchTerm, statusFilter);
      } else {
        setCurrentPage(0);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'DRAFT': return 'status-draft';
      case 'BOOKED': return 'status-booked';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-draft';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return Target;
      case 'DRAFT': return Edit;
      case 'BOOKED': return Users;
      case 'COMPLETED': return Activity;
      case 'CANCELLED': return Clock;
      default: return Briefcase;
    }
  };

  const handlePublishGig = async (gigId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [gigId]: true }));
      await apiClient.publishGig(gigId);
      await fetchGigs(); // Refresh
    } catch (error) {
      console.error('Error publishing gig:', error);
      setError('Failed to publish gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [gigId]: false }));
    }
  };

  const handleCompleteGig = async (gigId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [gigId]: true }));
      await apiClient.completeGig(gigId);
      await fetchGigs(); // Refresh
    } catch (error) {
      console.error('Error completing gig:', error);
      setError('Failed to complete gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [gigId]: false }));
    }
  };

  const handleCancelGig = async (gigId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [gigId]: true }));
      await apiClient.cancelGig(gigId, 'Cancelled by organizer');
      await fetchGigs(); // Refresh
    } catch (error) {
      console.error('Error cancelling gig:', error);
      setError('Failed to cancel gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [gigId]: false }));
    }
  };

  if (isLoading && gigs.length === 0) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="page-header">
              <div>
                <div className="h-8 bg-dark-700/50 rounded w-48 mb-2"></div>
                <div className="h-4 bg-dark-700/50 rounded w-72"></div>
              </div>
              <div className="h-10 bg-dark-700/50 rounded w-40 mt-4 sm:mt-0"></div>
            </div>
            
            {/* Filter skeleton */}
            <div className="luxury-card">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-10 bg-dark-700/50 rounded-lg"></div>
                <div className="w-48 h-10 bg-dark-700/50 rounded-lg"></div>
              </div>
            </div>
            
            {/* Gigs skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="luxury-card">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-dark-700/50 rounded-lg"></div>
                        <div>
                          <div className="h-6 bg-dark-700/50 rounded w-48 mb-2"></div>
                          <div className="h-4 bg-dark-700/50 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-dark-700/50 rounded w-full mb-4"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-dark-700/50 rounded w-24"></div>
                        <div className="h-4 bg-dark-700/50 rounded w-32"></div>
                        <div className="h-4 bg-dark-700/50 rounded w-28"></div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="h-9 bg-dark-700/50 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="gradient-text">My Gigs</span> 🎭
            </h1>
            <p className="page-subtitle">
              Manage your event postings and track performer applications
            </p>
          </div>
          <div className="mt-6 sm:mt-0">
            <Link href="/dashboard/gigs/create">
              <Button size="lg" className="gold-glow">
                <Plus className="h-5 w-5 mr-2" />
                Create New Gig
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
          <Card className="search-container">
          <CardHeader className="bg-transparent border-b border-gold-500/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4" />
              </div>
              Search & Filter
            </CardTitle>
            <CardDescription className="text-dark-300">
              Find specific gigs by title, location, category, or status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="text-purple-400 h-5 w-5" />
                  </div>
                  <Input
                    placeholder="Search gigs by title, location, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base"
                  />
                </div>
              </div>
              <div className="sm:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-dark-400" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="luxury-card mb-8 border-red-500/30 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="icon-container icon-danger">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-medium">Error Loading Gigs</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
                <Button onClick={() => fetchGigs()} variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gigs List */}
        <div className="space-y-6 relative">
          {isLoading && gigs.length > 0 && (
            <div className="absolute inset-0 bg-dark-900/75 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="flex items-center gap-3 bg-dark-800/90 border border-gold-500/20 p-4 rounded-lg shadow-lg backdrop-blur-md">
                <div className="loading-spinner"></div>
                <span className="text-white font-medium">Loading gigs...</span>
              </div>
            </div>
          )}
          
          {gigs.map((gig) => {
            const StatusIcon = getStatusIcon(gig.status);
            return (
              <Card key={gig.gigId} className="luxury-card hover-lift">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center shadow-lg">
                          <StatusIcon className="h-6 w-6 text-dark-900" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{gig.title}</h3>
                            <Badge className={`${getStatusColor(gig.status)} shadow-sm`}>
                              {gig.status}
                            </Badge>
                          </div>
                          <p className="text-dark-300 mb-4 leading-relaxed line-clamp-2">{gig.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                          <div className="icon-container icon-success">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-green-400 font-medium">Location</p>
                            <p className="text-sm font-semibold text-white">{gig.locationCity}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-secondary-500/20 rounded-lg border border-secondary-500/30">
                          <div className="icon-container icon-secondary">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-secondary-400 font-medium">Event Date</p>
                            <p className="text-sm font-semibold text-white">
                              {new Date(gig.eventDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg border border-gold-500/20">
                          <div className="icon-container bg-dark-600/50 border border-dark-500/30 text-dark-300">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-dark-400 font-medium">Applications</p>
                            <p className="text-sm font-semibold text-white">{gig.applicationsCount}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gold-500/20 rounded-lg border border-gold-500/30">
                          <div className="icon-container icon-primary">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gold-400 font-medium">Payment</p>
                            <p className="text-sm font-semibold text-white">
                              €{gig.pricing.amountInEuros} {gig.priceType === 'HOURLY' && '/hr'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {gig.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {gig.genres.map((genre) => (
                            <Badge key={genre} variant="outline" className="bg-dark-700/50 text-dark-300 border-dark-500/50 hover:bg-dark-600/50 transition-colors">
                              <Music className="h-3 w-3 mr-1" />
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-8 lg:min-w-[200px]">
                      <Link href={`/dashboard/gigs/${gig.gigId}`}>
                        <Button className="w-full" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                          <ArrowUpRight className="h-3 w-3 ml-2" />
                        </Button>
                      </Link>
                      
                      {gig.status === 'DRAFT' && (
                        <div className="flex gap-2">
                          <Link href={`/dashboard/gigs/${gig.gigId}/edit`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => handlePublishGig(gig.gigId)}
                            disabled={actionLoading[gig.gigId]}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            {actionLoading[gig.gigId] ? (
                              <div className="loading-spinner w-4 h-4"></div>
                            ) : (
                              <Zap className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}

                      {gig.status === 'BOOKED' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteGig(gig.gigId)}
                          disabled={actionLoading[gig.gigId]}
                          variant="secondary"
                        >
                          {actionLoading[gig.gigId] ? (
                            <div className="loading-spinner w-4 h-4 mr-2"></div>
                          ) : (
                            <Activity className="h-4 w-4 mr-2" />
                          )}
                          Complete
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>Share Gig</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          {(gig.status === 'OPEN' || gig.status === 'DRAFT') && (
                            <DropdownMenuItem 
                              className="text-red-400 focus:text-red-400"
                              onClick={() => handleCancelGig(gig.gigId)}
                              disabled={actionLoading[gig.gigId]}
                            >
                              {actionLoading[gig.gigId] ? 'Cancelling...' : 'Cancel Gig'}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {gigs.length === 0 && !isLoading && (
            <Card className="luxury-card">
              <CardContent className="pt-6">
                <div className="empty-state">
                  {searchTerm || statusFilter !== 'all' ? (
                    <>
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-dark-600 to-dark-700 rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-dark-400" />
                      </div>
                      <h3 className="empty-state-title">No Gigs Found</h3>
                      <p className="empty-state-description">
                        No gigs match your current search criteria. Try adjusting your filters or search terms.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                        <Link href="/dashboard/gigs/create">
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Gig
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center">
                        <Briefcase className="h-10 w-10 text-dark-900" />
                      </div>
                      <h3 className="empty-state-title">Ready to Create Your First Gig?</h3>
                      <p className="empty-state-description">
                        Start by posting your first event and connect with talented performers in your area.
                      </p>
                      <Link href="/dashboard/gigs/create">
                        <Button size="lg" className="gold-glow">
                          <Plus className="h-5 w-5 mr-2" />
                          Create Your First Gig
                          <Sparkles className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {gigs.length > 0 && totalPages > 1 && (
          <Card className="luxury-card mt-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-dark-300">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} gigs
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = Math.max(0, Math.min(currentPage - 2 + i, totalPages - 5 + i));
                      const isCurrentPage = pageNumber === currentPage;
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={isCurrentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          disabled={isLoading}
                          className={cn(
                            "w-10 h-10 p-0",
                            isCurrentPage && "gold-glow"
                          )}
                        >
                          {pageNumber + 1}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GigsPage;