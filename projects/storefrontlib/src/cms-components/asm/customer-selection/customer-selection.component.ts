import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AsmService,
  CustomerSearchPage,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { Subscription } from 'rxjs';
import { FormUtils } from '../../../shared/utils/forms/form-utils';

@Component({
  selector: 'cx-customer-selection',
  templateUrl: './customer-selection.component.html',
})
export class CustomerSelectionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private submitClicked = false;
  private subscription = new Subscription();

  @Output()
  submitEvent = new EventEmitter<{ customerId: string }>();

  constructor(
    private fb: FormBuilder,
    private asmService: AsmService,
    protected globalMessageService: GlobalMessageService
  ) {}

  ngOnInit(): void {
    console.log('CustomerSelectionComponent.ngOnInit:');
    this.form = this.fb.group({
      searchTerm: ['', [Validators.required]],
    });
    this.asmService.customerSearchReset();
    this.subscription.add(
      this.asmService.getCustomerSearchResult().subscribe(results => {
        this.handleSearchResults(results);
      })
    );
  }

  protected handleSearchResults(results: CustomerSearchPage): void {
    if (results.entries) {
      const customerHit = results.entries.find(
        element => element.uid === this.form.controls.searchTerm.value
      );
      if (customerHit) {
        this.submitEvent.emit({ customerId: customerHit.customerId });
      } else {
        this.globalMessageService.add(
          {
            key: 'asm.customerSearch.noHit',
            params: { uid: this.form.controls.searchTerm.value },
          },
          GlobalMessageType.MSG_TYPE_ERROR
        );
      }
    }
  }

  onSearch(): void {
    this.submitClicked = true;
    if (this.form.invalid) {
      return;
    }
    this.asmService.customerSearch(this.form.controls.searchTerm.value);
  }

  isNotValid(formControlName: string): boolean {
    return FormUtils.isNotValidField(
      this.form,
      formControlName,
      this.submitClicked
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
