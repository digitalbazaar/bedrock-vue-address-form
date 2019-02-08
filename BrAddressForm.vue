<template>
  <div class="fit">
    <div class="q-mt-md">
      <q-field :error="$v.streetAddress.$error">
        <q-input
          v-model="streetAddress.value"
          :float-label="streetAddressLabel"
          class="q-pa-sm q-mt-md"
          @blur="$v.streetAddress.$touch"
          @keyup="$v.streetAddress.$touch" />
      </q-field>
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-8 q-pr-md">
        <q-field :error="$v.addressLocality.$error">
          <q-input
            v-model="addressLocality.value"
            :float-label="addressLocalityLabel"
            class="q-pa-sm q-mt-md"
            @blur="$v.addressLocality.$touch"
            @keyup="$v.addressLocality.$touch" />
        </q-field>
      </div>
      <div class="col-sm-4">
        <q-field :error="$v.postalCode.$error">
          <q-input
            v-model="postalCode.value"
            :float-label="postalCodeLabel"
            class="q-pa-sm q-mt-md"
            @blur="$v.postalCode.$touch"
            @keyup="$v.postalCode.$touch" />
        </q-field>
      </div>
    </div>
    <div
      v-else
      class="q-mt-md">
      <q-field :error="$v.addressLocality.$error">
        <q-input
          v-model="addressLocality.value"
          :float-label="addressLocalityLabel"
          class="q-pa-sm q-mt-md"
          @blur="$v.addressLocality.$touch"
          @keyup="$v.addressLocality.$touch" />
      </q-field>
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-field :error="$v.addressRegion.$error">
          <q-input
            v-model="addressRegion.value"
            :float-label="addressRegionLabel"
            class="q-pa-sm q-mt-md"
            @blur="$v.addressRegion.$touch"
            @keyup="$v.addressRegion.$touch" />
        </q-field>
      </div>
      <div class="col-sm-6">
        <q-field :error="$v.addressCountry.$error">
          <q-select
            v-model="addressCountry.value"
            :float-label="addressCountryLabel"
            :options="countries"
            filter
            class="q-pa-sm q-mt-md"
            @blur="$v.addressCountry.$touch"
            @keyup="$v.addressCountry.$touch" />
        </q-field>
      </div>
    </div>
    <div
      v-else
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-field :error="$v.addressRegion.$error">
          <q-select
            v-model="addressRegion.value"
            :float-label="addressRegionLabel"
            :options="states"
            filter
            class="q-pa-sm q-mt-md"
            @blur="$v.addressRegion.$touch"
            @keyup="$v.addressRegion.$touch" />
        </q-field>
      </div>
      <div class="col-sm-6">
        <q-field :error="$v.postalCode.$error">
          <q-input
            v-model="postalCode.value"
            :float-label="postalCodeLabel"
            class="q-pa-sm q-mt-md"
            @blur="$v.postalCode.$touch"
            @keyup="$v.postalCode.$touch" />
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
import rawCountryCodes from './countryCodes';
import states from './states';

export default {
  name: 'BrAddressForm',
  props: {
    value: {
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
      rawCountryCodes,
      submitted: false,
      states
    };
  },
  validations() {
    if(this.addressCountryExists) {
      return {
        addressCountry: {
          value: {
            minLength: minLength(1),
            required
          }
        },
        addressLocality: {
          value: {
            minLength: minLength(1),
            required
          }
        },
        addressRegion: {
          value: {
            minLength: minLength(1),
            required
          }
        },
        postalCode: {
          value: {
            minLength: minLength(1),
            required
          }
        },
        streetAddress: {
          value: {
            minLength: minLength(1),
            required
          }
        }
      };
    }
    return {
      addressLocality: {
        value: {
          minLength: minLength(1),
          required
        }
      },
      addressRegion: {
        value: {
          minLength: minLength(1),
          required
        }
      },
      postalCode: {
        value: {
          minLength: minLength(1),
          required
        }
      },
      streetAddress: {
        value: {
          minLength: minLength(1),
          required
        }
      }
    };
  },
  computed: {
    addressCountry() {
      return this.value.addressCountry || {};
    },
    addressCountryExists() {
      return this.isString(this.addressCountry.value);
    },
    addressCountryLabel() {
      return (this.value.addressCountry || {}).label || 'Country';
    },
    addressLocality() {
      return this.value.addressLocality;
    },
    addressLocalityLabel() {
      return this.value.addressLocality.label || 'City';
    },
    countries() {
      let countries = this.rawCountryCodes.map(val => ({
        label: val.country,
        value: val.alpha3Code
      }));
      if(this.restrictCountry.length > 0) {
        countries = countries.filter(
          ({value}) => this.restrictCountry.includes(value)
        );
      }
      return countries;
    },
    addressRegion() {
      return this.value.addressRegion;
    },
    addressRegionLabel() {
      return this.value.addressRegion.label || 'State/Province/Region';
    },
    postalCode() {
      return this.value.postalCode;
    },
    postalCodeLabel() {
      return this.value.postalCode.label || 'ZIP/Postal Code';
    },
    streetAddress() {
      return this.value.streetAddress;
    },
    streetAddressLabel() {
      return this.value.streetAddress.label || 'Street Address';
    },
    valid() {
      return !this.$v.$invalid;
    }
  },
  methods: {
    isString(str) {
      return typeof str === 'string';
    }
  }
};
</script>
<style>
</style>
