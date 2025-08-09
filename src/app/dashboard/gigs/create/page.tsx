'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  X,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Music,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { CreateGigRequest, GigResponse } from '@/types/api';

// Categories available for gigs
const categories = [
  { value: 'MUSIC', label: 'Music', icon: Music },
  { value: 'DJ', label: 'DJ & Electronic', icon: Music },
  { value: 'ENTERTAINMENT', label: 'Entertainment', icon: Sparkles },
  { value: 'COMEDY', label: 'Comedy', icon: Sparkles },
  { value: 'DANCE', label: 'Dance', icon: Sparkles },
  { value: 'SPEAKING', label: 'Speaking & Hosting', icon: FileText },
];

// Music and performance genres
const genres = [
  'Rock', 'Pop', 'Jazz', 'Blues', 'Folk', 'Country', 'R&B', 'Hip-Hop',
  'Electronic', 'Dance', 'House', 'Techno', 'Classical', 'Acoustic',
  'Indie', 'Alternative', 'Reggae', 'Latin', 'World Music', 'Funk',
  'Soul', 'Gospel', 'Punk', 'Metal', 'Ambient', 'Experimental'
];

// Price types with descriptions
const priceTypes = [
  { 
    value: 'FIXED', 
    label: 'Fixed Price',
    description: 'One-time payment for the entire performance'
  },
  { 
    value: 'HOURLY', 
    label: 'Hourly Rate',
    description: 'Payment based on hours performed'
  },
  { 
    value: 'NEGOTIABLE', 
    label: 'Negotiable',
    description: 'Price can be discussed with performers'
  }
];

// Payment methods with descriptions
const paymentMethods = [
  { 
    value: 'CASH', 
    label: 'Cash Payment',
    description: 'Pay the performer directly in cash',
    icon: DollarSign
  },
  { 
    value: 'STRIPE_CONNECT', 
    label: 'Online Payment',
    description: 'Secure payment through the platform',
    icon: CreditCard
  }
];

// Form sections for better organization
const FormSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  completed = false 
}: {
  title: string;
  description: string;
  icon: any;
  children: React.ReactNode;
  completed?: boolean;
}) => (
  <Card className="border-0 shadow-lg">
    <CardHeader className="bg-transparent border-b border-amber-500/20">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          completed ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
        }`}>
          {completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

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
    isNegotiable: false,
    paymentMethod: 'STRIPE_CONNECT'
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
      setError('Gig title is required');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (selectedGenres.length === 0) {
      setError('Please select at least one genre');
      return false;
    }
    if (!formData.eventDate) {
      setError('Event date and time is required');
      return false;
    }
    if (formData.pricing.amountInEuros <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.paymentMethod) {
      setError('Please select a payment method');
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
      if (deadline <= now) {
        setError('Application deadline must be in the future');
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
      const response = await apiClient.createGig(formData) as GigResponse;
      
      toast.success(isDraft ? 'Gig saved as draft!' : 'Gig created successfully!');
      router.push(`/dashboard/gigs/${response.gigId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create gig. Please try again.');
      toast.error('Failed to create gig');
    } finally {
      setIsLoading(false);
    }
  };

  // Check form completion for visual feedback
  const basicInfoCompleted = Boolean(
    formData.title && formData.category && selectedGenres.length > 0
  );
  const eventDetailsCompleted = Boolean(formData.eventDate);
  const pricingCompleted = Boolean(
    formData.pricing.amountInEuros > 0 && formData.paymentMethod
  );

  return (
    <div className="page-container">
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard/gigs">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-400/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gigs
              </Button>
            </Link>
            
            <div className="text-right">
              <h1 className="text-3xl font-bold text-white">Create New Gig</h1>
              <p className="text-slate-300 mt-1">Find the perfect performer for your event</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="luxury-card mb-8 border-red-500/30 bg-red-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="icon-container bg-red-500/20 border border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-400 font-medium">Please fix the following issue:</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                  <Button onClick={() => setError('')} variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
            {/* Basic Information */}
            <FormSection
              title="Basic Information"
              description="Tell us about your event and what type of performance you need"
              icon={FileText}
              completed={basicInfoCompleted}
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">Gig Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Jazz Trio for Corporate Holiday Party"
                    className="h-12 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your event, the atmosphere you want to create, specific requirements, and what kind of performance you're looking for..."
                    rows={4}
                    className="text-base resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select performance category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => {
                          const IconComponent = category.icon;
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationCity" className="text-base font-medium">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <Input
                        id="locationCity"
                        name="locationCity"
                        value={formData.locationCity}
                        onChange={handleInputChange}
                        placeholder="City or venue location"
                        className="pl-11 h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Genres & Styles *</Label>
                  <Select onValueChange={handleGenreSelect}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Add genres and musical styles" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {genres
                        .filter(genre => !selectedGenres.includes(genre))
                        .map(genre => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {selectedGenres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedGenres.map(genre => (
                        <Badge key={genre} className="bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 px-3 py-1">
                          {genre}
                          <button
                            type="button"
                            onClick={() => removeGenre(genre)}
                            className="ml-2 hover:text-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Event Details */}
            <FormSection
              title="Event Details"
              description="When and where will your event take place?"
              icon={Calendar}
              completed={eventDetailsCompleted}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-base font-medium">Event Date & Time *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="datetime-local"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="pl-11 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline" className="text-base font-medium">Application Deadline</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="applicationDeadline"
                      name="applicationDeadline"
                      type="datetime-local"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  <p className="text-sm text-slate-400">Optional: Set a deadline for performers to apply</p>
                </div>
              </div>
            </FormSection>

            {/* Pricing & Payment */}
            <FormSection
              title="Pricing & Payment"
              description="Set your budget and choose how you'd like to pay"
              icon={DollarSign}
              completed={pricingCompleted}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Price Type *</Label>
                    <Select value={formData.priceType} onValueChange={(value) => handleSelectChange('priceType', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-slate-400">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-medium">
                      {formData.priceType === 'HOURLY' ? 'Hourly Rate (€)' : 'Total Budget (€)'} *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <Input
                        id="price"
                        type="number"
                        step="1"
                        min="1"
                        value={formData.pricing.amountInEuros || ''}
                        onChange={handlePriceChange}
                        placeholder="Enter amount"
                        className="pl-11 h-12 text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Payment Method *</Label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {paymentMethods.map(method => {
                      const IconComponent = method.icon;
                      return (
                        <div key={method.value} className="relative">
                          <input
                            type="radio"
                            id={method.value}
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={(e) => handleSelectChange('paymentMethod', e.target.value)}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={method.value}
                            className="flex items-center gap-4 p-4 border-2 border-amber-500/20 rounded-xl cursor-pointer hover:border-amber-400/50 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all"
                          >
                            <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center peer-checked:bg-amber-500/20">
                              <IconComponent className="h-5 w-5 text-slate-300 peer-checked:text-amber-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white">{method.label}</p>
                              <p className="text-sm text-slate-400">{method.description}</p>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Submit Actions */}
            <Card className="section-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={(e) => handleSubmit(e as any, true)}
                    disabled={isLoading}
                    className=""
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isLoading}
                    className=""
                  >
                    {isLoading ? 'Creating...' : 'Create & Publish Gig'}
                  </Button>
                </div>
                <p className="text-sm text-slate-400 text-center mt-4">
                  Your gig will be visible to performers immediately after publishing
                </p>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGigPage;