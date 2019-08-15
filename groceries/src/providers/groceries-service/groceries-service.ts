import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

/*
  Generated class for the GroceriesServiceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesServiceProvider {

// Item global memory for Service provider
  items: any = [];

  dataChanged$ : Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

// URL for service endpoint
  baseURL = "https://groceries-server-pardhug.herokuapp.com";

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesServiceProvider Provider');
    // Initialize
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }
// getItem method to get data in async by CRUD Get endpoint
  getItems(): Observable<object[]> {
    return this.http.get(this.baseURL + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
// JSON data extractor
  private extractData(res: Response){
    let body = res;
    return body || {};
  }
// Error handler for getting data from End point in Async
  private handleError(error: Response | any){
    let errMsg : string;
    if(error instanceof Response){
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }else{
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  //Call Delete End point to delete by CRUD
  removeItem(item){
    console.log(item);
    this.http.delete(this.baseURL+'/api/groceries/'+item._id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }
  //Call Post end point to add entry by CRUD
  addItem(item){
    this.http.post(this.baseURL+'/api/groceries/', item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }
  //Call Put end point to update by CRUD
  editItem(item, index){
    let id = item._id;
    this.http.put(this.baseURL+'/api/groceries/'+id, item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

}