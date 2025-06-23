import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user_id?: number;
    invoice_number: string;
    user: {id: number, email: string}
  }
}