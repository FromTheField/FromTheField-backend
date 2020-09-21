import { Response } from "express";
//Helper Code to make it easier to consume the api
enum StatusCode {
  SUCCESS = "10000",
  FAILURE = "10001",
  RETRY = "10002",
  INVALID_ACCESS_TOKEN = "10003",
}

enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORISED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
  constructor(
    protected statusCode: StatusCode,
    protected status: ResponseStatus,
    protected message: string
  ) {}

  protected prepare<T extends ApiResponse>(
    res: Response,
    response: T
  ): Response {
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  public send(res: Response): Response {
    return this.prepare<ApiResponse>(res, this);
  }

  private static sanitize<T extends ApiResponse>(response: T): T {
    let clone: T = {} as T;
    Object.assign(close, response);
    delete clone.status;
    for (const i in clone) if (typeof clone[i] == "undefined") delete clone[i];
    return clone;
  }
}
//Sucess Methods
export class SuccessMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message = "Successful Response", private data: T) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response): Response {
    return super.prepare<SuccessResponse<T>>(res, this);
  }
}

//Internal Error and Generic Error
export class InternalErrorResponse extends ApiResponse {
  constructor(message = "Internal Error") {
    super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class FailureErrorReponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
  }
}

//UnAuthoirized and Forbidden
export class AuthFailureResponse extends ApiResponse {
  constructor(message = "Authentication Failure") {
    super(StatusCode.FAILURE, ResponseStatus.UNAUTHORISED, message);
  }
}

export class ForbiddenReponse extends ApiResponse {
  constructor(message = "Forbidden Action") {
    super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
  }
}

//BadRequest and NotFound
export class NotFoundResponse extends ApiResponse {
  private url: string;
  constructor(message = "Not found") {
    super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
  }

  send(res: Response): Response {
    this.url = res.req.originalUrl;
    return super.prepare<NotFoundResponse>(res, this);
  }
}

export class BadRequest extends ApiResponse {
  constructor(message = "Bad Parameters") {
    super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
  }
}

//Invalid_Access_token and issue new token and refresh token
export class AccessTokenErrorResponse extends ApiResponse {
  private instruction = "refresh_token";
  constructor(message = "invalid access token") {
    super(
      StatusCode.INVALID_ACCESS_TOKEN,
      ResponseStatus.UNAUTHORISED,
      message
    );
  }

  send(res: Response): Response {
    res.setHeader("instruction", this.instruction);
    return super.prepare<AccessTokenErrorResponse>(res, this);
  }
}

export class TokenRefreshResponse extends ApiResponse {
  constructor(
    message: string,
    private access_token: string,
    private refresh_token: string
  ) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }
  send(res: Response): Response {
    return super.prepare<TokenRefreshResponse>(res, this);
  }
}
