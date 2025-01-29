import { Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
  let token = req.headers['authorization'] as string;
  
  if (token) {
    token = token.replace(/^Bearer\s+/i, '');
    const user = await this.prismaService.user.findFirst({
      where: { token }
    });

    if (user) {
      req.user = user;
    }
  }

  next();
}

}