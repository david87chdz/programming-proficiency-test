import { shallowMount, createLocalVue } from '@vue/test-utils';
import PropertyTable from '@/components/PropertyTable.vue';
import { users, propertyTypes, properties } from '@/mocks/api';

Object.defineProperty(window, 'location', {
  value: {
    search: '',
    pathname: '/test'
  },
  writable: true
});

Object.defineProperty(window, 'history', {
  value: {
    replaceState: jest.fn()
  }
});

describe('PropertyTable.vue', () => {
  let wrapper;

  const createWrapper = (dataOverrides = {}) => {
    return shallowMount(PropertyTable, {
      data() {
        return {
          users,
          propertyTypes,
          properties,
          filterUser: '',
          filterType: '',
          filterDateFrom: '',
          filterDateTo: '',
          ...dataOverrides
        };
      }
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  describe('Basic Rendering', () => {
    it('should render correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h2').text()).toContain('Properties Dashboard');
    });

    it('should show all properties by default', () => {
      expect(wrapper.vm.filteredProperties).toHaveLength(properties.length);
    });

    it('should show correct property count', () => {
      const badge = wrapper.find('[data-testid="property-count"]');
      expect(wrapper.vm.filteredProperties.length).toBe(properties.length);
    });
  });

  describe('User Filtering', () => {
    it('should filter by user correctly', async () => {
      await wrapper.setData({ filterUser: '1' });
      expect(wrapper.vm.filteredProperties).toHaveLength(4); // User 1 has 4 properties
      expect(wrapper.vm.filteredProperties.every(p => p.userId === 1)).toBe(true);
    });

    it('should show all properties when user filter is cleared', async () => {
      await wrapper.setData({ filterUser: '1' });
      await wrapper.setData({ filterUser: '' });
      expect(wrapper.vm.filteredProperties).toHaveLength(properties.length);
    });
  });

  describe('Type Filtering', () => {
    it('should filter by type correctly', async () => {
      await wrapper.setData({ filterType: '1' }); // home
      expect(wrapper.vm.filteredProperties).toHaveLength(2); // Home type has 2 properties
      expect(wrapper.vm.filteredProperties.every(p => p.typeId === 1)).toBe(true);
    });

    it('should filter by garage correctly', async () => {
      await wrapper.setData({ filterType: '2' }); // garage
      expect(wrapper.vm.filteredProperties).toHaveLength(2); // Garage type has 2 properties
      expect(wrapper.vm.filteredProperties.every(p => p.typeId === 2)).toBe(true);
    });

    it('should filter by office correctly', async () => {
      await wrapper.setData({ filterType: '3' }); // office
      expect(wrapper.vm.filteredProperties).toHaveLength(3); // Office type has 3 properties
      expect(wrapper.vm.filteredProperties.every(p => p.typeId === 3)).toBe(true);
    });
  });

  describe('Date Filtering', () => {
    describe('From Date Filter', () => {
      it('should filter properties from specific date', async () => {
        await wrapper.setData({ filterDateFrom: '2021-01-01' });
        const filtered = wrapper.vm.filteredProperties;
        expect(filtered).toHaveLength(2); // Parking Gran Via and Office Puente Segovia are from 2021
        expect(filtered.every(p => new Date(p.rentedFrom).getFullYear() >= 2021)).toBe(true);
      });

      it('should exclude properties with null dates when from filter is active', async () => {
        await wrapper.setData({ filterDateFrom: '2019-01-01' });
        const filtered = wrapper.vm.filteredProperties;
        // Should not include properties with rentedFrom: null
        expect(filtered.some(p => !p.rentedFrom)).toBe(false);
        expect(filtered).toHaveLength(5); // Only the 5 that have dates
      });

      it('should show 0 results for future dates', async () => {
        await wrapper.setData({ filterDateFrom: '2030-01-01' });
        expect(wrapper.vm.filteredProperties).toHaveLength(0);
      });
    });

    describe('To Date Filter', () => {
      it('should filter properties until specific date', async () => {
        await wrapper.setData({ filterDateTo: '2020-12-31' });
        const filtered = wrapper.vm.filteredProperties;
        expect(filtered).toHaveLength(3); // Penthouse, Parking Nuevos Ministerios, Office Ibiza are from 2020
        expect(filtered.every(p => new Date(p.rentedFrom).getFullYear() <= 2020)).toBe(true);
      });

      it('should show 0 results for very old dates', async () => {
        await wrapper.setData({ filterDateTo: '2000-01-01' });
        expect(wrapper.vm.filteredProperties).toHaveLength(0);
      });
    });

    describe('Date Range Filter', () => {
      it('should filter by date range correctly', async () => {
        await wrapper.setData({ 
          filterDateFrom: '2020-01-01',
          filterDateTo: '2020-12-31'
        });
        const filtered = wrapper.vm.filteredProperties;
        expect(filtered).toHaveLength(3); // Penthouse, Parking Nuevos Ministerios, Office Ibiza from 2020
        expect(filtered.every(p => {
          const year = new Date(p.rentedFrom).getFullYear();
          return year === 2020;
        })).toBe(true);
      });

      it('should handle ranges with no results', async () => {
        await wrapper.setData({ 
          filterDateFrom: '2025-01-01',
          filterDateTo: '2025-12-31'
        });
        expect(wrapper.vm.filteredProperties).toHaveLength(0);
      });
    });
  });

  describe('Combined Filters', () => {
    it('should apply multiple filters correctly', async () => {
      await wrapper.setData({ 
        filterUser: '1',
        filterType: '3', // User 1 + Office
        filterDateFrom: '2020-01-01'
      });
      const filtered = wrapper.vm.filteredProperties;
      expect(filtered).toHaveLength(1); // Only "Office - Ibiza Metro" meets all criteria
      expect(filtered[0].name).toBe('Office - Ibiza Metro');
    });

    it('should reset all filters', async () => {
      await wrapper.setData({ 
        filterUser: '1',
        filterType: '2',
        filterDateFrom: '2020-01-01',
        filterDateTo: '2021-01-01'
      });
      
      wrapper.vm.resetFilters();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.filterUser).toBe('');
      expect(wrapper.vm.filterType).toBe('');
      expect(wrapper.vm.filterDateFrom).toBe('');
      expect(wrapper.vm.filterDateTo).toBe('');
      expect(wrapper.vm.filteredProperties).toHaveLength(properties.length);
    });
  });

  describe('Helper Methods', () => {
    describe('matchesDateFilter Method', () => {
      it('should return false for properties without dates', () => {
        const propertyWithoutDates = { rentedFrom: null, rentedTo: null };
        wrapper.setData({ filterDateFrom: '2020-01-01' });
        expect(wrapper.vm.matchesDateFilter(propertyWithoutDates)).toBe(false);
      });

      it('should return true for properties that meet the from filter', () => {
        const property = { rentedFrom: new Date(2020, 5, 15), rentedTo: null };
        wrapper.setData({ filterDateFrom: '2020-01-01' });
        expect(wrapper.vm.matchesDateFilter(property)).toBe(true);
      });

      it('should return false for properties that do not meet the from filter', () => {
        const property = { rentedFrom: new Date(2019, 5, 15), rentedTo: null };
        wrapper.setData({ filterDateFrom: '2020-01-01' });
        expect(wrapper.vm.matchesDateFilter(property)).toBe(false);
      });

      it('should return true for properties that meet the to filter', () => {
        const property = { rentedFrom: new Date(2020, 5, 15), rentedTo: null };
        wrapper.setData({ filterDateTo: '2020-12-31' });
        expect(wrapper.vm.matchesDateFilter(property)).toBe(true);
      });

      it('should return false for properties that do not meet the to filter', () => {
        const property = { rentedFrom: new Date(2021, 5, 15), rentedTo: null };
        wrapper.setData({ filterDateTo: '2020-12-31' });
        expect(wrapper.vm.matchesDateFilter(property)).toBe(false);
      });
    });
  });

  describe('Property Counters', () => {
    it('should calculate rented properties correctly', () => {
      const rentedCount = wrapper.vm.rentedPropertiesCount;
      expect(typeof rentedCount).toBe('number');
      expect(rentedCount >= 0).toBe(true);
    });

    it('should calculate available properties correctly', () => {
      const availableCount = wrapper.vm.availablePropertiesCount;
      expect(typeof availableCount).toBe('number');
      expect(availableCount >= 0).toBe(true);
    });

    it('sum of rented + available should equal total filtered', () => {
      const total = wrapper.vm.filteredProperties.length;
      const rented = wrapper.vm.rentedPropertiesCount;
      const available = wrapper.vm.availablePropertiesCount;
      expect(rented + available).toBe(total);
    });
  });

  describe('Helper Methods', () => {
    it('should get username correctly', () => {
      expect(wrapper.vm.getUserName(1)).toBe('Asur Bernardo');
      expect(wrapper.vm.getUserName(999)).toBe('Unknown');
    });

    it('should get type name correctly', () => {
      expect(wrapper.vm.getTypeName(1)).toBe('Home');
      expect(wrapper.vm.getTypeName(999)).toBe('Unknown');
    });

    it('should calculate rental months correctly', () => {
      const property = {
        rentedFrom: new Date(2020, 0, 1), 
        rentedTo: new Date(2020, 2, 1)
      };
      expect(wrapper.vm.rentedMonths(property)).toBeGreaterThanOrEqual(1);
    });
  });

  describe('URL Functionality (Optional)', () => {
    it('should read parameters from URL on mount', () => {
      // Mock URLSearchParams
      window.location.search = '?user=1&type=2';
      
      const wrapper2 = createWrapper();
      wrapper2.vm.loadFiltersFromURL();
      
      expect(wrapper2.vm.filterUser).toBe('1');
      expect(wrapper2.vm.filterType).toBe('2');
    });

    it('should update URL when filters change', () => {
      const spy = jest.spyOn(window.history, 'replaceState');
      wrapper.vm.updateURL();
      expect(spy).toHaveBeenCalled();
    });
  });
});