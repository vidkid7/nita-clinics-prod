import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../users/entities/user.entity';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.ADMIN,
  isActive: true,
  refreshToken: undefined as string | undefined,
  validatePassword: jest.fn(),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

const mockNotificationsService = {
  sendEmail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue('test-secret');
    mockJwtService.signAsync.mockResolvedValue('test-token');
  });

  // ─── validateUser ─────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('notfound@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password is wrong', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);
      const result = await service.validateUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return tokens and user on valid login', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUsersService.update.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('access-token');

      const result = await service.login({ email: 'test@example.com', password: 'password' });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'bad' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is deactivated', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, isActive: false });
      mockUser.validatePassword.mockResolvedValue(true);
      await expect(service.login({ email: 'test@example.com', password: 'password' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register({ email: 'new@example.com', name: 'New', password: 'Pass123!', role: UserRole.PATIENT });
      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      await expect(service.register({ email: 'test@example.com', name: 'Test', password: 'pass', role: UserRole.PATIENT }))
        .rejects.toThrow(BadRequestException);
    });
  });

  // ─── changePassword ───────────────────────────────────────────────────────

  describe('changePassword', () => {
    it('should update password when current password is correct', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(true);
      mockUsersService.update.mockResolvedValue(mockUser);
      const result = await service.changePassword('user-1', { currentPassword: 'old', newPassword: 'new' });
      expect(result.message).toBe('Password changed successfully');
    });

    it('should throw UnauthorizedException when current password is wrong', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUser.validatePassword.mockResolvedValue(false);
      await expect(service.changePassword('user-1', { currentPassword: 'wrong', newPassword: 'new' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── forgotPassword ───────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('should return generic message when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.forgotPassword({ email: 'none@x.com' });
      expect(result.message).toContain('If an account exists');
    });

    it('should send reset email and return generic message when user exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockNotificationsService.sendEmail.mockResolvedValue(undefined);
      const result = await service.forgotPassword({ email: 'test@example.com' });
      expect(result.message).toContain('If an account exists');
      expect(mockNotificationsService.sendEmail).toHaveBeenCalled();
    });

    it('should still return success even if email sending fails', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockNotificationsService.sendEmail.mockRejectedValue(new Error('SMTP down'));
      const result = await service.forgotPassword({ email: 'test@example.com' });
      expect(result.message).toContain('If an account exists');
    });
  });

  // ─── resetPassword ────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', type: 'reset' });
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);
      const result = await service.resetPassword({ token: 'valid-token', newPassword: 'NewPass1!a' });
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('expired'));
      await expect(service.resetPassword({ token: 'bad', newPassword: 'x' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token type is wrong', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-1', type: 'access' });
      await expect(service.resetPassword({ token: 'bad-type', newPassword: 'x' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── refreshTokens ────────────────────────────────────────────────────────

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException when user has no stored refresh token', async () => {
      mockUsersService.findOne.mockResolvedValue({ ...mockUser, refreshToken: null });
      await expect(service.refreshTokens('user-1', 'token'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── logout ───────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should clear refresh token on logout', async () => {
      mockUsersService.update.mockResolvedValue(undefined);
      await service.logout('user-1');
      expect(mockUsersService.update).toHaveBeenCalledWith('user-1', { refreshToken: undefined });
    });
  });
});
