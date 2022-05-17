/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');

import supertest from 'supertest';
import { beforeEach } from 'mocha';
import { assert } from 'chai';
import { DateTime } from 'luxon';

import { app, server } from '../../index';
import { clearAll } from '../DBHelper';

import { PayloadDTO } from '../../app/models/dto/payload';
import { User } from '../../app/models/schemas/user';
import { ProjectFactory } from '../factories/project';
import { ReportFactory } from '../factories/report';
import { UserFactory } from '../factories/user';

import * as ProjectRepository from '../../app/repositories/projectRepository';

const api = supertest(app);
const URI = '/api';

let token: any;
const SECRET = 'petrotuber';
const EXPIRATION = '3m';

describe('Report flow success path', () => {
  beforeEach(async () => {
    await clearAll();

    const user = await User.create(new UserFactory());

    const payload: PayloadDTO = {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      status: user.status,
    };

    token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  });

  it('Create report successfully test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);
  });

  it('Find report by id test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const reportToSave = new ReportFactory();
    reportToSave.projectId = project._id;

    const { body: reportSaved } = await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(reportToSave).expect(200);

    const { body: report } = await api.get(`${URI}/reports/${reportSaved._id}`).set('Authorization', `Bearer ${token}`).expect(200);

    assert.isNotNull(report);
    assert.equal(report.projectId, project._id);
  });

  it('Find user reports test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const { body: reports } = await api.get(`${URI}/reports/my-reports`).set('Authorization', `Bearer ${token}`).expect(200);

    assert.isNotNull(reports);
    assert.equal(reports.length, 1);
  });

  it('Find project reports test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const { body: reports } = await api.get(`${URI}/projects/${project._id}/reports`).set('Authorization', `Bearer ${token}`).expect(200);

    assert.isNotNull(reports);
    assert.equal(reports.length, 1);
  });

  it('Update report successfully test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    const { body: reportSaved } = await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const reportToUpdate = {
      dedication: {
        hours: 1,
        minutes: 0,
      },
    };

    await api.put(`${URI}/reports/${reportSaved._id}`).set('Authorization', `Bearer ${token}`).send(reportToUpdate).expect(200);
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});

describe('Report flow bad path', () => {
  beforeEach(async () => {
    await clearAll();

    const user = await User.create(new UserFactory());

    const SECRET = 'petrotuber';
    const EXPIRATION = '3m';

    const payload: PayloadDTO = {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      status: user.status,
    };

    token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  });

  it('Create report when project does not exist', async () => {
    const report = new ReportFactory();
    report.projectId = "62806eb36b6699b9bbe1768a";
    
    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(404, { status: 404, message: 'Project not found' });
  });

  it('Create report when user already reported at week test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);
    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(412, { status: 412, message: 'User has already reported this week' });
  });

  it('Create report when dedicated hours or minutes are invalid test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;
    report.dedication = {
      hours: 100,
      minutes: 60,
    };

    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(400, { status: 400, message: 'BAD REQUEST' });
  });

  it('Create report when user has exced the limit of hours test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;
    report.dedication = {
      hours: 46,
      minutes: 1,
    };

    await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(412, { status: 412, message: 'User has exceded the limit of hours' });
  });

  it('Find report by id when report does not exist', async () => {
    await api.get(`${URI}/reports/123456`).set('Authorization', `Bearer ${token}`).expect(404, { status: 404, message: 'Report does not exist' });
  });

  it('Find user reports when user has not reports test', async () => {
    await api.get(`${URI}/reports/my-reports`).set('Authorization', `Bearer ${token}`).expect(404, { status: 404, message: 'User has not reports' });
  });

  it('Find project reports when project has not reports test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    await api.get(`${URI}/projects/${project._id}/reports`).set('Authorization', `Bearer ${token}`).expect(404, { status: 404, message: 'Project has not reports' });
  });

  it('Update report when report to update does not exist test', async () => {
    const reportToUpdate = {
      dedication: {
        hours: 1,
        minutes: 0,
      },
    };

    await api.put(`${URI}/reports/123456`).set('Authorization', `Bearer ${token}`).send(reportToUpdate).expect(404, { status: 404, message: 'Report does not exist' });
  });

  it('Update report when user cannot update report', async () => {
    const user = await User.create(new UserFactory());

    const payload: PayloadDTO = {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      status: user.status,
    };

    const otherToken = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });

    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    const { body: reportSaved } = await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const reportToUpdate = {
      dedication: {
        hours: 1,
        minutes: 0,
      },
    };

    await api.put(`${URI}/reports/${reportSaved._id}`).set('Authorization', `Bearer ${otherToken}`).send(reportToUpdate).expect(412, { status: 412, message: 'User cannot update this report' });
  });

  it('Update report when user try to update at another month', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;
    report.createdAt = DateTime.fromISO('2022-05-15T19:05:47.554Z').plus({ month: 2 }).toJSDate();

    const { body: reportSaved } = await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const reportToUpdate = {
      dedication: {
        hours: 1,
        minutes: 0,
      },
    };

    await api.put(`${URI}/reports/${reportSaved._id}`).set('Authorization', `Bearer ${token}`).send(reportToUpdate).expect(412, { status: 412, message: 'The updatable date from report is expired' });
  });

  it('Update report when dedicated hours or minutes are invalid test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    const { body: reportSaved } = await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const reportToUpdate = {
      dedication: {
        hours: -1,
        minutes: 60,
      },
    };

    await api.put(`${URI}/reports/${reportSaved._id}`).set('Authorization', `Bearer ${token}`).send(reportToUpdate).expect(400, { status: 400, message: 'BAD REQUEST' });
  });

  it('Update report when user has exced the limit of hours test', async () => {
    const projectToSave = new ProjectFactory();
    await api.post(`${URI}/projects`).set('Authorization', `Bearer ${token}`).send(projectToSave).expect(200);

    const project = await ProjectRepository.findByName(projectToSave.name);

    const report = new ReportFactory();
    report.projectId = project._id;

    const { body: reportSaved } = await api.post(`${URI}/reports`).set('Authorization', `Bearer ${token}`).send(report).expect(200);

    const reportToUpdate = {
      dedication: {
        hours: 100,
        minutes: 5,
      },
    };

    await api.put(`${URI}/reports/${reportSaved._id}`).set('Authorization', `Bearer ${token}`).send(reportToUpdate).expect(412, { status: 412, message: 'User has exceded the limit of hours' });
  });

  afterEach(async () => {
    await clearAll();
    server.close();
  });
});
