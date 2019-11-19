import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConverterService } from '../../../../../util/converter.service';
import { OccConfigurator } from '../occ-configurator.models';
import { OccConfiguratorVariantPriceNormalizer } from './occ-configurator-variant-price-normalizer';

class MockConverterService {
  convert() {}
}

const CONFIG_ID = 'configId1234';

const prices: OccConfigurator.Prices = {
  configId: CONFIG_ID,
  pricingError: false,
  showDeltaPrices: false,
  priceSummary: {
    basePrice: {
      formattedValue: '22.000 €',
    },
    selectedOptions: {
      formattedValue: '900 €',
    },
    currentTotal: {
      formattedValue: '22.900 €',
    },
  },
};

describe('OccConfiguratorVariantNormalizer', () => {
  let occConfiguratorVariantPriceNormalizer: OccConfiguratorVariantPriceNormalizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccConfiguratorVariantPriceNormalizer,
        { provide: ConverterService, useClass: MockConverterService },
      ],
    });

    occConfiguratorVariantPriceNormalizer = TestBed.get(
      OccConfiguratorVariantPriceNormalizer as Type<
        OccConfiguratorVariantPriceNormalizer
      >
    );
  });

  it('should be created', () => {
    expect(occConfiguratorVariantPriceNormalizer).toBeTruthy();
  });

  it('should convert a price to a configuration', () => {
    const result = occConfiguratorVariantPriceNormalizer.convert(prices);
    expect(result.configId).toBe(CONFIG_ID);
    expect(result.priceSummary).toBe(prices.priceSummary);
  });
});
