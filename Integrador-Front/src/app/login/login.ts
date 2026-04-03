import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  // Importante: ReactiveFormsModule não é necessário aqui pois você usa [(ngModel)] (Template Driven)
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  // Injeção de dependências moderna
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginData = {
    email: '',
    senha: ''
  };

  errorMessage: string = '';

  ngOnInit(): void {
    // Se o usuário já estiver logado, manda direto para o dashboard
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuarioLogado');
      if (userJson) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  onLogin() {
    // 1. Validação básica de campos
    if (!this.loginData.email || !this.loginData.senha) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    // 2. Chamada ao Back-end (URL ajustada para o padrão do seu projeto)
    this.http.post('http://localhost:8080/api/usuarios/login', this.loginData)
      .subscribe({
        next: (res: any) => {
          if (isPlatformBrowser(this.platformId)) {
            // Salva o objeto do usuário (ID, Nome, etc) vindo do Banco
            localStorage.setItem('usuarioLogado', JSON.stringify(res));
            
            // Navega para a rota correta definida no seu routes.ts
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Erro no login:', err);
          this.errorMessage = 'E-mail ou senha incorretos.';
        }
      });
  }

  // Método para o link "Cadastre-se aqui"
  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}