export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Consider hashing passwords before storing them
} 