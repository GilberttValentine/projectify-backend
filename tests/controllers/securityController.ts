/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');

import supertest from 'supertest';
import { beforeEach } from 'mocha';

import { app, server } from '../../index';
import { clearAll } from '../DBHelper';
import { encryptPassword } from '../../app/utils/passwordEncrypter';

import { User } from '../../app/models/schemas/user';
import { UserFactory } from '../factories/user';
import { PayloadDTO } from '../../app/models/dto/payload';

const api = supertest(app);
const URI = '/api/security';

describe('Security flow success path', () => {
  beforeEach(async () => {
    await clearAll();
  });

  it('Login successfully test', async () => {
    const user = new UserFactory();
    user.password = await encryptPassword(user.password);

    await User.create(user);

    const body = {
      email: user.email,
      password: '123456',
    };

    await api.post(`${URI}/login`).send(body).expect(200);
  });

  it('Validate token successfully test', async () => {
    const user = new UserFactory();
    user.password = await encryptPassword(user.password);

    await User.create(user);

    const body = {
      email: user.email,
      password: '123456',
    };

    const { body: token } = await api.post(`${URI}/login`).send(body).expect(200);

    await api.post(`${URI}/verify-token`).send(token).expect(200);
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});

describe('Security flow bad path', () => {
  beforeEach(async () => {
    await clearAll();
  });

  it('Login when credentials are invalid test', async () => {
    const user = new UserFactory();

    await User.create(user);

    const body = {
      email: user.email,
      password: '123456',
    };

    await api.post(`${URI}/login`).send(body).expect(403, { status: 403, message: 'Credentials are invalid' });
  });

  it('Login when user is deactivated test', async () => {
    const user = new UserFactory();
    user.status = false;

    await User.create(user);

    const body = {
      email: user.email,
      password: '123456',
    };

    await api.post(`${URI}/login`).send(body).expect(403, { status: 403, message: 'User has been deactivated' });
  });

  it('Validate token when token is expired test', async () => {
    const user = new UserFactory();

    await User.create(user);

    const SECRET = 'petrotuber';
    const EXPIRATION = '0s';

    const payload: PayloadDTO = {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      status: user.status,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });

    const body = {
      token: token,
    };

    await api.post(`${URI}/verify-token`).send(body).expect(403, { status: 403, message: 'Unauthorized' });
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});
