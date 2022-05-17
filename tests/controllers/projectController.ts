/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');

import supertest from 'supertest';
import { beforeEach } from 'mocha';
import { assert } from 'chai';

import { clearAll } from '../DBHelper';
import { app, server } from '../../index';

import { ProjectFactory } from '../factories/project';

import * as ProjectRepository from '../../app/repositories/projectRepository';
import { User } from '../../app/models/schemas/user';
import { UserFactory } from '../factories/user';
import { PayloadDTO } from '../../app/models/dto/payload';

const api = supertest(app);
const URI = '/api/projects';

let token: any;
describe('Project flow success path', () => {
  beforeEach(async () => {
    await clearAll();

    const SECRET = 'petrotuber';
    const EXPIRATION = '3m';

    const user = await User.create(new UserFactory());

    const payload: PayloadDTO = {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      status: user.status,
    };

    token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  });

  it('Create project successfully test', async () => {
    const project = new ProjectFactory();

    await api.post(URI).set('Authorization', `Bearer ${token}`).send(project).expect(200);

    const projectToFind = await ProjectRepository.findByName(project.name);
    assert.isNotNull(projectToFind);
    assert.equal(projectToFind.name, project.name);
  });

  it('Find all projects test', async () => {
    await api.post(URI).set('Authorization', `Bearer ${token}`).send(new ProjectFactory()).expect(200);

    const { body: projects } = await api.get(URI).set('Authorization', `Bearer ${token}`).expect(200);

    assert.isNotNull(projects);
    assert.equal(projects.length, 1);
  });

  it('Find project by id test', async () => {
    const { body } = await api.post(URI).set('Authorization', `Bearer ${token}`).send(new ProjectFactory()).expect(200);
    const project = body;

    await api.get(`${URI}/${project._id}`).set('Authorization', `Bearer ${token}`).expect(200);
  });

  it('Activate project by id test', async () => {
    const project = new ProjectFactory();
    project.status = false;

    const { body: projectSaved } = await api.post(URI).set('Authorization', `Bearer ${token}`).send(project).expect(200);

    await api.patch(`${URI}/${projectSaved._id}/activate`).set('Authorization', `Bearer ${token}`).expect(200);

    const projectToFind = await ProjectRepository.findById(projectSaved._id);
    assert.isNotNull(projectToFind);
    assert.equal(projectToFind.status, true);
  });

  it('Deactivate project by id test', async () => {
    const { body } = await api.post(URI).set('Authorization', `Bearer ${token}`).send(new ProjectFactory()).expect(200);

    const project = body;
    await api.patch(`${URI}/${project._id}/deactivate`).set('Authorization', `Bearer ${token}`).expect(200);

    const projectToFind = await ProjectRepository.findById(project._id);
    assert.isNotNull(projectToFind);
    assert.equal(projectToFind.status, false);
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});

describe('Project flow bad path', () => {
  beforeEach(async () => {
    await clearAll();

    const SECRET = 'petrotuber';
    const EXPIRATION = '3m';

    const user = await User.create(new UserFactory());

    const payload: PayloadDTO = {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      status: user.status,
    };

    token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  });

  it('Create project when project already exist test', async () => {
    const project = new ProjectFactory();
    await api.post(URI).set('Authorization', `Bearer ${token}`).send(project).expect(200);

    const projectRepeat = new ProjectFactory();
    projectRepeat.name = project.name;

    await api.post(URI).set('Authorization', `Bearer ${token}`).send(project).expect(412, { status: 412, message: 'Project already exist' });
  });

  it('Find project by id when project does not exist test', async () => {
    await api.get(`${URI}/12345`).set('Authorization', `Bearer ${token}`).expect(404, { status: 404, message: 'Project not found' });
  });

  it('Find all projects when do not exist any project test', async () => {
    const { body: projects } = await api.get(URI).set('Authorization', `Bearer ${token}`).expect(200);

    assert.isNotNull(projects);
    assert.equal(projects.length, 0);
  });

  it('Activate project by id when project is already activated test', async () => {
    const { body: projectSaved } = await api.post(URI).set('Authorization', `Bearer ${token}`).send(new ProjectFactory()).expect(200);

    await api.patch(`${URI}/${projectSaved._id}/activate`).set('Authorization', `Bearer ${token}`).expect(412, { status: 412, message: 'Project is already actived' });
  });

  it('Activate project by id when project does not exist test', async () => {
    await api.patch(`${URI}/123456/activate`).set('Authorization', `Bearer ${token}`).expect(404, { status: 404, message: 'Project not found' });
  });

  it('Deactivate project by id when project is already deactivated test', async () => {
    const project = new ProjectFactory();
    project.status = false;

    const { body: projectSaved } = await api.post(URI).set('Authorization', `Bearer ${token}`).send(project).expect(200);

    await api.patch(`${URI}/${projectSaved._id}/deactivate`).set('Authorization', `Bearer ${token}`).expect(412, { status: 412, message: 'Project is already deactived' });
  });

  it('Deactivate project by id when project does not exist test', async () => {
    await api.patch(`${URI}/123456/deactivate`).set('Authorization', `Bearer ${token}`).expect(404, { status: 404, message: 'Project not found' });
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});
