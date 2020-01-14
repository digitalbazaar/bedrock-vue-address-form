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
      <div class="col-sm-8 q-pr-md address-locality">
        <q-input
          v-model="value.addressLocality"
          :error="$v.value.addressLocality.$error"
          :label="addressLocalityLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="address-level2"
          @blur="$v.value.addressLocality.$touch"
          @keyup="$v.value.addressLocality.$touch" />
      </div>
      <div class="col-sm-4 postal-code">
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
      class="q-mt-md address-locality">
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
      <div class="col-sm-6 q-pr-md address-region">
        <q-select
          v-if="regions.length > 0"
          v-model="value.addressRegion"
          :error="$v.value.addressRegion.$error"
          :label="addressRegionLabel"
          :options="regions"
          emit-value
          map-options
          class="q-pa-sm q-mt-md fast-open"
          @input="$v.value.addressRegion.$touch" />
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
      <div class="col-sm-6 address-country">
        <q-select
          ref="countrySelector"
          v-model="value.addressCountry"
          :error="$v.value.addressCountry.$error"
          :label="addressCountryLabel"
          :options="countries"
          emit-value
          map-options
          use-input
          input-debounce="0"
          class="q-pa-sm q-mt-md fast-open"
          @filter="filterCountries"
          @input="handleSelect">
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
      <div class="col-sm-6 q-pr-md address-region">
        <q-select
          v-model="value.addressRegion"
          :error="$v.value.addressRegion.$error"
          :label="addressRegionLabel"
          :options="regions"
          emit-value
          map-options
          class="q-pa-sm q-mt-md fast-open"
          @input="$v.value.addressRegion.$touch" />
      </div>
      <div class="col-sm-6 postal-code">
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
        countries: ''
      }
    };
  },
  mounted() {
    this.filterInput.setAttribute('autocomplete', 'new-address');
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
    },
    filterInput() {
      if(!this.$refs.countrySelector) {
        return document.createElement('input');
      }
      return this.$refs.countrySelector.$el.querySelector('input');
    }
  },
  methods: {
    async filterCountries(val, update) {
      this.filterInput.style.display = 'inline-block';
      this.filterInput.focus();
      this.$v.value.addressCountry.$reset();
      this.value.addressCountry = '';
      this.filter.countries = '';
      if(val.length < 1 ) {
        return update();
      }
      return update(() => {
        this.filter.countries = val.toLowerCase();
      });
    },
    handleSelect() {
      // the default behavior in the beta is to leave the input focused on select.
      this.filter.countries = '';
      this.filterInput.blur();
      this.filterInput.style.display = 'none';
      this.$v.value.addressCountry.$touch();
      if(this.$v.value.addressRegion.$invalid && this.regions) {
        this.$v.value.addressRegion.$reset();
      }
    },
    isString(str) {
      return isString(str);
    },
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
<style lang="scss" scoped>

div.fast-open {
  transition-duration: 0.10s;
}

/* Media Queries - Need to replace media queries in future
with a better solution */
@media screen and (max-width: 767px) {

  .address-locality,
  .address-region {
    width: 100%;
    padding-right: 0;
  }

  .address-country,
  .postal-code {
    width: 100%;
  }
}

</style>
