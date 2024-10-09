import { HttpException, Inject, Injectable } from "@nestjs/common";
import { RegisterUserRequest, UserResponse } from "../model/user.model";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { UserValidation } from "./user.validation";
import  * as bcrypt from 'bcrypt'

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
}