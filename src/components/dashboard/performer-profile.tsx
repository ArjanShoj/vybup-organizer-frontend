'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star,
  MapPin,
  Music,
  Award,
  ExternalLink,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { PublicPerformerProfileDto } from '@/types/api';
import { apiClient } from '@/lib/api';

interface PerformerProfileProps {
  performerId: string;
  showActions?: boolean;
  onMessage?: () => void;
}

const PerformerProfile = ({ performerId, showActions = false, onMessage }: PerformerProfileProps) => {
  const [profile, setProfile] = useState<PublicPerformerProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const profileData: PublicPerformerProfileDto = await apiClient.getPerformerProfile(performerId);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching performer profile:', error);
        setHasError(true);
        toast.error('Failed to load performer profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (performerId) {
      fetchProfile();
    }
  }, [performerId]);

  if (isLoading) {
    return (
      <Card className="border border-purple-500/20 bg-slate-900/60 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="text-slate-300">Loading performer profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasError || !profile) {
    return (
      <Card className="border border-red-500/20 bg-slate-900/60 text-white">
        <CardContent className="text-center py-12">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Profile Not Available</h3>
          <p className="text-slate-400">Unable to load performer profile at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const handlePortfolioClick = () => {
    if (profile.portfolioLink) {
      window.open(profile.portfolioLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getInitials = (displayName?: string) => {
    if (!displayName) return '?';
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRating = (rating?: number) => {
    if (!rating) return 'No rating';
    return rating.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden border border-purple-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl text-white">
        <div className="relative p-6">
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-purple-500/30 shadow-xl">
                  <AvatarImage src="" alt={profile.displayName || 'Performer'} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xl font-semibold">
                    {getInitials(profile.displayName)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Availability indicator */}
                <div className="absolute -bottom-1 -right-1">
                  {profile.isAvailable ? (
                    <div className="flex items-center gap-1 bg-green-500 rounded-full px-2 py-1 text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Available
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-gray-500 rounded-full px-2 py-1 text-xs font-medium">
                      <XCircle className="h-3 w-3" />
                      Busy
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {profile.displayName || 'Performer'}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-slate-300">
                      {profile.locationCity && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {profile.locationCity}
                        </span>
                      )}
                      
                      {profile.averageRating && profile.totalReviews > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          {formatRating(profile.averageRating)} ({profile.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {showActions && (
                    <div className="flex gap-3">
                      {onMessage && (
                        <Button 
                          onClick={onMessage}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      )}
                      
                      {profile.portfolioLink && (
                        <Button 
                          variant="outline" 
                          onClick={handlePortfolioClick}
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Portfolio
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bio Section */}
        {profile.bio && (
          <Card className="border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200 leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Section */}
        <Card className="border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              Performance Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-500/10">
                <div className="text-2xl font-bold text-purple-300">
                  {formatRating(profile.averageRating)}
                </div>
                <div className="text-sm text-slate-400">Average Rating</div>
              </div>
              
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-500/10">
                <div className="text-2xl font-bold text-purple-300">{profile.totalReviews}</div>
                <div className="text-sm text-slate-400">Total Reviews</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-500/10">
              <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                {profile.isAvailable ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400">Available for Bookings</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">Currently Unavailable</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Genres Section */}
        {profile.genres && profile.genres.length > 0 && (
          <Card className="border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-purple-400" />
                Genres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.genres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="outline" 
                    className="bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <Card className="border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                Skills & Instruments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    className="bg-slate-800/60 text-slate-200 border-slate-600/60 hover:bg-slate-700/60"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Portfolio Link (if not in actions) */}
      {!showActions && profile.portfolioLink && (
        <Card className="border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl text-white">
          <CardContent className="p-6">
            <Button 
              onClick={handlePortfolioClick}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Portfolio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformerProfile;
