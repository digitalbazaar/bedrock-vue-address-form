<template>
  <q-page
    class="column gutter-md background"
    padding>
    <q-list class="column items-center">
      <q-item>
        All Countries
      </q-item>
      <q-item class="full-width">
        <br-address-form v-model="allCountries" />
      </q-item>
      <q-item-separator />
      <q-item>
        Restrict Countries to USA and Canada
      </q-item>
      <q-item class="full-width">
        <br-address-form
          v-model="restrictCountries"
          :restrict-country="['US', 'CA']" />
      </q-item>
      <q-item-separator />
      <q-item>
        USA Only
      </q-item>
      <q-item class="full-width">
        <br-address-form v-model="usaOnly" />
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
      usaOnly: {
        addressLocality: {
          value: ''
        },
        addressRegion: {
          label: 'State',
          value: ''
        },
        postalCode: {
          label: 'ZIP',
          value: ''
        },
        streetAddress: {
          value: ''
        }
      },
      restrictCountries: {
        addressCountry: {
          value: ''
        },
        addressLocality: {
          value: ''
        },
        addressRegion: {
          value: ''
        },
        postalCode: {
          value: ''
        },
        streetAddress: {
          value: ''
        }
      },
      allCountries: {
        addressCountry: {
          value: ''
        },
        addressLocality: {
          value: ''
        },
        addressRegion: {
          value: ''
        },
        postalCode: {
          value: ''
        },
        streetAddress: {
          value: ''
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
