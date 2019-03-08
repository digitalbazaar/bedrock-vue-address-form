<template>
  <q-page
    class="column gutter-md background"
    padding>
    <q-list class="column items-center">
      <q-item>
        Restrict Countries to USA and Canada
      </q-item>
      <q-item class="full-width">
        <br-address-form
          v-model="restrictCountries.model"
          :fields="restrictCountries.fields"
          :restrict-country="['US', 'CA']" />
      </q-item>
      <q-item-separator />
      <q-item>
        All Countries
      </q-item>
      <q-item class="full-width">
        <br-address-form
          v-model="allCountries.model"
          :fields="allCountries.fields" />
      </q-item>
    </q-list>
  </q-page>
</template>
<script>
/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {BrAddressForm} from 'bedrock-vue-address-form';

export default {
  name: 'Home',
  components: {BrAddressForm},
  data() {
    return {
      restrictCountries: {
        model: {
          addressCountry: '',
          addressLocality: '',
          addressRegion: '',
          postalCode: '',
          streetAddress: ''
        },
        fields: {}
      },
      allCountries: {
        model: {
          addressCountry: '',
          addressLocality: '',
          addressRegion: '',
          postalCode: '',
          streetAddress: ''
        },
        fields: {
          addressCountry: {
            label: 'Country'
          },
          addressLocality: {
            label: 'City'
          },
          addressRegion: {
            label: 'Region'
          },
          postalCode: {
            label: 'Postal Code'
          },
          streetAddress: {
            label: 'Street'
          }
        }
      }
    };
  }
};
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
