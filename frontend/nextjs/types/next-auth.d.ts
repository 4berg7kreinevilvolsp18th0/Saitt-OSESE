import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    fullName?: string | null;
    createdAt?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      fullName?: string | null;
      createdAt?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    fullName?: string | null;
    createdAt?: string | null;
  }
}
