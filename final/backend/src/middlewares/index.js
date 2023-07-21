import {errorHandler} from '../utils/error.js'

export function onError (data, _req, res, next){
  if(data instanceof Error) return errorHandler ({error: data, res});
  next();
}