import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest } from "../model/address.model";
import { AddressValidation } from "./address.validation";
import { ContactService } from "../contact/contact.service";

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest): Promise<AddressResponse> {
    const createdRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request
    );

    this.logger.debug(`Address Service Create Address: ${JSON.stringify(createdRequest)}, User: ${JSON.stringify(user)}`);

    await this.contactService.checkContactExists(user.id, createdRequest.contact_id);

    const address = await this.prismaService.address.create({
      data: createdRequest
    });

    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code
    };
  }
}