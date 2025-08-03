'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  FileText
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Gigs', href: '/dashboard/gigs', icon: Briefcase },
  { name: 'Applications', href: '/dashboard/applications', icon: Users },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: '3' },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900">Vybup</h1>
            <p className="text-sm text-gray-500">Organizer</p>
          </div>
        </Link>
        
        {/* Mobile menu close button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={toggleMobileMenu}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-indigo-700' : 'text-gray-400'
                )} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john@example.com</p>
          </div>
        </div>
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
          className="bg-white shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r',
        className
      )}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;