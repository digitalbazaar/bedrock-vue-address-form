<template>
  <q-page
    class="column gutter-md background"
    padding>
    <div class="column items-center">
      <br-address-form />
    </div>
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
    return {};
  }
};
</script>
<style>
</style>
