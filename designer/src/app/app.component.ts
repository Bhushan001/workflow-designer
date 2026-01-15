import { Component, OnInit, inject } from '@angular/core';
import { ShellComponent } from './modules/shared_module/layout/shell/shell.component';
import { PasswordPolicyService } from './modules/shared_module/services/password-policy.service';

@Component({
  selector: 'app-root',
  imports: [ShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Workflow Designer';
  private passwordPolicyService = inject(PasswordPolicyService);

  ngOnInit(): void {
    // Load password policy when app starts
    this.passwordPolicyService.loadPasswordPolicy().subscribe({
      next: () => {
        console.log('Password policy loaded');
      },
      error: (err) => {
        console.error('Failed to load password policy:', err);
      }
    });
  }
}
