import { Request, Response, Router } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from '../middleware/auth';

interface AuthRouterDeps {
  pool: Pool;
}

export function createAuthRouter({ pool }: AuthRouterDeps) {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Username, email, and password are required.'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long.'
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email;
      `;
      const values = [username, email, passwordHash];

      const result = await pool.query(query, values);
      const newUser = result.rows[0];

      return res.status(201).json({
        message: 'User registered successfully',
        user: newUser
      });

    } catch (err: any) {
      if (err.code === '23505') {
        const detail = err.detail || '';
        if (detail.includes('username')) {
          return res.status(409).json({ error: 'Username is already taken.' });
        }
        if (detail.includes('email')) {
          return res.status(409).json({ error: 'Email is already registered.' });
        }
        return res.status(409).json({ error: 'Username or email already exists.' });
      }

      console.error('Registration error:', err);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET not configured');
      }

      const token = jwt.sign(
        { userId: user.id },
        secret,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });

  router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'User ID missing from token' });
      }

      const result = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [req.userId]
      );
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (err) {
      console.error('Get user error:', err);
      return res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });

  return router;
}
