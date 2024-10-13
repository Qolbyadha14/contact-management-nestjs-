import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { AddressService } from "./address.service";
import { User } from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest
} from "../model/address.model";
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

  @Put("/:addressId")
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() request: UpdateAddressRequest) : Promise<WebResponse<AddressResponse>> {

    request.id = addressId;
    request.contact_id = contactId;

    const result = await this.addressService.update(user, request);

    return {
      data: result
    }
  }

  @Delete("/:addressId")
  @HttpCode(200)
  async destroy(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number) : Promise<WebResponse<boolean>> {

    const request: RemoveAddressRequest = {
      contact_id: contactId,
      address_id: addressId
    }

    const result = await this.addressService.remove(user, request);

    return {
      data: true
    }
  }
}