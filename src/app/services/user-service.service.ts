import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../global_help/base_url_helper';
import { UserDto } from '../dtos/request/UserDto.model';
import { CustomResponseEntity } from '../exception_handler/CustomResponseEntity.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Register user - matches your backend endpoint
  public registerUser(userDto: UserDto): Observable<CustomResponseEntity> {
    return this.http.post<CustomResponseEntity>(
      `${baseUrl}/v1/user-auth/register`,
      userDto
    );
  }
}