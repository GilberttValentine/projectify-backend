import { randEmail, randFirstName, randLastName } from '@ngneat/falso';

export class UserFactory {
  firstName = randFirstName();
  lastName = randLastName();
  email = randEmail();
  password = "123456";
}
