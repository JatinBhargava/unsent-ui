export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName?: string;
  gender?: string;
  date_of_birth?: string; // ISO string (YYYY-MM-DD)
}