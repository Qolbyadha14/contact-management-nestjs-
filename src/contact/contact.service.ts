import { HttpException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Contact, User } from "@prisma/client";
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

    return this.toContactResponse(result)
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const result = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        user_id: user.id
      }
    })

    if (!result) {
      throw new HttpException('Contact not found', 404)
    }

    return this.toContactResponse(result)
  }

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_number: contact.phone_number
    }
  }
}