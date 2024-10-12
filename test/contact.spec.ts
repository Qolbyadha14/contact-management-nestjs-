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

  describe("GET /api/contacts", () => {
    beforeEach(async () => {
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser();
      await testService.createContact();
    })

    it('should be rejected if contact not found ', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set({ Authorization: "test" })

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe("Contact not found");
    })

    it("should be able to get contact", async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set({ Authorization: "test" })

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe(contact.first_name);
      expect(response.body.data.last_name).toBe(contact.last_name);
      expect(response.body.data.email).toBe(contact.email);
      expect(response.body.data.phone_number).toBe(contact.phone_number);
    });
  })

  describe("PUT /api/contacts", () => {
    beforeEach(async () => {
      await testService.deleteContact()
      await testService.deleteUser()

      await testService.createUser();
      await testService.createContact();
    })

    it("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
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

    it("should be rejected if contact not found", async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}`)
        .set({ Authorization: "test" })
        .send({
          first_name: "hello-updated",
          last_name: "test-updated",
          email: "hello-updated@mail.com",
          phone_number: "081234567891"
        })

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe("Contact not found");
    });

    it('should be able to create contact ', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set({ Authorization: "test" })
        .send({
          first_name: "hello-updated",
          last_name: "test-updated",
          email: "hello-updated@mail.com",
          phone_number: "081234567891"
        })

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe("hello-updated");
      expect(response.body.data.last_name).toBe("test-updated");
      expect(response.body.data.email).toBe("hello-updated@mail.com");
      expect(response.body.data.phone_number).toBe("081234567891");
    })
  })
});
