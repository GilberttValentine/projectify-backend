import { randProductName, randProductDescription } from '@ngneat/falso';

export class ProjectFactory {
  name = randProductName();
  description = randProductDescription();
  status = true;
}
