'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Plus, 
  X,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { CreateGigRequest } from '@/types/api';

const categories = [
  'Music',
  'DJ',
  'Entertainment',
  'Speaking',
  'Performance Art',
  'Comedy',
  'Dance'
];

const musicGenres = [
  'Rock', 'Pop', 'Jazz', 'Blues', 'Folk', 'Country', 'R&B', 'Hip-Hop',
  'Electronic', 'Dance', 'House', 'Techno', 'Classical', 'Acoustic',
  'Indie', 'Alternative', 'Reggae', 'Latin', 'World Music'
];

const priceTypes = [
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'HOURLY', label: 'Hourly Rate' },
  { value: 'NEGOTIABLE', label: 'Negotiable' }
];

const paymentMethods = [
  { value: 'CASH', label: 'Cash Payment' },
  { value: 'STRIPE_CONNECT', label: 'Online Payment (Stripe)' }
];

const CreateGigPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateGigRequest>({
    title: '',
    description: '',
    category: '',
    genres: [],
    locationCity: '',
    eventDate: '',
    applicationDeadline: '',
    pricing: {
      amountInCents: 0,
      currency: 'EUR',
      amountInEuros: 0
    },
    priceType: 'FIXED',
    isNegotiable: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'priceType') {
      setFormData(prev => ({ ...prev, isNegotiable: value === 'NEGOTIABLE' }));
    }
    setError('');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const euros = parseFloat(e.target.value) || 0;
    const cents = Math.round(euros * 100);
    setFormData(prev => ({
      ...prev,
      pricing: {
        amountInCents: cents,
        currency: 'EUR',
        amountInEuros: euros
      }
    }));
    setError('');
  };

  const handleGenreSelect = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      const newGenres = [...selectedGenres, genre];
      setSelectedGenres(newGenres);
      setFormData(prev => ({ ...prev, genres: newGenres }));
    }
  };

  const removeGenre = (genre: string) => {
    const newGenres = selectedGenres.filter(g => g !== genre);
    setSelectedGenres(newGenres);
    setFormData(prev => ({ ...prev, genres: newGenres }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (selectedGenres.length === 0) {
      setError('At least one genre is required');
      return false;
    }
    if (!formData.eventDate) {
      setError('Event date is required');
      return false;
    }
    if (formData.pricing.amountInEuros <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    
    // Check if event date is in the future
    const eventDate = new Date(formData.eventDate);
    const now = new Date();
    if (eventDate <= now) {
      setError('Event date must be in the future');
      return false;
    }

    // Check if application deadline is before event date
    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      if (deadline >= eventDate) {
        setError('Application deadline must be before the event date');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!isDraft && !validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Since backend is not running, we'll simulate the API call
      console.log('Creating gig:', { ...formData, status: isDraft ? 'DRAFT' : 'OPEN' });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast.success(isDraft ? 'Gig saved as draft!' : 'Gig created and published!');
      router.push('/dashboard/gigs');
    } catch (err: any) {
      setError(err.message || 'Failed to create gig');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/gigs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gigs
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Gig</h1>
          <p className="text-sm text-gray-500">Post a new gig to find talented performers</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about your gig
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Gig Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Jazz Trio for Corporate Event"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event, requirements, and what you're looking for..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationCity">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="locationCity"
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Genres *</Label>
              <Select onValueChange={handleGenreSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Add genres" />
                </SelectTrigger>
                <SelectContent>
                  {musicGenres
                    .filter(genre => !selectedGenres.includes(genre))
                    .map(genre => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGenres.map(genre => (
                    <Badge key={genre} variant="secondary" className="text-sm">
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeGenre(genre)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Specify when and where the event will take place
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date & Time *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="applicationDeadline"
                    name="applicationDeadline"
                    type="datetime-local"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set your budget and payment preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price Type *</Label>
                <Select value={formData.priceType} onValueChange={(value) => handleSelectChange('priceType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  {formData.priceType === 'HOURLY' ? 'Hourly Rate (€)' : 'Total Budget (€)'} *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.pricing.amountInEuros || ''}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create & Publish Gig'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGigPage;