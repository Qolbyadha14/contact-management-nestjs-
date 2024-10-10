import { HttpException, Inject, Injectable } from "@nestjs/common";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../model/user.model";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { UserValidation } from "./user.validation";
import  * as bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Registering user: ${JSON.stringify(request)}`);

    const registeredRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithUsername = await this.prismaService.user.count({
      where: {
        username: registeredRequest.username
      }
    });

    if (totalUserWithUsername > 0) {
      throw new HttpException(`username already exists`, 422)
    }

    registeredRequest.password = await bcrypt.hash(registeredRequest.password, 10);
    const user = await this.prismaService.user.create({
      data: registeredRequest
    })

    return {
      username: user.username,
      name: user.name
    }
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`User login: ${JSON.stringify(request)}`);

    const loginRequest: RegisterUserRequest = this.validationService.validate(UserValidation.LOGIN, request);

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username
      }
    });

    if (!user) {
      throw new HttpException(`username or password is incorrect`, 401)
    }

    const isPasswordCorrect = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(`username or password is incorrect`, 401)
    }

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username
      },
      data: {
        token: uuid()
      }
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token
    }
  }
}