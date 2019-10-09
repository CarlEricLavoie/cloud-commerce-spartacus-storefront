import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UserActions } from '../actions/index';
import { ProductInterestList } from '../../../model/product-interest.model';
import { UserInterestsConnector } from '../../connectors/interests/user-interests.connector';

@Injectable()
export class ProductInterestsEffect {
  constructor(
    private actions$: Actions,
    private userInterestsConnector: UserInterestsConnector
  ) {}

  @Effect()
  loadProductInteres$: Observable<
    UserActions.ProductInterestsAction
  > = this.actions$.pipe(
    ofType(UserActions.LOAD_PRODUCT_INTERESTS),
    map((action: UserActions.LoadProductInterests) => action.payload),
    switchMap(payload => {
      return this.userInterestsConnector
        .getInterests(
          payload.userId,
          payload.pageSize,
          payload.currentPage,
          payload.sort
        )
        .pipe(
          map((interests: ProductInterestList) => {
            return new UserActions.LoadProductInterestsSuccess(interests);
          }),
          catchError(error =>
            of(new UserActions.LoadProductInterestsFail(error))
          )
        );
    })
  );

  @Effect()
  removeProductInterests$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.REMOVE_PRODUCT_INTERESTS),
    map((action: UserActions.RemoveProductInterests) => action.payload),
    switchMap(payload =>
      this.userInterestsConnector
        .removeInterests(payload.userId, payload.item)
        .pipe(
          map((res: any) => new UserActions.RemoveProductInterestsSuccess(res)),
          catchError(error =>
            of(new UserActions.RemoveProductInterestsFail(error))
          )
        )
    )
  );

  // @Effect()
  // resetProductInterests$: Observable<Action> = this.actions$.pipe(
  //   ofType(
  //     CLEAR_USER_MISCS_DATA,
  //     UserActions.CLEAR_PRODUCT_INTERESTS,
  //     UserActions.DELETE_PRODUCT_INTERESTS_SUCCESS
  //   ),
  //   map(() => {
  //     return new UserActions.ClearProductInterests();
  //   })
  // );
}