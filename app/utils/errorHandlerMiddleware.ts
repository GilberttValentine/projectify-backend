export function ErrorHandler(err: any, req: any, res: any, next: any) {
  const logName = 'ErrorHandlerMiddleware.MainHandler';
  const logger = req.log || console;

  if (logger.error) {
      logger.error(logName, `Error with message ${err.message} and stack: ${err.stack}`);
  } else {
      logger(logName, `Error with message ${err.message} and stack: ${err.stack}`);
  }

  const { status = 500, message = 'Error', code = 500 } = err;

  res.status(status).send({ error: { message, code } });

  return next();
}

export class CustomError extends Error {
  status: number
  message: string
  code: number
  constructor(status = 500, message: string, code = 500) {
      super();
      this.status = status;
      this.message = message;
      this.code = code;
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Not found', code = 404) {
      super(404, message, code);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad request', code = 400) {
      super(400, message, code);
  }
}

export class BusinessError extends CustomError {
  constructor(message = 'Bad request', code = 412) {
      super(412, message, code);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Not authorized', code = 403) {
      super(403, message, code);
  }
}

export class PartialContentError extends CustomError {
  constructor(message = 'Partial Content', code = 206) {
      super(206, message, code);
  }
}