/**
 * Create User Use Case
 * 
 * Use case for creating a new user.
 * This contains business logic for user creation and coordinates between domain and infrastructure.
 */

import { User, UserId, Email } from '@/domain';
import { CreateUserDTO, UserResponseDTO } from '../dto/user.dto.js';
import { IUserRepository } from '../ports/user.repository.port.js';
import { UserAlreadyExistsError } from '@/domain';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: { hash: (password: string) => Promise<string> }
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(dto.email);
    }

    // Create domain entities
    const userId = UserId.generate();
    const email = new Email(dto.email);

    // Hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // Create user entity
    const user = new User(
      userId,
      email,
      dto.name,
      hashedPassword,
      new Date(),
      new Date()
    );

    // Persist user
    await this.userRepository.create(user.toJSON());

    // Return response DTO
    return {
      id: user.id.value,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
