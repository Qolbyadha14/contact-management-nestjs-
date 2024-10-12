import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { User } from "@prisma/client";
import { ContactResponse, CreateContactRequest } from "../model/contact.model";
import { ValidationService } from "../common/validation.service";
import { ContactValidation } from "./contact.validation";

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService
  ) {}

  async create(user: User, request: CreateContactRequest): Promise<ContactResponse>{
    const createdRequest: CreateContactRequest = this.validationService.validate(ContactValidation.CREATE, request);

    const result = await this.prismaService.contact.create({
      data: {
        ...createdRequest,
        ...{ user_id: user.id }
      }
    })

    return {
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      phone_number: result.phone_number
    }
  }
}