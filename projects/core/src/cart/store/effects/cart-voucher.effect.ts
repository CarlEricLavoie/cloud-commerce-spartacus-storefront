import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GlobalMessageService } from '../../../global-message/facade/global-message.service';
import { GlobalMessageType } from '../../../global-message/models/global-message.model';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { CartVoucherConnector } from '../../connectors/voucher/cart-voucher.connector';
import { CartActions } from '../actions/index';

@Injectable()
export class CartVoucherEffects {
  constructor(
    private actions$: Actions,
    private cartVoucherConnector: CartVoucherConnector,
    private messageService: GlobalMessageService
  ) {}

  @Effect()
  addCartVoucher$: Observable<
    | CartActions.CartVoucherAction
    | CartActions.LoadCart
    | CartActions.DequeueCartAction
  > = this.actions$.pipe(
    ofType(CartActions.CART_ADD_VOUCHER),
    map((action: CartActions.CartAddVoucher) => action.payload),
    mergeMap(payload => {
      return this.cartVoucherConnector
        .add(payload.userId, payload.cartId, payload.voucherId)
        .pipe(
          map(() => {
            this.showGlobalMessage(
              'voucher.applyVoucherSuccess',
              payload.voucherId,
              GlobalMessageType.MSG_TYPE_CONFIRMATION
            );
            return new CartActions.CartAddVoucherSuccess({
              userId: payload.userId,
              cartId: payload.cartId,
            });
          }),
          catchError(error =>
            from([
              new CartActions.CartAddVoucherFail(makeErrorSerializable(error)),
              new CartActions.DequeueCartAction(payload.cartId),
              new CartActions.LoadCart({
                userId: payload.userId,
                cartId: payload.cartId,
              }),
            ])
          )
        );
    })
  );

  @Effect()
  removeCartVoucher$: Observable<
    | CartActions.CartVoucherAction
    | CartActions.DequeueCartAction
    | CartActions.LoadCart
  > = this.actions$.pipe(
    ofType(CartActions.CART_REMOVE_VOUCHER),
    map((action: CartActions.CartRemoveVoucher) => action.payload),
    mergeMap(payload => {
      return this.cartVoucherConnector
        .remove(payload.userId, payload.cartId, payload.voucherId)
        .pipe(
          map(() => {
            this.showGlobalMessage(
              'voucher.removeVoucherSuccess',
              payload.voucherId,
              GlobalMessageType.MSG_TYPE_INFO
            );
            return new CartActions.CartRemoveVoucherSuccess({
              userId: payload.userId,
              cartId: payload.cartId,
            });
          }),
          catchError(error =>
            from([
              new CartActions.CartRemoveVoucherFail(
                makeErrorSerializable(error)
              ),
              new CartActions.DequeueCartAction(payload.cartId),
              new CartActions.LoadCart({
                userId: payload.userId,
                cartId: payload.cartId,
              }),
            ])
          )
        );
    })
  );

  private showGlobalMessage(
    text: string,
    param: string,
    messageType: GlobalMessageType
  ) {
    this.messageService.add(
      { key: text, params: { voucherCode: param } },
      messageType
    );
  }
}
