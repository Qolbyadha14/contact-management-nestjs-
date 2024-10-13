import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest } from "../model/address.model";
import { Auth } from "../common/auth.decorator";
import { WebResponse } from "../model/web.model";

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(
    private addressService: AddressService
  ) {}

  @Post()
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest) : Promise<WebResponse<AddressResponse>> {

    const result = await this.addressService.create(user, {
      contact_id: contactId,
      ...request
    });

    return {
      data: result
    }
  }

  @Get("/:addressId")
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number) : Promise<WebResponse<AddressResponse>> {

    const request: GetAddressRequest = {
      contact_id: contactId,
      address_id: addressId
    }

    const result = await this.addressService.get(user, request);

    return {
      data: result
    }
  }
}