import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { datasource } from '../src/database/datasource';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }

    await datasource.runMigrations();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const userEmail = 'asdff@email.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: 'asfdda' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(userEmail);
      });
  });

  it('signup as a new user and then get the currently logged in user', async () => {
    const email = 'newmail@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' });
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });
});
