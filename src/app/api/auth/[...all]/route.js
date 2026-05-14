import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
const handle = auth()
export const { POST, GET } = toNextJsHandler(handle);