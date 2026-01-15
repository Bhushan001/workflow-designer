export interface ClientSettings {
  id?: string;
  clientCode?: string;
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPersonName?: string;
  websiteUrl?: string;
  industry?: string;
  companySize?: string;
  status?: string;
  timeZone?: string;
  locale?: string;
  maxUsers?: number;
  maxWorkflows?: number;
  billingContactEmail?: string;
  internalNotes?: string;
  createdOn?: string;
  updatedOn?: string;
}
