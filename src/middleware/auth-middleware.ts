import { HonoRequest } from "hono"

export const checkIfRequestFromSimulator = (request:HonoRequest) => {
    return request.header("") === "Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh"
  }