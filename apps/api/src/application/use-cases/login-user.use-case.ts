/**
 * Login User Use Case
 * 
 * Use case for user login.
 * This contains business logic for authentication and coordinates between domain and infrastructure.
 */

import { LoginDTO, LoginResponseDTO } from '../dto/user.dto.js';
import { IUserRepository } from '../ports/user.repository.port.js';
import { UserNotFoundError, InvalidCredentialsError } from '@/domain';

export interface TokenGenerator {
  generateToken(payload: { userId: string; email: string }): string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: { hash: (password: string) => Promise<string>; verify: (password: string, hash: string) => Promise<boolean> },
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    // Find user by email
    const userData = await this.userRepository.findByEmail(dto.email);
    if (!userData) {
      throw new UserNotFoundError(dto.email);
    }

    // Verify password
    const isValid = await this.passwordHasher.verify(dto.password, userData.password);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const token = this.tokenGenerator.generateToken({
      userId: userData.id,
      email: userData.email,
    });

    // Return response DTO
    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      token,
    };
  }
}
