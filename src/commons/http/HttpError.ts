import { HttpStatus } from "./HttpStatus";

export class HttpError extends Error {
    status: number;
    constructor(stat: HttpStatus) {
      const { message, status } = { ...stat };
      super(message);
      this.status = status;
      Object.setPrototypeOf(this, HttpError.prototype); // para que instanceof funcione
    }
  }