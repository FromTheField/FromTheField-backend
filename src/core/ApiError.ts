import { Response } from "express";
import {
  InternalErrorResponse,
  AuthFailureResponse,
  NotFoundResponse,
  ForbiddenReponse,
  BadRequest,
  AccessTokenErrorResponse,
} from "./ApiResponse";
import { environment } from "../config";

enum ErrorType {
  INTERNAL_ERROR = "InternalError",
  UNAUTHORISED = "AuthFailureError",
  FORBIDDEN = "ForbiddenError",
  NOT_FOUND = "NotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  ACCESS_TOKEN = "AccessTokenError",
  TOKEN_EXPIRED = "TokenExpriedError",
  BAD_TOKEN = "BadTokenError",
}
export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = "error") {
    super(type);
  }

  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.INTERNAL_ERROR:
        return new InternalErrorResponse(err.message).send(res);
      case ErrorType.UNAUTHORISED:
        return new AuthFailureResponse(err.message).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenReponse(err.message).send(res);
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_DATA:
      case ErrorType.NO_ENTRY:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequest(err.message).send(res);
      case ErrorType.BAD_TOKEN:
      case ErrorType.ACCESS_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
        return new AccessTokenErrorResponse(err.message).send(res);
      default: {
        let message = err.message;
        //error response may contain sesitve data
        if (environment == "production") message = "Something went wrong";
        return new InternalErrorResponse(message).send(res);
      }
    }
  }
}

export class InternalError extends ApiError {
  constructor(message = "Internal Error") {
    super(ErrorType.INTERNAL_ERROR, message);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = "Auth Failure") {
    super(ErrorType.UNAUTHORISED, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class NoData extends ApiError {
  constructor(message = "No data available") {
    super(ErrorType.NO_DATA, message);
  }
}

export class NoEntry extends ApiError {
  constructor(message = "No Such entry exists") {
    super(ErrorType.NO_ENTRY, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad parameters") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = "Invalid access token") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = "Token expired") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = "Bad token ") {
    super(ErrorType.BAD_TOKEN, message);
  }
}
