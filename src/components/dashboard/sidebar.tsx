'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Home, 
  Briefcase, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Star,
  Menu,
  X,
  User,
  FileText,
  MapPin,
  Crown,
  Shield,
  Building2,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { OrganizerProfileDto } from '@/types/api';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<OrganizerProfileDto | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Fetch profile data and unread messages count
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsProfileLoading(true);
        
        const [profileResponse, unreadCountResponse] = await Promise.allSettled([
          apiClient.getProfile(),
          apiClient.getTotalUnreadCount()
        ]);

        if (profileResponse.status === 'fulfilled') {
          setProfile(profileResponse.value as OrganizerProfileDto);
        } else {
          console.error('Failed to fetch profile:', profileResponse.reason);
        }

        if (unreadCountResponse.status === 'fulfilled') {
          const unreadData = unreadCountResponse.value as { count?: number };
          setUnreadMessagesCount(unreadData.count || 0);
        } else {
          console.error('Failed to fetch unread count:', unreadCountResponse.reason);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Gigs', href: '/dashboard/gigs', icon: Briefcase },
    { name: 'Applications', href: '/dashboard/applications', icon: Users },
    { 
      name: 'Messages', 
      href: '/dashboard/messages', 
      icon: MessageSquare, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount.toString() : undefined 
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getOrganizerTypeIcon = (type?: string) => {
    switch (type) {
      case 'BUSINESS': return Building2;
      case 'PRIVATE': return User;
      default: return User;
    }
  };

  const getOrganizerTypeBadge = (type?: string) => {
    switch (type) {
      case 'BUSINESS': return { label: 'Business', color: 'bg-secondary-100 text-secondary-800 border-secondary-200' };
      case 'PRIVATE': return { label: 'Individual', color: 'bg-primary-100 text-primary-800 border-primary-200' };
      default: return { label: 'Organizer', color: 'bg-dark-100 text-dark-800 border-dark-200' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-dark-400';
      case 'SUSPENDED': return 'bg-red-500';
      default: return 'bg-dark-400';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-purple-500/20 bg-slate-800/90">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-purple-400 font-bold text-xl">V</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-white">Vybup</h1>
            <p className="text-slate-300 text-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Organizer Portal
            </p>
          </div>
        </Link>
        
        {/* Mobile menu close button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden absolute top-6 right-6 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
          onClick={toggleMobileMenu}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
        // Special handling for Dashboard - only active on exact match
        const isActive = item.href === '/dashboard' 
          ? pathname === '/dashboard'
          : pathname === item.href || pathname.startsWith(item.href + '/');
        return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md hover:border hover:border-purple-500/20'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  isActive 
                    ? 'bg-black/20 backdrop-blur-sm' 
                    : 'bg-slate-700 group-hover:bg-purple-500/20'
                )}>
                  <item.icon className={cn(
                    'h-4 w-4',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                  )} />
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <Badge className="bg-purple-600 text-white border-0 shadow-sm px-2 py-1 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-purple-500/20 bg-slate-800/90">
        {isProfileLoading ? (
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 px-3 py-3">
              <div className="h-12 w-12 bg-dark-700 rounded-full"></div>
              <div className="hidden lg:block flex-1">
                <div className="h-4 bg-dark-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-dark-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        ) : profile ? (
          <div className="bg-slate-800/80 rounded-xl p-4 shadow-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-purple-400 shadow-lg">
                  <div className="h-full w-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-black font-bold text-lg rounded-full ring-2 ring-purple-400/20">
                    {profile.firstName?.[0] || profile.displayName?.[0] || 'U'}
                    {profile.lastName?.[0] || ''}
                  </div>
                </Avatar>
                <div className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900',
                  getStatusColor(profile.status)
                )}></div>
              </div>
              
              <div className="hidden lg:block flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Organizer'}
                  </p>
                  {profile.organizerType && (
                    <div className="flex items-center">
                      <Badge className={`text-xs px-2 py-0.5 ${getOrganizerTypeBadge(profile.organizerType).color}`}>
                        {getOrganizerTypeBadge(profile.organizerType).label}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-dark-300">
                  {profile.locationCity && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{profile.locationCity}</span>
                    </div>
                  )}
                </div>
                
                {profile.companyInfo?.name && (
                  <div className="flex items-center gap-1 text-xs text-dark-400 mt-1">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">{profile.companyInfo.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status indicator for mobile */}
            <div className="lg:hidden mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', getStatusColor(profile.status))}></div>
                <span className="text-xs text-dark-300 capitalize">{profile.status.toLowerCase()}</span>
              </div>
              {profile.organizerType && (
                <Badge className={`text-xs ${getOrganizerTypeBadge(profile.organizerType).color}`}>
                  {getOrganizerTypeBadge(profile.organizerType).label}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-dark-800/50 rounded-xl p-4 shadow-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-dark-700 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-dark-400" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-white">Profile Unavailable</p>
                <p className="text-xs text-dark-300">Please try refreshing</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="bg-slate-800/90 backdrop-blur-sm shadow-lg border border-purple-500/30 hover:border-purple-400/50 text-purple-400 hover:text-purple-300"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-dark-900 bg-opacity-75 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-purple-500/20 shadow-2xl',
        className
      )}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 border-r border-purple-500/20 shadow-2xl transform transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;