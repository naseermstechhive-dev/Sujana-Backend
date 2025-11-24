import express from 'express';
import {
  signup,
  login,
  adminLogin,
  getEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  employeeLogin,
} from '../Controllers/autController.js';
import { validateRequest } from '../Middlewares/validateRequest.js';
import { signupSchema, loginSchema } from '../validations/authValidations.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post('/admin', validateRequest(loginSchema), adminLogin);
router.get('/employees', authenticateToken, getEmployees);
router.post('/create-employee', authenticateToken, createEmployee);
router.delete('/employees/:id', authenticateToken, deleteEmployee);
router.put('/employees/:id', authenticateToken, updateEmployee);
router.post('/employee-login', validateRequest(loginSchema), employeeLogin);


export default router;
