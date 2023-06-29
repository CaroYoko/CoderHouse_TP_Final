const EnumError = {
  INVALID_PARAMS: 400,
  BUSSINESS_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,  
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

export const errorHandler = ({error, res}) =>{
  if(error instanceof CustomError){
    return res.status(error.httpErrorCode).json({error: error.message, status: error.httpErrorCode})
  }
  res.status(EnumError.INTERNAL_SERVER_ERROR).json({error: error.message, status: error.httpErrorCode});

}

export class CustomError extends Error {
  constructor (message = "error", httpErrorCode){
    super(message);
    this.httpErrorCode = httpErrorCode ?? EnumError.INTERNAL_SERVER_ERROR;
  }
}

export class InvalidParamsError extends CustomError {
  constructor (message = "Invalid Params Error"){
    super(message, EnumError.INVALID_PARAMS );   
  }
}
export class BusinessError extends CustomError {
  constructor (message = "Busines Error"){
    super(message, EnumError.BUSSINESS_ERROR );   
  }
}

export class BadRequestError extends CustomError {
  constructor (message = "Bad Request"){
    super(message, EnumError.BAD_REQUEST );   
  }
}

export class UnauthorizedError extends CustomError {
  constructor (message = "Unauthorized"){
    super(message, EnumError.UNAUTHORIZED );   
  }
}

export class ForbiddenError extends CustomError {
  constructor (message = "Forbidden"){
    super(message, EnumError.FORBIDDEN );   
  }
}

export class NotFoundError extends CustomError {
  constructor (message = "Not Found"){
    super(message, EnumError.NOT_FOUND );   
  }
}

export const DICTIONARY_ERROR = {
  INVALID_PARAMS: `One or more properties were incomplete or not valid.
  List of required properties: 
  * firts_name: needs to be a String, received {0}
  * last_name: needs to be a String, received {1}
  * email: needs to be a String, received {2}`,
  INVALID_PARAM: `Field incomplete or missing`, 
  USER_EXIST: `Email provided already exist. 
  * email: received {0}`,
  USER_NOT_FOUND: 'User {0}, not found',  
  INVALID_PASSWORD: 'Invalid password',
  INVALID_USER: 'Invalid user',
  INVALID_TOKEN: "Invalid Token",
  INVALID_CREDENTIALS: `Credentials provided are unauthorized` 

}

export function translate(value, ...args) {   
  args.forEach((arg, index) => {value = value.replace(`{${index}}`, arg)})   
  return value; 
}


