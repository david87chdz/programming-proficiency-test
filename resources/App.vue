<template>
  <div id="app">
    WORK HERE
    <h1>Property Management</h1>
    <PropertyTable
      :users="users"
      :propertyTypes="propertyTypes"
      :properties="properties"
    />
  </div>
</template>

<script>
import { users, propertyTypes, properties } from '@/mocks/api';
import PropertyTable from './components/PropertyTable.vue';

export default {
  name: 'App',
  components: {
    PropertyTable,
  },
  data: () => ({
    users,
    propertyTypes,
    properties,
  }),
};
</script>
