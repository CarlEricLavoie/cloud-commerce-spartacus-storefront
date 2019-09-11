import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { StoreFinderConnector } from '../../connectors/store-finder.connector';
import { StoreFinderActions } from '../actions/index';

@Injectable()
export class FindStoresEffect {
  constructor(
    private actions$: Actions,
    private storeFinderConnector: StoreFinderConnector
  ) {}

  @Effect()
  findStores$: Observable<
    | StoreFinderActions.FindStoresSuccess
    | StoreFinderActions.FindStoresFail
    | StoreFinderActions.StoreEntities
  > = this.actions$.pipe(
    ofType(StoreFinderActions.FIND_STORES),
    map((action: StoreFinderActions.FindStores) => action.payload),
    mergeMap(payload =>
      this.storeFinderConnector
        .search(
          payload.queryText,
          payload.searchConfig,
          payload.longitudeLatitude
        )
        .pipe(
          switchMap(data => {
            if (payload.countryIsoCode) {
              data.stores = data.stores.filter(
                store =>
                  store.address.country.isocode === payload.countryIsoCode
              );
            }

            return [
              new StoreFinderActions.FindStoresSuccess(data),
              new StoreFinderActions.StoreEntities(data),
            ];
          }),
          catchError(_ => of(new StoreFinderActions.FindStoresFail(true)))
        )
    )
  );

  @Effect()
  findStoreById$: Observable<
    | StoreFinderActions.FindStoreByIdSuccess
    | StoreFinderActions.FindStoreByIdFail
    | StoreFinderActions.StoreEntities
  > = this.actions$.pipe(
    ofType(StoreFinderActions.FIND_STORE_BY_ID),
    map((action: StoreFinderActions.FindStoreById) => action.payload),
    switchMap(payload =>
      this.storeFinderConnector.get(payload.storeId).pipe(
        switchMap(data => [
          new StoreFinderActions.FindStoreByIdSuccess(data),
          new StoreFinderActions.StoreEntities(data),
        ]),
        catchError(_ => of(new StoreFinderActions.FindStoreByIdFail(true)))
      )
    )
  );
}
