import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ClientService, Client } from '@platform/services/client.service';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedClientService {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  private selectedClientSubject = new BehaviorSubject<Client | null>(null);
  public selectedClient$ = this.selectedClientSubject.asObservable();
  public selectedClient = signal<Client | null>(null);

  /**
   * Load and set selected client based on logged-in user's clientId
   */
  loadSelectedClient(): Observable<Client | null> {
    const user = this.authService.getCurrentUser();
    
    if (!user || !user.clientId) {
      this.selectedClientSubject.next(null);
      this.selectedClient.set(null);
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    // If client is already loaded and matches, return cached value
    const currentClient = this.selectedClientSubject.value;
    if (currentClient && currentClient.id === user.clientId) {
      return new Observable(observer => {
        observer.next(currentClient);
        observer.complete();
      });
    }

    // Fetch client details
    return this.clientService.getClientById(user.clientId).pipe(
      tap(response => {
        if (response.body) {
          this.setSelectedClient(response.body);
        } else {
          this.selectedClientSubject.next(null);
          this.selectedClient.set(null);
        }
      }),
      catchError(error => {
        console.error('Error loading client details:', error);
        this.toastService.showToast('warning', 'Warning', 'Could not load client details.');
        this.selectedClientSubject.next(null);
        this.selectedClient.set(null);
        return of(null);
      }),
      map(response => response?.body || null)
    );
  }

  /**
   * Set selected client
   */
  setSelectedClient(client: Client): void {
    this.selectedClientSubject.next(client);
    this.selectedClient.set(client);
  }

  /**
   * Get current selected client (synchronous)
   */
  getSelectedClient(): Client | null {
    return this.selectedClientSubject.value;
  }

  /**
   * Clear selected client
   */
  clearSelectedClient(): void {
    this.selectedClientSubject.next(null);
    this.selectedClient.set(null);
  }
}
