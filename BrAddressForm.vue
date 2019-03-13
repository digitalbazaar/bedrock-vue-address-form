<template>
  <div class="fit">
    <div class="q-mt-md">
      <q-input
        v-model="value.streetAddress"
        :error="$v.value.streetAddress.$error"
        :label="streetAddressLabel"
        class="q-pa-sm q-mt-md"
        autocomplete="address-line1"
        @blur="$v.value.streetAddress.$touch"
        @keyup="$v.value.streetAddress.$touch" />
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-8 q-pr-md">
        <q-input
          v-model="value.addressLocality"
          :error="$v.value.addressLocality.$error"
          :label="addressLocalityLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="address-level2"
          @blur="$v.value.addressLocality.$touch"
          @keyup="$v.value.addressLocality.$touch" />
      </div>
      <div class="col-sm-4">
        <q-input
          v-model="value.postalCode"
          :error="$v.value.postalCode.$error"
          :label="postalCodeLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="postal-code"
          @blur="$v.value.postalCode.$touch"
          @keyup="$v.value.postalCode.$touch" />
      </div>
    </div>
    <div
      v-else
      class="q-mt-md">
      <q-input
        v-model="value.addressLocality"
        :error="$v.value.addressLocality.$error"
        :label="addressLocalityLabel"
        class="q-pa-sm q-mt-md"
        autocomplete="address-level2"
        @blur="$v.value.addressLocality.$touch"
        @keyup="$v.value.addressLocality.$touch" />
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-select
          v-if="regions.length > 0"
          v-model="value.addressRegion"
          :error="$v.value.addressRegion.$error"
          :label="addressRegionLabel"
          :options="regions"
          emit-value
          map-options
          class="q-pa-sm q-mt-md fast-open"
          @blur="$v.value.addressRegion.$touch"
          @keyup="$v.value.addressRegion.$touch">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-else
          v-model="value.addressRegion"
          :error="$v.value.addressRegion.$error"
          :label="addressRegionLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="address-level1"
          @blur="$v.value.addressRegion.$touch"
          @keyup="$v.value.addressRegion.$touch" />
      </div>
      <div class="col-sm-6">
        <q-select
          v-model="value.addressCountry"
          :error="$v.value.addressCountry.$error"
          :label="addressCountryLabel"
          :options="countries"
          emit-value
          map-options
          input-debounce="0"
          class="q-pa-sm q-mt-md fast-open"
          @blur="$v.value.addressCountry.$touch"
          @keyup="$v.value.addressCountry.$touch">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div
      v-else
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-select
          v-model="value.addressRegion"
          :error="$v.value.addressRegion.$error"
          :label="addressRegionLabel"
          :options="regions"
          emit-value
          map-options
          input-debounce="0"
          class="q-pa-sm q-mt-md fast-open"
          @blur="$v.value.addressRegion.$touch"
          @keyup="$v.value.addressRegion.$touch">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-sm-6">
        <q-input
          v-model="value.postalCode"
          :error="$v.value.postalCode.$error"
          :label="postalCodeLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="postal-code"
          @blur="$v.value.postalCode.$touch"
          @keyup="$v.value.postalCode.$touch" />
      </div>
    </div>
  </div>
</template>
<script>
/*!
  * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
  */
'use strict';

import {minLength, required} from 'vuelidate/lib/validators';
import countryOptions from './countries';

