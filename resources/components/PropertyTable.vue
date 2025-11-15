<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
    <div class="bg-gradient-to-r from-slate-800 to-slate-600 px-6 py-5">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-white flex items-center">
          <span class="mr-3 text-2xl">🏠</span>
          Properties Dashboard
        </h2>
        <div class="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
          <span class="text-white font-medium">{{ filteredProperties.length }} Properties</span>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div class="mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">👤 Owner</label>
            <select
              v-model="filterUser"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition-colors">
              <option value="">All Owners</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">🏢 Type</label>
            <select
              v-model="filterType"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition-colors">
              <option value="">All Types</option>
              <option v-for="type in propertyTypes" :key="type.id" :value="type.id">
                {{ type.name.charAt(0).toUpperCase() + type.name.slice(1) }}
              </option>
            </select>
          </div>
          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">📅 From Date</label>
            <input
              v-model="filterDateFrom"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200 hover:border-gray-400 hover:shadow-md
                     cursor-pointer"
              placeholder="Select start date"
            />
          </div>

          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">📅 To Date</label>
            <input
              v-model="filterDateTo"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200 hover:border-gray-400 hover:shadow-md
                     cursor-pointer"
              placeholder="Select end date"
            />
          </div>
          <div class="flex-1 min-w-0">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium
                     rounded-lg shadow-sm transition-colors duration-200 text-sm">
              🔄 Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase
                         tracking-wider bg-gray-100">🏠 Property</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase
                         tracking-wider bg-gray-50">👤 Owner</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase
                         tracking-wider bg-gray-100">🏢 Type</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase
                         tracking-wider bg-gray-50">📅 Months</th>
                <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase
                         tracking-wider bg-gray-100">📊 Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="prop in filteredProperties"
                :key="prop.id"
                class="hover:opacity-75 transition-opacity duration-150">
                <td class="px-6 py-6 bg-gray-100">
                  <div class="font-medium text-gray-900">{{ prop.name }}</div>
                </td>
                <td class="px-6 py-6 bg-gray-50">
                  <span class="font-medium text-gray-700">
                    {{ getUserName(prop.userId) }}
                  </span>
                </td>
                <td class="px-6 py-6 bg-gray-100">
                  <span class="font-medium text-gray-700">
                    {{ getTypeName(prop.typeId) }}
                  </span>
                </td>
                <td class="px-6 py-6 text-center bg-gray-50">
                  <span class="font-medium text-gray-700">
                    {{ rentedMonths(prop) }}
                  </span>
                </td>
                <td class="px-6 py-6 text-center bg-gray-100">
                  <span
                    :class="[
                      'font-medium',
                      isCurrentlyRented(prop)
                        ? 'text-green-700'
                        : 'text-red-700'
                    ]">
                    {{ isCurrentlyRented(prop) ? '✅ Rented' : '❌ Available' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredProperties.length === 0"
             class="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300
                    rounded-lg mt-6">
          <div class="text-4xl mb-4">🔍</div>
          <p class="text-gray-600 text-lg font-medium mb-4">No properties found</p>
          <button @click="resetFilters"
                  class="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium
                         rounded-lg transition-colors">
            Clear filters
          </button>
        </div>
      </div>
    </div>
    <div class="px-6 pb-6">
      <div class="bg-gray-50 px-6 py-4 rounded-lg border border-gray-200">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-700 font-medium">
            Showing
            <span class="font-semibold text-slate-600">{{ filteredProperties.length }}</span>
            of <span class="font-semibold">{{ properties.length }}</span> properties
          </span>
          <div class="flex gap-6">
            <span class="flex items-center">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              <span class="font-medium text-emerald-700">{{ rentedPropertiesCount }} Rented</span>
            </span>
            <span class="flex items-center">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span class="font-medium text-red-700">{{ availablePropertiesCount }} Available</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { users, propertyTypes, properties } from '@/mocks/api';

export default {
  name: 'PropertyTable',
  data() {
    return {
      users,
      propertyTypes,
      properties,
      filterUser: '',
      filterType: '',
      filterDateFrom: '',
      filterDateTo: '',
    };
  },
  mounted() {
    this.loadFiltersFromURL();
  },
  watch: {
    filterUser() { this.updateURL(); },
    filterType() { this.updateURL(); },
    filterDateFrom() { this.updateURL(); },
    filterDateTo() { this.updateURL(); },
  },
  computed: {
    filteredProperties() {
      return this.properties.filter((property) => {
        if (this.filterUser && property.userId !== parseInt(this.filterUser, 10)) {
          return false;
        }

        if (this.filterType && property.typeId !== parseInt(this.filterType, 10)) {
          return false;
        }

        if (this.filterDateFrom || this.filterDateTo) {
          return this.matchesDateFilter(property);
        }

        return true;
      });
    },
    rentedPropertiesCount() {
      return this.filteredProperties.filter((prop) => this.isCurrentlyRented(prop)).length;
    },
    availablePropertiesCount() {
      return this.filteredProperties.filter((prop) => !this.isCurrentlyRented(prop)).length;
    },
  },
  methods:
  {
    matchesDateFilter(property) {
      const rentedFrom = property.rentedFrom ? new Date(property.rentedFrom) : null;

      if (!rentedFrom) { return false; }

      if (this.filterDateFrom) {
        const fromDate = new Date(this.filterDateFrom);
        if (rentedFrom < fromDate) {
          return false;
        }
      }

      if (this.filterDateTo) {
        const toDate = new Date(this.filterDateTo);
        if (rentedFrom > toDate) {
          return false;
        }
      }

      return true;
    },

    loadFiltersFromURL() {
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.get('user')) { this.filterUser = urlParams.get('user'); }

      if (urlParams.get('type')) { this.filterType = urlParams.get('type'); }

      if (urlParams.get('dateFrom')) { this.filterDateFrom = urlParams.get('dateFrom'); }

      if (urlParams.get('dateTo')) { this.filterDateTo = urlParams.get('dateTo'); }
    },
    updateURL() {
      const params = new URLSearchParams();

      if (this.filterUser) params.set('user', this.filterUser);
      if (this.filterType) params.set('type', this.filterType);
      if (this.filterDateFrom) params.set('dateFrom', this.filterDateFrom);
      if (this.filterDateTo) params.set('dateTo', this.filterDateTo);

      const newURL = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, '', newURL);
    },
    resetFilters() {
      this.filterUser = '';
      this.filterType = '';
      this.filterDateFrom = '';
      this.filterDateTo = '';
    },
    getUserName(id) {
      const user = this.users.find((u) => u.id === id);
      return user ? user.name : 'Unknown';
    },
    getTypeName(id) {
      const type = this.propertyTypes.find((t) => t.id === id);
      return type ? type.name.charAt(0).toUpperCase() + type.name.slice(1) : 'Unknown';
    },
    rentedMonths(prop) {
      if (!prop.rentedFrom) { return 0; }

      const end = prop.rentedTo ? new Date(prop.rentedTo) : new Date();
      const from = new Date(prop.rentedFrom);

      return Math.max(0, Math.floor((end - from) / (1000 * 60 * 60 * 24 * 30)));
    },
    isCurrentlyRented(prop) {
      if (!prop.rentedFrom) { return false; }

      const now = new Date();
      const rentedFrom = new Date(prop.rentedFrom);
      const rentedTo = prop.rentedTo ? new Date(prop.rentedTo) : null;

      return rentedFrom <= now && (!rentedTo || rentedTo > now);
    },
  },
};
</script>

<style scoped>
</style>
