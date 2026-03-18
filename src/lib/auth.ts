export interface User {
  name: string;
  role: 'admin' | 'user';
}

export async function getCurrentUser(): Promise<User | null> {
  // For now, return a default admin user to test functionality
  // In production, this should be replaced with proper authentication
  return {
    name: 'admin',
    role: 'admin'
  };
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}