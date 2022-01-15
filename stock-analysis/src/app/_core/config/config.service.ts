import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    BASE_URL = "https://craws.uber.space/"

  constructor() { }
}
