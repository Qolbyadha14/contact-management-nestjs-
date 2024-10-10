import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { TestService } from "./test.service";
import { TestModule } from "./test.module";

describe('UserController', () => {
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

  describe("POST /user/register", () => {
    beforeEach(async () => {
      await testService.deleteUser()
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: "",
          password: "",
          name: ""
        })
      logger.info(response.body)

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("Validation failed");
    });

    it('should register user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: "test",
          password: "test",
          name: "test"
        });

      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe("test");
      expect(response.body.data.name).toBe("test");
    })

    it('should be rejected if user already exists', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: "test",
          password: "test",
          name: "test"
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("username already exists");
    })
  })

  describe("POST /user/login", () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createUser();
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: "",
          password: "",
        })
      logger.info(response.body)

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("Validation failed");
    });

    it('should login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: "test",
          password: "test",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe("test");
      expect(response.body.data.name).toBe("test");
      expect(response.body.data.token).not.toBe(null);
    })
  })

  describe("Get /user/current", () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createUser();
    })

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set({ Authorization: "invalid" })
      logger.info(response.body)

      expect(response.status).toBe(401);
      expect(response.body.errors).toBe("Unauthorized");
    });

    it('should be able to get current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set({ Authorization: "test" })

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe("test");
      expect(response.body.data.name).toBe("test");
    })
  })

  describe("PATCH /user/current", () => {
    beforeEach(async () => {
      await testService.deleteUser()
      await testService.createUser();
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set({ Authorization: "test" })
        .send({
          username: "",
          password: "",
          name: ""
        })
      logger.info(response.body)

      expect(response.status).toBe(422);
      expect(response.body.errors).toBe("Validation failed");
    });

    it('should be able to update name', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set({ Authorization: "test" })
        .send({
          name: "test updated"
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe("test");
      expect(response.body.data.name).toBe("test updated");
    })

    it('should be able to update password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set({ Authorization: "test" })
        .send({
          password: "updated"
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe("test");
      expect(response.body.data.name).toBe("test");

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: "test",
          password: "updated"
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe("test");
      expect(response.body.data.name).toBe("test");
      expect(response.body.data.token).not.toBe(null);
    })
  })
});
