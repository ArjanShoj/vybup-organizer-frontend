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
      case 'OPEN': return 'bg-green-100 text-green-800 border-green-300';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'BOOKED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
            
            {/* Filter skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-48 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            
            {/* Gigs skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="h-9 bg-gray-200 rounded w-32"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Gigs 🎭
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your event postings and track performer applications
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

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find specific gigs by title, location, category, or status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="text-gray-400 h-5 w-5" />
                  </div>
                  <Input
                    placeholder="Search gigs by title, location, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400 text-base"
                  />
                </div>
              </div>
              <div className="sm:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
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
          <Card className="mb-8 border-red-200 bg-red-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error Loading Gigs</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <Button onClick={() => fetchGigs()} variant="ghost" size="sm" className="text-red-700 hover:bg-red-100">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gigs List */}
        <div className="space-y-6 relative">
          {isLoading && gigs.length > 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-gray-700 font-medium">Loading gigs...</span>
              </div>
            </div>
          )}
          
          {gigs.map((gig) => {
            const StatusIcon = getStatusIcon(gig.status);
            return (
              <Card key={gig.gigId} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                          <StatusIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
                            <Badge className={`${getStatusColor(gig.status)} shadow-sm`}>
                              {gig.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{gig.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600 font-medium">Location</p>
                            <p className="text-sm font-semibold text-green-900">{gig.locationCity}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-600 font-medium">Event Date</p>
                            <p className="text-sm font-semibold text-blue-900">
                              {new Date(gig.eventDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-purple-600 font-medium">Applications</p>
                            <p className="text-sm font-semibold text-purple-900">{gig.applicationsCount}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-xs text-yellow-600 font-medium">Payment</p>
                            <p className="text-sm font-semibold text-yellow-900">
                              €{gig.pricing.amountInEuros} {gig.priceType === 'HOURLY' && '/hr'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {gig.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {gig.genres.map((genre) => (
                            <Badge key={genre} className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors">
                              <Music className="h-3 w-3 mr-1" />
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-8 lg:min-w-[200px]">
                      <Link href={`/dashboard/gigs/${gig.gigId}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                          <ArrowUpRight className="h-3 w-3 ml-2" />
                        </Button>
                      </Link>
                      
                      {gig.status === 'DRAFT' && (
                        <div className="flex gap-2">
                          <Link href={`/dashboard/gigs/${gig.gigId}/edit`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-50 shadow-sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => handlePublishGig(gig.gigId)}
                            disabled={actionLoading[gig.gigId]}
                            className="bg-green-600 hover:bg-green-700 shadow-sm"
                          >
                            {actionLoading[gig.gigId] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
                          className="bg-purple-600 hover:bg-purple-700 shadow-sm"
                        >
                          {actionLoading[gig.gigId] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          ) : (
                            <Activity className="h-4 w-4 mr-2" />
                          )}
                          Complete
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 shadow-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>Share Gig</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          {(gig.status === 'OPEN' || gig.status === 'DRAFT') && (
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
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
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  {searchTerm || statusFilter !== 'all' ? (
                    <>
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gigs Found</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        No gigs match your current search criteria. Try adjusting your filters or search terms.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                          }}
                          className="bg-white hover:bg-gray-50"
                        >
                          Clear Filters
                        </Button>
                        <Link href="/dashboard/gigs/create">
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Gig
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {gigs.length > 0 && totalPages > 1 && (
          <Card className="mt-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
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
                    className="bg-white hover:bg-gray-50 shadow-sm"
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
                            isCurrentPage 
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm" 
                              : "bg-white hover:bg-gray-50 shadow-sm"
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
                    className="bg-white hover:bg-gray-50 shadow-sm"
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