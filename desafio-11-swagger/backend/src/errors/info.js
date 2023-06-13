export const generateUserErrorInfo = (user) => {
  return  `One or more properties were incomplete or not valid.
  List of required properties:
  * firts_name: needs to be a String, received ${user.first_name}
  * last_name: needs to be a String, received ${user.last_name}
  * email: needs to be a String, received ${user.email}`

}

export const generateUserExistErrorInfo = (user) => {
  return  `Email provided already exist.
  * email: received ${user.email}`
}

export const generateLoginErrorInfo = () => {
  return  `Credentials provided are unauthorized`
}