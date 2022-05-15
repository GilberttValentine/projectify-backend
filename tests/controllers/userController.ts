import supertest from 'supertest';
import { beforeEach } from 'mocha';
import { assert } from 'chai';

import { clearAll } from '../DBHelper';
import { UserFactory } from '../factories/user';
import { app, server } from '../../index';
import * as UserRepository from '../../app/repositories/userRepository';

const api = supertest(app);
const URI = '/api/users';

describe('User flow success path', () => {
  beforeEach(async () => {
    await clearAll();
  });

  it('Create user successfully test', async () => {
    const user = new UserFactory();

    await api.post(URI).send(user).expect(200);

    const userToFind = await UserRepository.findByEmail(user.email);
    assert.isNotNull(userToFind);
    assert.equal(userToFind.email, user.email);
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});

describe('User flow bad path', () => {
  beforeEach(async () => {
    await clearAll();
  });

  it('Create user when email address is already in use', async () => {
    const user = new UserFactory();
    await api.post(URI).send(user).expect(200);

    const userWithEmailRepeat = new UserFactory();
    userWithEmailRepeat.email = user.email;

    await api.post(URI).send(user).expect('Content-Type', /json/).expect(412, { status: 412, message: 'The email address already in use' });
  });

  it('Create user when email is wrong', async () => {
    const user = new UserFactory();
    user.email = 'emailwrong';

    await api.post(URI).send(user).expect('Content-Type', /json/).expect(412, { status: 412, message: 'The email address is invalid' });
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});
