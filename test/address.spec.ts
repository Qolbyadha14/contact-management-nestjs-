import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { TestService } from "./test.service";
import { TestModule } from "./test.module";

describe('AddressController', () => {
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

  describe("POST /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    })

    it("should be rejected if request is invalid", async () => {

      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set({ Authorization: "test" })
        .send({
          street: "",
          city: "",
          province: "",
          country: "",
          postal_code: ""
        })

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("Validation failed");
    });

    it('should be able to create address ', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set({ Authorization: "test" })
        .send({
          street: "street 1",
          city: "city 1",
          province: "province 1",
          country: "country 1",
          postal_code: "1111"
        })

      expect(response.status).toBe(201);
      expect(response.body.data.street).toBe("street 1");
      expect(response.body.data.city).toBe("city 1");
      expect(response.body.data.province).toBe("province 1");
      expect(response.body.data.country).toBe("country 1");
      expect(response.body.data.postal_code).toBe("1111");
    })
  })

  describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    })

    it("should be rejected if contact id is invalid", async () => {

      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set({ Authorization: "test" })

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe("Contact not found");
    });

    it("should be rejected if address id is invalid", async () => {

      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set({ Authorization: "test" })

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe("Address not found");
    });

    it('should be able to get address ', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ Authorization: "test" })

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe("street test");
      expect(response.body.data.city).toBe("city test");
      expect(response.body.data.province).toBe("province test");
      expect(response.body.data.country).toBe("country test");
      expect(response.body.data.postal_code).toBe("1111");
    })
  })

  describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    })

    it("should be rejected if request is invalid", async () => {

      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ Authorization: "test" })
        .send({
          street: "",
          city: "",
          province: "",
          country: "",
          postal_code: ""
        })

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("Validation failed");
    });

    it('should be able to update address ', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set({ Authorization: "test" })
        .send({
          street: "street 2",
          city: "city 2",
          province: "province 2",
          country: "country 2",
          postal_code: "2222"
        })

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe("street 2");
      expect(response.body.data.city).toBe("city 2");
      expect(response.body.data.province).toBe("province 2");
      expect(response.body.data.country).toBe("country 2");
      expect(response.body.data.postal_code).toBe("2222");
    })

    it('should be rejected if contact not found ', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set({ Authorization: "test" })
        .send({
          street: "street 2",
          city: "city 2",
          province: "province 2",
          country: "country 2",
          postal_code: "2222"
        })

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe("Contact not found");
    })

    it('should be rejected if address not found ', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();

      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set({ Authorization: "test" })
        .send({
          street: "street 2",
          city: "city 2",
          province: "province 2",
          country: "country 2",
          postal_code: "2222"
        })

      expect(response.status).toBe(404);
      expect(response.body.errors).toBe("Address not found");
    })
  })
});
