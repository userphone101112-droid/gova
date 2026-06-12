/**
 * User DTOs
 * 
 * Data Transfer Objects for user-related operations.
 * These are used to transfer data between layers.
 */

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserDTO {
  name?: string;
  password?: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}
