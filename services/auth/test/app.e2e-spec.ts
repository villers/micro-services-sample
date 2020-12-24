import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import Constants from '../src/auth/constants';

describe('AppController (e2e)', () => {
  let app: INestMicroservice;
  let authService: AuthService;
  const client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.TCP,
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      logger: false,
    });

    authService = app.get<AuthService>(AuthService);

    await app.listenAsync();
  });

  afterAll(async () => {
    await app.close();
    await client.close();
  });

  it(`can be ping`, (done) => {
    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'ping' },
      {},
    );

    response.subscribe((result) => {
      expect(result).toBe('pong');
      done();
    });
  });

  it(`can login with valid credential`, (done) => {
    jest
      .spyOn(authService, 'validateUser')
      .mockImplementation((username, password) => {
        return new Promise((resolve) => {
          resolve({ id: 1, username, password });
        });
      });

    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'login' },
      { username: 'username', password: 'password' },
    );

    response.subscribe((result: any) => {
      result.accessToken = result.accessToken.split('.')[0];
      expect(result).toMatchObject({
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        userId: 1,
      });
      done();
    });
  });

  it(`cant login with invalid credential`, (done) => {
    jest.spyOn(authService, 'validateUser').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(null);
      });
    });

    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'login' },
      { username: 'username', password: 'password' },
    );

    response.subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it(`can verify token`, (done) => {
    const jwtService = new JwtService({
      secret: Constants.jwtSecret,
    });

    const user = {
      id: 1,
      username: 'username',
      password: 'password',
    };
    const payload = { user, sub: user.id };

    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'check' },
      { jwt: jwtService.sign(payload) },
    );

    response.subscribe((result: any) => {
      expect(result).toMatchObject({
        iat: result.iat,
        sub: 1,
        user: { id: 1, password: 'password', username: 'username' },
      });
      done();
    });
  });

  it(`invalid signature token`, (done) => {
    const jwtService = new JwtService({
      secret: 'bad secret',
    });

    const user = {
      id: 1,
      username: 'username',
      password: 'password',
    };
    const payload = { user, sub: user.id };

    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'check' },
      { jwt: jwtService.sign(payload) },
    );

    response.subscribe((result: any) => {
      expect(result).toBe(false);
      done();
    });
  });

  it(`can get user data`, (done) => {
    const jwtService = new JwtService({
      secret: Constants.jwtSecret,
    });

    const user = {
      id: 1,
      username: 'username',
      password: 'password',
    };
    const payload = { user, sub: user.id };

    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'get' },
      { jwt: jwtService.sign(payload) },
    );

    response.subscribe((result: any) => {
      expect(result).toMatchObject({
        id: 1,
        username: 'username',
      });
      done();
    });
  });

  it(`cant get user data`, (done) => {
    const jwtService = new JwtService({
      secret: 'bad secret',
    });

    const user = {
      id: 1,
      username: 'username',
      password: 'password',
    };
    const payload = { user, sub: user.id };

    const response: Observable<string> = client.send(
      { role: 'auth', cmd: 'get' },
      { jwt: jwtService.sign(payload) },
    );

    response.subscribe((result: any) => {
      expect(result).toBe(false);
      done();
    });
  });
});
