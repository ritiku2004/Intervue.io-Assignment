import * as authMiddleware from './authMiddleware.js';
import * as errorMiddleware from './errorMiddleware.js';

const middleware = { ...authMiddleware, ...errorMiddleware };
export { middleware };