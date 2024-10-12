import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { TestService } from "./test.service";
import { TestModule } from "./test.module";

describe('ContactController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  });

  describe("POST /api/contacts", () => {
    beforeEach(async () => {
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser();
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set({ Authorization: "test" })
        .send({
         first_name: "",
         last_name: "",
         email: "hello",
         phone_number: ""
        })

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("Validation failed");
    });

    it('should be able to create contact ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set({ Authorization: "test" })
        .send({
          first_name: "hello",
          last_name: "test",
          email: "hello@mail.com",
          phone_number: "08123456789"
        })

      expect(response.status).toBe(201);
      expect(response.body.data.first_name).toBe("hello");
      expect(response.body.data.last_name).toBe("test");
      expect(response.body.data.email).toBe("hello@mail.com");
      expect(response.body.data.phone_number).toBe("08123456789");
    })
  })
});
