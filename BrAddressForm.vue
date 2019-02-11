<template>
  <div class="fit">
    <div class="q-mt-md">
      <q-field :error="$v.streetAddress.$error">
        <q-input
          v-model="streetAddress.value"
          :float-label="streetAddress.label"
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
            :float-label="addressLocality.label"
            class="q-pa-sm q-mt-md"
            @blur="$v.addressLocality.$touch"
            @keyup="$v.addressLocality.$touch" />
        </q-field>
      </div>
      <div class="col-sm-4">
        <q-field :error="$v.postalCode.$error">
          <q-input
            v-model="postalCode.value"
            :float-label="postalCode.label"
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
          :float-label="addressLocality.label"
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
            :float-label="addressRegion.label"
            class="q-pa-sm q-mt-md"
            @blur="$v.addressRegion.$touch"
            @keyup="$v.addressRegion.$touch" />
        </q-field>
      </div>
      <div class="col-sm-6">
        <q-field :error="$v.addressCountry.$error">
          <q-select
            v-model="addressCountry.value"
            :float-label="addressCountry.label"
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
            :float-label="addressRegion.label"
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
            :float-label="postalCode.label"
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
    addressLocality() {
      return this.value.addressLocality;
    },
    countries() {
      let countries = this.rawCountryCodes.map(val => ({
        label: val.country,
        value: val.alpha2Code
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
    postalCode() {
      return this.value.postalCode;
    },
    streetAddress() {
      return this.value.streetAddress;
    },
    valid() {
      return !this.$v.$invalid;
    }
  },
  created() {
    const updatedLabels = _applyDefaultLabels({
      data: this.value,
      labels: {
        addressCountry: 'Country',
        addressLocality: 'City',
        addressRegion: 'State/Province/Region',
        postalCode: 'ZIP/Postal Code',
        streetAddress: 'Street Address'
      }
    });
    this.$emit('input', updatedLabels);
  },
  methods: {
    isString(str) {
      return isString(str);
    }
  }
};
// TODO: Move to bedrock-web-forms
function isString(str) {
  return str && typeof str === 'string';
}

function _applyDefaultLabels({data, labels}) {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = isString(data[key].label) ? data[key] :
      {
        ...data[key],
        label: labels[key]
      };
    return acc;
  }, {});
}
</script>
<style>
</style>
