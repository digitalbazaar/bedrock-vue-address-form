<template>
  <div class="fit">
    <div class="q-mt-md">
      <q-field :error="$v.value.streetAddress.$error">
        <q-input
          v-model="value.streetAddress"
          :float-label="streetAddressLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="address-line1"
          @blur="$v.value.streetAddress.$touch"
          @keyup="$v.value.streetAddress.$touch" />
      </q-field>
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-8 q-pr-md">
        <q-field :error="$v.value.addressLocality.$error">
          <q-input
            v-model="value.addressLocality"
            :float-label="addressLocalityLabel"
            class="q-pa-sm q-mt-md"
            autocomplete="address-level2"
            @blur="$v.value.addressLocality.$touch"
            @keyup="$v.value.addressLocality.$touch" />
        </q-field>
      </div>
      <div class="col-sm-4">
        <q-field :error="$v.value.postalCode.$error">
          <q-input
            v-model="value.postalCode"
            :float-label="postalCodeLabel"
            class="q-pa-sm q-mt-md"
            autocomplete="postal-code"
            @blur="$v.value.postalCode.$touch"
            @keyup="$v.value.postalCode.$touch" />
        </q-field>
      </div>
    </div>
    <div
      v-else
      class="q-mt-md">
      <q-field :error="$v.value.addressLocality.$error">
        <q-input
          v-model="value.addressLocality"
          :float-label="addressLocalityLabel"
          class="q-pa-sm q-mt-md"
          autocomplete="address-level2"
          @blur="$v.value.addressLocality.$touch"
          @keyup="$v.value.addressLocality.$touch" />
      </q-field>
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-field
          v-if="regions.length > 0"
          :error="$v.value.addressRegion.$error">
          <q-select
            v-model="value.addressRegion"
            :float-label="addressRegionLabel"
            :options="regions"
            filter
            autofocus-filter
            class="q-pa-sm q-mt-md fast-open"
            @blur="$v.value.addressRegion.$touch"
            @keyup="$v.value.addressRegion.$touch" />
        </q-field>
        <q-field
          v-else
          :error="$v.value.addressRegion.$error">
          <q-input
            v-model="value.addressRegion"
            :float-label="addressRegionLabel"
            class="q-pa-sm q-mt-md"
            autocomplete="address-level1"
            @blur="$v.value.addressRegion.$touch"
            @keyup="$v.value.addressRegion.$touch" />
        </q-field>
      </div>
      <div class="col-sm-6">
        <q-field :error="$v.value.addressCountry.$error">
          <q-select
            v-model="value.addressCountry"
            :float-label="addressCountryLabel"
            :options="countries"
            filter
            autofocus-filter
            class="q-pa-sm q-mt-md fast-open"
            @blur="$v.value.addressCountry.$touch"
            @keyup="$v.value.addressCountry.$touch" />
        </q-field>
      </div>
    </div>
    <div
      v-else
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-field :error="$v.value.addressRegion.$error">
          <q-select
            v-model="value.addressRegion"
            :float-label="addressRegionLabel"
            :options="regions"
            filter
            autofocus-filter
            class="q-pa-sm q-mt-md fast-open"
            @blur="$v.value.addressRegion.$touch"
            @keyup="$v.value.addressRegion.$touch" />
        </q-field>
      </div>
      <div class="col-sm-6">
        <q-field :error="$v.value.postalCode.$error">
          <q-input
            v-model="value.postalCode"
            :float-label="postalCodeLabel"
            class="q-pa-sm q-mt-md"
            autocomplete="postal-code"
            @blur="$v.value.postalCode.$touch"
            @keyup="$v.value.postalCode.$touch" />
        </q-field>
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
      const regions = country.children;
      return regions.map(region => ({label: region, value: region}));
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
      if(this.restrictCountry.length > 0) {
        return countryOptions.filter(
          ({value}) => this.restrictCountry.includes(value)
        );
      }
      return countryOptions.sort((a, b) => a.label.localeCompare(b.label));
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
