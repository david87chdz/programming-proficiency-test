<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Properties Table</h2>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div>
        <label class="block text-gray-700 font-semibold mb-1">User:</label>
        <select
          v-model="selectedUser"
          class="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-700 font-semibold mb-1">Property Type:</label>
        <select
          v-model="selectedType"
          class="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All</option>
          <option v-for="type in propertyTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>

      <button
        @click="resetFilters"
        class="mt-5 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
      >
        Reset Filters
      </button>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Months Rented</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Currently Rented</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="property in filteredProperties"
            :key="property.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm text-gray-800">{{ property.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ getUserName(property.userId) }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ getTypeName(property.typeId) }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ monthsRented(property) }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <span
                :class="isCurrentlyRented(property) ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
              >
                {{ isCurrentlyRented(property) ? 'Yes' : 'No' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredProperties.length === 0" class="p-4 text-center text-gray-500">
        No properties match the selected filters.
      </div>
    </div>
  </div>
</template>

<script>
import { properties } from '../mocks/api.js';
export default {
  name: 'PropertyTable',
  props: {
    users: { type: Array, required: true },
    propertyTypes: { type: Array, required: true },
    properties: { type: Array, required: true },
  },
  data() {
    return {
      selectedUser: '',
      selectedType: '',
    };
  },
  computed: {
    filteredProperties() {
      return this.properties.filter((p) => {
        const userMatch = this.selectedUser ? p.userId == this.selectedUser : true;
        const typeMatch = this.selectedType ? p.typeId == this.selectedType : true;
        return userMatch && typeMatch;
      });
    },
  },
  methods: {
    getUserName(userId) {
      const user = this.users.find((u) => u.id === userId);
      return user ? user.name : 'Unknown';
    },
    getTypeName(typeId) {
      const type = this.propertyTypes.find((t) => t.id === typeId);
      return type ? type.name : 'Unknown';
    },
    monthsRented(property) {
      if (!property.rentedFrom) return 0;
      const from = new Date(property.rentedFrom);
      const to = property.rentedTo ? new Date(property.rentedTo) : new Date();
      return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    },
    isCurrentlyRented(property) {
      const now = new Date();
      return property.rentedFrom && (!property.rentedTo || new Date(property.rentedTo) > now);
    },
    resetFilters() {
      this.selectedUser = '';
      this.selectedType = '';
    },
  },
};
</script>
