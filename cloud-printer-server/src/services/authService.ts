import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

type User = Prisma.UserGetPayload<{}>;
type Session = Prisma.SessionGetPayload<{}>;

interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

interface RegisterUserInput {
  email: string;
  password: string;
  role: 'admin' | 'client';
  partnerId?: string;
  firstName?: string;
  lastName?: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';

  async register(input: RegisterUserInput): Promise<LoginResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    // Validate partnerId based on role
    if (input.role === 'client') {
      // if (!input.partnerId) {
      //   throw new AppError('Partner ID is required for client users', 400);
      // }
      // const partner = await prisma.partner.findUnique({
      //   where: { id: input.partnerId }
      // });
      // if (!partner) {
      //   throw new AppError('Invalid partner ID', 400);
      // }
    } else if (input.role === 'admin') {
      // Admin users should not have a partnerId
      delete input.partnerId;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashedPassword
      }
    });

    // Generate token
    const token = this.generateToken(user.id);

    // Create session
    await this.createSession(user.id, token);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Create session
    await this.createSession(user.id, token);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async logout(token: string): Promise<void> {
    await prisma.session.updateMany({
      where: { token },
      data: { isValid: false }
    });
  }

  async validateSession(token: string): Promise<User | null> {
    try {
      // Verify token
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };

      // Check if session is valid
      const session = await prisma.session.findFirst({
        where: {
          token,
          isValid: true,
          expiresAt: { gt: new Date() }
        }
      });

      if (!session) {
        return null;
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  private async createSession(userId: string, token: string): Promise<Session> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  }

  // Admin functions
  async createAdminUser(input: RegisterUserInput): Promise<User> {
    if (input.role !== 'admin') {
      throw new AppError('Invalid role for admin user', 400);
    }
    const { user } = await this.register(input);
    return { ...user, password: '' }; // Include password field but set it empty for type compatibility
  }

  async deactivateUser(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });
  }

  async reactivateUser(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: true }
    });
  }
} 