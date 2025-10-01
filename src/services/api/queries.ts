import apiClient from "./axios";
import { Activity, Invoice, InvoiceStats } from "../../types/type";
import { AxiosResponse } from "axios";

// Fetch all invoices
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const response: AxiosResponse<Invoice[]> = await apiClient.get("/invoices");
  return response.data;
};

export const fetchInvoiceById = async (id: string): Promise<Invoice> => {
  const response: AxiosResponse<Invoice> = await apiClient.get(
    `/invoices/${id}`
  );
  return response.data;
};

export const fetchActivities = async (): Promise<Activity[]> => {
  const response: AxiosResponse<Activity[]> = await apiClient.get(
    "/activities"
  );
  return response.data;
};

export const fetchInvoiceStats = async (): Promise<InvoiceStats> => {
  const response: AxiosResponse<InvoiceStats> = await apiClient.get(
    "/invoicestats"
  );

  return response.data;
};
