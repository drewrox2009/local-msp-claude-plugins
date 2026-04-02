/**
 * Main Syncro MSP Client
 */

import type { SyncroConfig, ResolvedConfig } from './config.js';
import { resolveConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { CustomersResource } from './resources/customers.js';
import { ContactsResource } from './resources/contacts.js';
import { TicketsResource } from './resources/tickets.js';
import { AssetsResource } from './resources/assets.js';
import { InvoicesResource } from './resources/invoices.js';
import { EstimatesResource } from './resources/estimates.js';
import { LineItemsResource } from './resources/line-items.js';
import { ContractsResource } from './resources/contracts.js';
import { AppointmentsResource } from './resources/appointments.js';
import { ProductsResource } from './resources/products.js';
import { PaymentsResource } from './resources/payments.js';
import { TicketTimersResource } from './resources/ticket-timers.js';
import { RmmAlertsResource } from './resources/rmm-alerts.js';
import { LeadsResource } from './resources/leads.js';
import { CannedResponsesResource } from './resources/canned-responses.js';
import { TicketProblemTypesResource } from './resources/ticket-problem-types.js';
import { WikiPagesResource } from './resources/wiki-pages.js';
import { SettingsResource } from './resources/settings.js';
import type { Me, MeResponse } from './types/settings.js';

/**
 * Syncro MSP API Client
 *
 * @example
 * ```typescript
 * const client = new SyncroClient({
 *   apiKey: 'your-api-key',
 *   subdomain: 'your-company',
 * });
 *
 * const customers = await client.customers.list();
 * ```
 */
export class SyncroClient {
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;
  private readonly httpClient: HttpClient;

  /** Customer operations */
  readonly customers: CustomersResource;
  /** Contact operations */
  readonly contacts: ContactsResource;
  /** Ticket operations */
  readonly tickets: TicketsResource;
  /** Asset operations */
  readonly assets: AssetsResource;
  /** Invoice operations */
  readonly invoices: InvoicesResource;
  /** Estimate operations */
  readonly estimates: EstimatesResource;
  /** Line item operations */
  readonly lineItems: LineItemsResource;
  /** Contract operations */
  readonly contracts: ContractsResource;
  /** Appointment operations */
  readonly appointments: AppointmentsResource;
  /** Product operations */
  readonly products: ProductsResource;
  /** Payment operations */
  readonly payments: PaymentsResource;
  /** Ticket timer operations */
  readonly ticketTimers: TicketTimersResource;
  /** RMM alert operations */
  readonly rmmAlerts: RmmAlertsResource;
  /** Lead operations */
  readonly leads: LeadsResource;
  /** Canned response operations */
  readonly cannedResponses: CannedResponsesResource;
  /** Ticket problem type operations */
  readonly ticketProblemTypes: TicketProblemTypesResource;
  /** Wiki page operations */
  readonly wikiPages: WikiPagesResource;
  /** Settings operations */
  readonly settings: SettingsResource;

  constructor(config: SyncroConfig) {
    this.config = resolveConfig(config);
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
    this.httpClient = new HttpClient(this.config, this.rateLimiter);

    // Initialize resources
    this.customers = new CustomersResource(this.httpClient, this.config);
    this.contacts = new ContactsResource(this.httpClient, this.config);
    this.tickets = new TicketsResource(this.httpClient, this.config);
    this.assets = new AssetsResource(this.httpClient, this.config);
    this.invoices = new InvoicesResource(this.httpClient, this.config);
    this.estimates = new EstimatesResource(this.httpClient, this.config);
    this.lineItems = new LineItemsResource(this.httpClient, this.config);
    this.contracts = new ContractsResource(this.httpClient, this.config);
    this.appointments = new AppointmentsResource(this.httpClient, this.config);
    this.products = new ProductsResource(this.httpClient, this.config);
    this.payments = new PaymentsResource(this.httpClient, this.config);
    this.ticketTimers = new TicketTimersResource(this.httpClient, this.config);
    this.rmmAlerts = new RmmAlertsResource(this.httpClient, this.config);
    this.leads = new LeadsResource(this.httpClient, this.config);
    this.cannedResponses = new CannedResponsesResource(this.httpClient, this.config);
    this.ticketProblemTypes = new TicketProblemTypesResource(this.httpClient, this.config);
    this.wikiPages = new WikiPagesResource(this.httpClient, this.config);
    this.settings = new SettingsResource(this.httpClient);
  }

  /**
   * Get the current authenticated user
   */
  async me(): Promise<Me> {
    const response = await this.httpClient.request<MeResponse>('/me');
    return response.user;
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<ResolvedConfig> {
    return this.config;
  }

  /**
   * Get remaining requests in the current rate limit window
   */
  getRemainingRequests(): number {
    return this.rateLimiter.getRemainingRequests();
  }

  /**
   * Get current request rate as a percentage of the limit
   */
  getCurrentRate(): number {
    return this.rateLimiter.getCurrentRate();
  }
}
