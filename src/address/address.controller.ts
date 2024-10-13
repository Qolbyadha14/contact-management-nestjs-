import { Body, Controller, Param, ParseIntPipe, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest } from "../model/address.model";
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
}