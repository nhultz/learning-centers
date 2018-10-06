import { Observable } from 'rxjs';

export interface Center {
  name: string;
  category: string;
  storageUrl: string;
  url?: Observable<string | null>;
}
