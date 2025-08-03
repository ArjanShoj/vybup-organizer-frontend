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
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { GigResponse, PageResponse } from '@/types/api';
import { apiClient } from '@/lib/api';

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
      case 'OPEN': return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'BOOKED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePublishGig = async (gigId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [gigId]: true }));
      await apiClient.publishGig(gigId);
      await fetchGigs(); // Refresh the list
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
      await fetchGigs(); // Refresh the list
    } catch (error) {
      console.error('Error completing gig:', error);
      setError('Failed to complete gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [gigId]: false }));
    }
  };

  const handleCancelGig = async (gigId: string) => {
    const reason = prompt('Please provide a reason for cancelling this gig:');
    if (!reason) return;

    try {
      setActionLoading(prev => ({ ...prev, [gigId]: true }));
      await apiClient.cancelGig(gigId, reason);
      await fetchGigs(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling gig:', error);
      setError('Failed to cancel gig. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [gigId]: false }));
    }
  };

  if (isLoading && gigs.length === 0) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Gigs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your gig postings and track applications
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search gigs by title, location, or category..."
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchGigs()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gigs List */}
      <div className="space-y-4 relative">
        {isLoading && gigs.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {gigs.map((gig) => (
          <Card key={gig.gigId} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{gig.title}</h3>
                        <Badge className={getStatusColor(gig.status)}>
                          {gig.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{gig.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {gig.locationCity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(gig.eventDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {gig.applicationsCount} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          €{gig.pricing.amountInEuros} {gig.priceType === 'HOURLY' && '/hr'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {gig.genres.map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                  <Link href={`/dashboard/gigs/${gig.gigId}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  {gig.status === 'DRAFT' && (
                    <Link href={`/dashboard/gigs/${gig.gigId}/edit`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto"
                        disabled={actionLoading[gig.gigId]}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {gig.status === 'DRAFT' && (
                        <DropdownMenuItem onClick={() => handlePublishGig(gig.gigId)}>
                          Publish Gig
                        </DropdownMenuItem>
                      )}
                      {gig.status === 'BOOKED' && (
                        <DropdownMenuItem onClick={() => handleCompleteGig(gig.gigId)}>
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      {(gig.status === 'OPEN' || gig.status === 'DRAFT') && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleCancelGig(gig.gigId)}
                        >
                          Cancel Gig
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {gigs.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== 'all' ? (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No gigs found</p>
                    <p>Try adjusting your search or filters.</p>
                  </>
                ) : (
                  <>
                    <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No gigs created yet</p>
                    <p className="mb-4">Create your first gig to start finding performers.</p>
                    <Link href="/dashboard/gigs/create">
                      <Button>Create Your First Gig</Button>
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} gigs
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0 || isLoading}
                >
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
                        className="w-8 h-8 p-0"
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
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GigsPage;