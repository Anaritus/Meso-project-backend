export interface ErrorWithCode extends Error {
  statusCode: number;
}

export interface MongooseError extends Error {
  code?: number;
}
