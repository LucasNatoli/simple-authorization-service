import { HttpStatus } from "./HttpStatus";
//Success
export const OK: HttpStatus = { status: 200, message: "Ok" };
export const CREATED: HttpStatus = { status: 201, message: "Created" };

//Client Errors (4xx)
export const BAD_REQUEST: HttpStatus = { status: 400, message: "Bad Request" }; // The server cannot process the request due to malformed syntax or an invalid request message. The client should not repeat the request without modifications.
export const NOT_FOUND: HttpStatus = { status: 404, message: "Not Found" };
export const CONFLICT: HttpStatus = { status: 409, message: "Conflict" }; //The request could not be completed due to a conflict with the current state of the target resource.
export const FORBIDDEN: HttpStatus = { status: 403, message: "Forbidden" }; //The server understood the request but refuses to authorize it. Unlike 401, the client's identity is known, but they do not have the necessary permissions to access the resource.
export const UNAUTHORIZED: HttpStatus = {
  status: 401,
  message: "Unauthorized",
}; // The request lacks valid authentication credentials for the target resource, or authentication has failed. The client must authenticate itself to get the requested response.
export const UNPROCESSABLE: HttpStatus = {
  status: 422,
  message: "Unprocessable Entity",
}; //Incorrect fields

//Internal
export const INTERNAL: HttpStatus = {
  status: 500,
  message: "Internal Server Error",
}; //
