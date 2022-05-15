import supertest from 'supertest';
import { beforeEach } from 'mocha';
import { assert } from 'chai';

import { clearAll } from '../DBHelper';
import { ProjectFactory } from '../factories/project';
import { app, server } from '../../index';
import * as ProjectRepository from '../../app/repositories/projectRepository';

const api = supertest(app);
const URI = '/api/projects';

describe('Project flow success path', () => {
  beforeEach(async () => {
    await clearAll();
  });

  it('Create project successfully test', async () => {
    const project = new ProjectFactory();

    await api.post(URI).send(project).expect(200);

    const projectToFind = await ProjectRepository.findByName(project.name);
    assert.isNotNull(projectToFind);
    assert.equal(projectToFind.name, project.name);
  });

  it('Find project by id test', async () => {
    const { body } = await api.post(URI).send(new ProjectFactory()).expect(200);

    const project = body;

    await api.get(`${URI}?id=${project._id}`).expect(200);
  });

  it('Activate project by id test', async () => {
    const project = new ProjectFactory();
    project.status = false;

    const { body } = await api.post(URI).send(project).expect(200);

    const projectSaved = body;
    await api.patch(`${URI}/${projectSaved._id}/activate`).expect(200);

    const projectToFind = await ProjectRepository.findById(projectSaved._id);
    assert.isNotNull(projectToFind);
    assert.equal(projectToFind.status, true);
  });

  it('Deactivate project by id test', async () => {
    const { body } = await api.post(URI).send(new ProjectFactory()).expect(200);

    const project = body;
    await api.patch(`${URI}/${project._id}/deactivate`).expect(200);

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
  });

  it('Create project when project already exist test', async () => {
    const project = new ProjectFactory();
    await api.post(URI).send(project).expect(200);

    const projectRepeat = new ProjectFactory();
    projectRepeat.name = project.name;

    await api.post(URI).send(project).expect(412, { status: 412, message: 'Project already exist' });
  });

  it('Find project by id when project does not exist test', async () => {
    await api.get(`${URI}?id=12345`).expect(404, { status: 404, message: 'Project not found' });
  });

  it('Activate project by id when project is already activated test', async () => {
    const { body } = await api.post(URI).send(new ProjectFactory()).expect(200);

    const projectSaved = body;
    await api.patch(`${URI}/${projectSaved._id}/activate`).expect(412, { status: 412, message: 'Project is already actived' });
  });

  it('Activate project by id when project does not exist test', async () => {
    await api.patch(`${URI}/123456/activate`).expect(404, { status: 404, message: 'Project not found' });
  });

  it('Deactivate project by id when project is already deactivated test', async () => {
    const project = new ProjectFactory();
    project.status = false;

    const { body } = await api.post(URI).send(project).expect(200);

    const projectSaved = body;
    await api.patch(`${URI}/${projectSaved._id}/deactivate`).expect(412, { status: 412, message: 'Project is already deactived' });
  });

  it('Deactivate project by id when project does not exist test', async () => {
    await api.patch(`${URI}/123456/deactivate`).expect(404, { status: 404, message: 'Project not found' });
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});
