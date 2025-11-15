<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-8">
      <!-- Header sencillo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🏠 Property Management
        </h1>
        <p class="text-lg text-gray-600">
          Manage your properties efficiently
        </p>
      </div>

      <!-- Estadísticas sencillas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
          <div class="text-3xl mb-2">🏢</div>
          <div class="text-2xl font-bold text-gray-800">{{ properties.length }}</div>
          <div class="text-gray-600 text-sm">Total Properties</div>
        </div>
        <div class="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
          <div class="text-3xl mb-2">👥</div>
          <div class="text-2xl font-bold text-gray-800">{{ users.length }}</div>
          <div class="text-gray-600 text-sm">Property Owners</div>
        </div>
        <div class="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
          <div class="text-3xl mb-2">🏷️</div>
          <div class="text-2xl font-bold text-gray-800">{{ propertyTypes.length }}</div>
          <div class="text-gray-600 text-sm">Property Types</div>
        </div>
      </div>

      <!-- Componente de tabla -->
      <PropertyTable
        :users="users"
        :propertyTypes="propertyTypes"
        :properties="properties"
      />
    </div>
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
