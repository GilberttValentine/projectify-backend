import { randEmail, randFirstName, randLastName } from '@ngneat/falso';

export class UserFactory {
  names = randFirstName();
  lastNames = randLastName();
  email = randEmail();
  password = "123456";
  status = true;
}
