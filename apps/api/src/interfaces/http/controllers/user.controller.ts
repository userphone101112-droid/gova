/**
 * User Controller
 * 
 * Controller for user-related HTTP endpoints.
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserUseCase, LoginUserUseCase } from '@/application';
import { CreateUserDTO, LoginDTO } from '@/application';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const dto = request.body as CreateUserDTO;
    const user = await this.createUserUseCase.execute(dto);
    return reply.status(201).send(user);
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const dto = request.body as LoginDTO;
    const result = await this.loginUserUseCase.execute(dto);
    return reply.send(result);
  }
}
