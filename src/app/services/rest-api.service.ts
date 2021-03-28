import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(
    public httpClient: HttpClient
  ) { }

  getWeather(lat: number = 15.0646, lon: number = 120.7198) {
    return this.httpClient.get<any>(`${environment.serverAddress}?lat=${lat}&lon=${lon}&&exclude=minutely,hourly&lang=es&units=metric&appid=${environment.apiKey}`);
  }
}
