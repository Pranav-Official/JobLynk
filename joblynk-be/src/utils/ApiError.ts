// utils/ApiError.ts
import { StatusCodes } from "http-status-codes";

class ApiError extends Error {
  public statusCode: StatusCodes;

  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
