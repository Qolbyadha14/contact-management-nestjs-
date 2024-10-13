import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { Address, User } from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest
} from "../model/address.model";
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

    const result = await this.prismaService.address.create({
      data: createdRequest
    });

    return this.toAddressResponse(result)
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const createdRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request
    );

    await this.contactService.checkContactExists(user.id, createdRequest.contact_id);

    const result = await this.checkAddressExists(
      createdRequest.contact_id,
      createdRequest.address_id
    )

    return this.toAddressResponse(result)
  }

  async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request
    );

    await this.contactService.checkContactExists(
      user.id,
      updateRequest.contact_id);

    await this.checkAddressExists(
      updateRequest.contact_id,
      updateRequest.id
    )

    const result = await this.prismaService.address.update({
      where: { id: updateRequest.id, contact_id: updateRequest.contact_id },
      data: updateRequest
    })

    return this.toAddressResponse(result)
  }

  async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
    const removeRequest: RemoveAddressRequest = this.validationService.validate(
      AddressValidation.REMOVE,
      request
    );

    await this.contactService.checkContactExists(
      user.id,
      removeRequest.contact_id
    );

     await this.checkAddressExists(
      removeRequest.contact_id,
      removeRequest.address_id
    )

    let address = await this.prismaService.address.delete({
      where: { id: removeRequest.address_id, contact_id: removeRequest.contact_id }
    })

    return this.toAddressResponse(address);
  }

  toAddressResponse(result: Address): AddressResponse {
    return {
      id: result.id,
      street: result.street,
      city: result.city,
      province: result.province,
      country: result.country,
      postal_code: result.postal_code
    }
  }

  async checkAddressExists(contact_id: number, address_id: number): Promise<Address> {
    const result = await this.prismaService.address.findFirst({
      where: {
        id: address_id,
        contact_id: contact_id
      }
    });

    if (!result) {
      throw new HttpException('Address not found', 404)
    }

    return result;
  }
}