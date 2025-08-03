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
import { GigResponse } from '@/types/api';

const GigsPage = () => {
  const [gigs, setGigs] = useState<GigResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        // Simulated gigs data since backend is not running
        setGigs([
          {
            gigId: '1',
            publicId: 'GIG-001',
            organizerId: 'org-1',
            title: 'Jazz Trio for Corporate Event',
            description: 'Looking for a professional jazz trio for our annual company gathering. The event will be held in a sophisticated venue with excellent acoustics.',
            category: 'Music',
            genres: ['Jazz', 'Blues'],
            locationCity: 'Amsterdam',
            eventDate: '2024-02-15T19:00:00Z',
            applicationDeadline: '2024-02-10T23:59:59Z',
            pricing: {
              amountInCents: 75000,
              currency: 'EUR',
              amountInEuros: 750
            },
            priceType: 'FIXED',
            isNegotiable: false,
            paymentMethod: 'STRIPE_CONNECT',
            status: 'OPEN',
            applicationsCount: 8,
            canApply: true,
            createdAt: '2024-01-20T10:00:00Z'
          },
          {
            gigId: '2',
            publicId: 'GIG-002',
            organizerId: 'org-1',
            title: 'Wedding Reception DJ',
            description: 'Need an experienced DJ for a wedding reception. Must be able to read the crowd and play a mix of genres.',
            category: 'DJ',
            genres: ['Pop', 'Dance', 'R&B'],
            locationCity: 'Rotterdam',
            eventDate: '2024-02-28T20:00:00Z',
            pricing: {
              amountInCents: 50000,
              currency: 'EUR',
              amountInEuros: 500
            },
            priceType: 'FIXED',
            isNegotiable: true,
            paymentMethod: 'CASH',
            status: 'BOOKED',
            applicationsCount: 12,
            canApply: false,
            createdAt: '2024-01-18T14:30:00Z'
          },
          {
            gigId: '3',
            publicId: 'GIG-003',
            organizerId: 'org-1',
            title: 'Acoustic Guitarist for Restaurant',
            description: 'Looking for an acoustic guitarist to perform during dinner hours at our upscale restaurant.',
            category: 'Music',
            genres: ['Acoustic', 'Folk', 'Pop'],
            locationCity: 'Utrecht',
            eventDate: '2024-03-05T18:00:00Z',
            applicationDeadline: '2024-02-25T23:59:59Z',
            pricing: {
              amountInCents: 30000,
              currency: 'EUR',
              amountInEuros: 300
            },
            priceType: 'HOURLY',
            isNegotiable: true,
            paymentMethod: 'CASH',
            status: 'DRAFT',
            applicationsCount: 0,
            canApply: false,
            createdAt: '2024-01-25T09:15:00Z'
          },
          {
            gigId: '4',
            publicId: 'GIG-004',
            organizerId: 'org-1',
            title: 'Birthday Party Band',
            description: 'Fun band needed for a 50th birthday celebration. Mix of classic rock and modern hits preferred.',
            category: 'Music',
            genres: ['Rock', 'Pop'],
            locationCity: 'The Hague',
            eventDate: '2024-01-30T19:30:00Z',
            pricing: {
              amountInCents: 80000,
              currency: 'EUR',
              amountInEuros: 800
            },
            priceType: 'FIXED',
            isNegotiable: false,
            paymentMethod: 'STRIPE_CONNECT',
            status: 'COMPLETED',
            applicationsCount: 15,
            canApply: false,
            createdAt: '2024-01-10T16:45:00Z'
          }
        ]);
      } catch (error) {
        console.error('Error fetching gigs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

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

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.locationCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gig.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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

      {/* Gigs List */}
      <div className="space-y-4">
        {filteredGigs.map((gig) => (
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
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {gig.status === 'DRAFT' && (
                        <DropdownMenuItem>Publish Gig</DropdownMenuItem>
                      )}
                      {gig.status === 'BOOKED' && (
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Cancel Gig</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredGigs.length === 0 && (
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
    </div>
  );
};

export default GigsPage;