export default {
  name: 'BrAddressForm',
  props: {
    value: {
      type: Object,
      required: true,
      default: () => ({})
    },
    fields: {
      type: Object,
      required: true,
      default: () => ({})
    },
    restrictCountry: {
      type: Object,
      required: false,
      default: () => ([])
    }
  },
  data() {
    return {
      filter: {
        countries: '',
        regions: ''
      }
    };
  },
  validations() {
    if(this.addressCountryExists) {
      return {
        value: {
          addressCountry: {
            minLength: minLength(1),
            required
          },
          addressLocality: {
            minLength: minLength(1),
            required
          },
          addressRegion: {
            minLength: minLength(1),
            required
          },
          postalCode: {
            minLength: minLength(1),
            required
          },
          streetAddress: {
            minLength: minLength(1),
            required
          }
        }
      };
    }
    return {
      value: {
        addressLocality: {
          minLength: minLength(1),
          required
        },
        addressRegion: {
          minLength: minLength(1),
          required
        },
        postalCode: {
          minLength: minLength(1),
          required
        },
        streetAddress: {
          minLength: minLength(1),
          required
        }
      }
    };
  },
  computed: {
    regions() {
      const filter = this.filter.regions;
      if(!this.addressCountryExists) {
        return countryOptions
          .find(c => c.value === 'US')
          .children.map(region => ({label: region, value: region}));
      }
      const prefix = this.value.addressCountry;
      const country = countryOptions.find(c => c.value === prefix);
      if(!country) {
        return [];
      }
      const regions = country.children.map(
        region => ({label: region, value: region})
      );

      if(filter) {
        return regions
          .filter(({label}) => label.toLowerCase().indexOf(filter) > -1);
      }
      return regions;
    },
    addressCountry() {
      return this.value.addressCountry;
    },
    addressCountryLabel() {
      return this.addressCountryOptions.label || 'Country';
    },
    addressCountryOptions() {
      return this.fields.addressCountry || {};
    },
    addressCountryExists() {
      return this.isString(this.addressCountry);
    },
    addressLocalityLabel() {
      return this.addressLocalityOptions.label || 'City';
    },
    addressLocalityOptions() {
      return this.fields.addressLocality || {};
    },
    countries() {
      const filter = this.filter.countries;
      let options = countryOptions.sort(
        (a, b) => a.label.localeCompare(b.label)
      );
      if(this.restrictCountry.length > 0) {
        options = options.filter(
          ({value}) => this.restrictCountry.includes(value)
        );
      }
      if(filter) {
        return options
          .filter(({label}) => label.toLowerCase().indexOf(filter) > -1);
      }
      return options;
    },
    addressRegionLabel() {
      const provinceCountries = ['CA'];
      const stateCountries = ['US'];
      const regionCountries = [];
      let defaultLabel = 'State/Province/Region';

      if(provinceCountries.includes(this.addressCountry)) {
        defaultLabel = 'Province';
      } else if(stateCountries.includes(this.addressCountry)) {
        defaultLabel = 'State';
      } else if(regionCountries.includes(this.addressCountry)) {
        defaultLabel = 'Region';
      }
      return this.addressRegionOptions.label || defaultLabel;
    },
    addressRegionOptions() {
      return this.fields.addressRegion || {};
    },
    postalCodeLabel() {
      let defaultLabel = 'ZIP/Postal Code';

      if(this.addressCountry === 'US') {
        defaultLabel = 'ZIP';
      } else if(this.addressCountry !== '') {
        defaultLabel = 'Postal Code';
      }
      return this.postalCodeOptions.label || defaultLabel;
    },
    postalCodeOptions() {
      return this.fields.postalCode || {};
    },
    streetAddressLabel() {
      return this.streetAddressOptions.label || 'Street Address';
    },
    streetAddressOptions() {
      return this.fields.streetAddress || {};
    },
    valid() {
      return !this.$v.value.$invalid;
    }
  },
  methods: {
    isString(str) {
      return isString(str);
    },
    countryFilter(val, done, abort) {
      // reset addressCountry and the countries filter
      this.value.addressCountry = '';
      this.filter.countries = '';

      if(val.length < 1) {
        done();
        return;
      }
      done(() => {
        this.filter.countries = val.toLowerCase();
      });
    },
    regionFilter(val, done, abort) {
      // reset addressRegion and the regions filter
      this.value.addressRegion = '';
      this.filter.regions = '';

      if(val.length < 1) {
        done();
        return;
      }
      done(() => {
        this.filter.regions = val.toLowerCase();
      });
    }
  }
};
// TODO: Move to bedrock-web-forms
/**
 * @function isString
 * @param {String} str
 * @description checks if something is a string.
 *
 * @returns {Boolean}
*/
function isString(str) {
  return typeof str === 'string';
}
</script>
<style scoped>
div.fast-open {
  transition-duration: 0.10s;
}
</style>
