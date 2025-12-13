import { AppError } from "./app-errors";

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", cause?: unknown) {
    super(message, "DATABASE_ERROR", cause);
  }
}
