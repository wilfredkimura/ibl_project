import { useLocation } from 'react-router-dom';

export function useNavItems(user) {
  const location = useLocation();
  const items = [
    { label: 'Leaders', to: '/leaders' },
    { label: 'Blog', to: '/blog' },
    { label: 'Events', to: '/events' },
    { label: 'Gallery', to: '/gallery' },
  ];
  if (user) {
    items.push({ label: 'Members', to: '/members' });
    items.push({ label: 'Profile', to: '/profile' });
  }
  if (user?.is_admin) {
    items.push({ label: 'Admin Dashboard', to: '/admin' });
  }

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return { items, isActive };
}
