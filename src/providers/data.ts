import { BACKEND_BASE_URL } from '@/const/const';
import { DataProvider } from '@refinedev/core';
import { ListResponse } from '@/types';

const customDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const params = new URLSearchParams();

    if (pagination) {
      params.append("pagination[currentPage]", String(pagination.currentPage ?? 1));
      params.append("pagination[pageSize]", String(pagination.pageSize ?? 10));
      params.append("pagination[mode]", pagination.mode ?? "server");
    }

    if (sorters) {
      sorters.forEach((sorter, i) => {
        params.append(`sorters[${i}][field]`, sorter.field);
        params.append(`sorters[${i}][order]`, sorter.order);
      });
    }

    if (filters) {
      filters.forEach((filter, i) => {
        if ("field" in filter) {
          params.append(`filters[${i}][field]`, filter.field);
          params.append(`filters[${i}][operator]`, filter.operator);
          params.append(`filters[${i}][value]`, String(filter.value));
        }
      });
    }

    const url = `${BACKEND_BASE_URL}${resource}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const payload: ListResponse = await res.json();

    return {
      data: (payload.data ?? []) as any[],
      total: payload.pagination?.total ?? payload.data?.length ?? 0,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${BACKEND_BASE_URL}${resource}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    const data = await res.json();
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${BACKEND_BASE_URL}${resource}/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    const data = await res.json();
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${BACKEND_BASE_URL}${resource}/${id}`;
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();
    return { data };
  },

  getOne: async ({ resource, id }) => {
    const url = `${BACKEND_BASE_URL}${resource}/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    return { data };
  },

  getApiUrl: () => BACKEND_BASE_URL,
};

export const dataProvider = customDataProvider;
