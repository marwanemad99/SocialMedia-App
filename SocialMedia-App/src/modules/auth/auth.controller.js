import { Router } from 'express';
import * as registerRoutes from './service/auth.service.js';
import * as validators from './auth.validation.js';
import { authMiddleware, validation } from '../../middleware/index.js';
const authRouter = Router();

authRouter.post('/register', validation(validators.signup), registerRoutes.register);
authRouter.patch('/confirm-email', validation(validators.confirmEmail), registerRoutes.confirmEmail);
authRouter.post('/login', validation(validators.login), registerRoutes.login);
authRouter.post('/confirm-login', registerRoutes.confirmLogin);
authRouter.post('/google-login', registerRoutes.googleLogin);
authRouter.post('/enable-two-step-verification', authMiddleware(), registerRoutes.enableTwoStepVerification);
authRouter.post('/confirm-two-step-verification', validation(validators.confirmTwoStepVerification), authMiddleware(), registerRoutes.confirmTwoStepVerification);
authRouter.get('/refresh-token', registerRoutes.refreshToken);
authRouter.patch('/forget-password', validation(validators.forgetPassword), registerRoutes.forgetPassword);
authRouter.patch('/validate-forget-password', validation(validators.validateForgetPassword), registerRoutes.validateForgetPasswordCode);
authRouter.patch('/reset-password', validation(validators.resetPassword), registerRoutes.resetPassword);
export default authRouter;  