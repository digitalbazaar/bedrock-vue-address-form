<template>
  <div class="fit">
    <div class="q-mt-md">
      <q-field :error="$v.streetAddress.$error">
        <q-input
          v-model="streetAddress.value"
          :float-label="streetAddress.label"
          class="q-pa-sm q-mt-md"
          autocomplete="address-line1"
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
            autocomplete="address-level2"
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
            autocomplete="postal-code"
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
          autocomplete="address-level2"
          @blur="$v.addressLocality.$touch"
          @keyup="$v.addressLocality.$touch" />
      </q-field>
    </div>
    <div
      v-if="addressCountryExists"
      class="row justify-between q-mt-md">
      <div class="col-sm-6 q-pr-md">
        <q-field
          v-if="regions.length > 0"
          :error="$v.addressRegion.$error">
          <q-select
            v-model="addressRegion.value"
            :float-label="addressRegion.label"
            :options="regions"
            filter
            autofocus-filter
            class="q-pa-sm q-mt-md fast-open"
            @blur="$v.addressRegion.$touch"
            @keyup="$v.addressRegion.$touch" />
        </q-field>
        <q-field
          v-else
          :error="$v.addressRegion.$error">
          <q-input
            v-model="addressRegion.value"
            :float-label="addressRegion.label"
            class="q-pa-sm q-mt-md"
            autocomplete="address-level1"
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
            autofocus-filter
            class="q-pa-sm q-mt-md fast-open"
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
            :options="regions"
            filter
            autofocus-filter
            class="q-pa-sm q-mt-md fast-open"
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
            autocomplete="postal-code"
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
import countryOptions from './countries';

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
    regions() {
      if(!this.addressCountryExists) {
        return countryOptions
          .find(c => c.value === 'US')
          .children.map(region => ({label: region, value: region}));
      }
      const prefix = this.addressCountry.value;
      const country = countryOptions.find(c => c.value === prefix);
      if(!country) {
        return [];
      }
      const regions = country.children;
      return regions.map(region => ({label: region, value: region}));
    },
    addressCountry() {
      return this.value.addressCountry || {};
    },
    addressCountryExists() {
      return this.isString(this.addressCountry.value);
    },
    addressCountryValue() {
      return this.addressCountry.value;
    },
    addressLocality() {
      return this.value.addressLocality;
    },
    countries() {
      if(this.restrictCountry.length > 0) {
        return countryOptions.filter(
          ({value}) => this.restrictCountry.includes(value)
        );
      }
      return countryOptions.sort((a, b) => a.label.localeCompare(b.label));
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
  watch: {
    addressCountryValue(val) {
      let updatedLabels = this.value;
      if(val === 'US') {
        updatedLabels = _applyLabels({
          data: this.value,
          force: ['addressRegion', 'postalCode'],
          labels: {
            addressRegion: 'State',
            postalCode: 'ZIP'
          }
        });
      } else if(val === 'CA') {
        updatedLabels = _applyLabels({
          data: this.value,
          force: ['addressRegion', 'postalCode'],
          labels: {
            addressRegion: 'Province',
            postalCode: 'Postal Code'
          }
        });
      } else {
        updatedLabels = _applyLabels({
          data: this.value,
          force: ['addressRegion', 'postalCode'],
          labels: {
            addressRegion: 'State/Province/Region',
            postalCode: 'ZIP/Postal Code',
          }
        });
      }
      this.$emit('input', updatedLabels);
    }
  },
  created() {
    const updatedLabels = _applyLabels({
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

// TODO: Move to bedrock-web-forms
function _applyLabels({data, labels, force = []}) {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = isString(data[key].label) && !force.includes(key) ? data[key] :
      {
        ...data[key],
        label: labels[key]
      };
    return acc;
  }, {});
}
</script>
<style scoped>
div.fast-open {
  transition-duration: 0.10s;
}
</style>
