import { HttpException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Contact, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest
} from "../model/contact.model";
import { ValidationService } from "../common/validation.service";
import { ContactValidation } from "./contact.validation";
import { WebResponse } from "../model/web.model";

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
    const result = await this.checkContactExists(user.id, contactId)

    return this.toContactResponse(result)
  }

  async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
    const updatedRequest: UpdateContactRequest = this.validationService.validate(ContactValidation.UPDATE, request);

    let contact = await this.checkContactExists(user.id, updatedRequest.id)

    contact = await this.prismaService.contact.update({
      where: {
        id: contact.id,
        user_id: user.id
      },
      data: updatedRequest
    })

    return this.toContactResponse(contact)
  }

  async delete(user: User, contactId: number): Promise<ContactResponse> {
    await this.checkContactExists(user.id, contactId)

    const result = await this.prismaService.contact.delete({
      where: {
        id: contactId,
        user_id: user.id
      }
    })

    return this.toContactResponse(result)
  }

  async search(user: User, request: SearchContactRequest): Promise<WebResponse<ContactResponse[]>> {
    const searchRequest: SearchContactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request
    );

    const filters = []

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name
            }
          },
          {
            last_name: {
              contains: searchRequest.name
            }
          }
        ]
      })
    }

    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email
        }
      })
    }

    if (searchRequest.phone_number) {
      filters.push({
        phone_number: {
          contains: searchRequest.phone_number
        }
      })
    }

    const result = await this.prismaService.contact.findMany({
      where: {
        user_id: user.id,
        AND: filters
      },
      take: searchRequest.size,
      skip: (searchRequest.page - 1) * searchRequest.size
    })

    const total = await this.prismaService.contact.count({
      where: {
        user_id: user.id,
        AND: filters
      }
    })

    return {
      data: result.map((contact) => this.toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size
      }
    }
  }

  async checkContactExists(user_id: number, contactId: number): Promise<Contact> {
    const result = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        user_id: user_id
      }
    })

    if (!result) {
      throw new HttpException('Contact not found', 404)
    }

    return result
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