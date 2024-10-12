import { PrismaService } from "../src/common/prisma.service";
import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { User } from "@prisma/client";

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        user: {
          username: 'test',
        },
      }
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        first_name: 'hallo',
        last_name: 'test',
        email: 'hallo@mail.com',
        phone_number: 'test',
        user: {
          connect: {
            username: 'test',
          },
        },
      },
    });
  }

  async getContact() {
    return this.prismaService.contact.findFirst({
      where: {
        user: {
          username: 'test',
        },
      }
    });
  }

}