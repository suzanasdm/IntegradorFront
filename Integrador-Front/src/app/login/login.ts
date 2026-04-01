import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    senha: ''
  };

  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    // Validação de campos vazios (Regra Geral do UCS)
    if (!this.loginData.email || !this.loginData.senha) {
      this.errorMessage = 'Campo Obrigatório!';
      return;
    }

    // Chamada ao Back-end (Ajuste a URL para o seu Controller de Usuário)
    this.http.post('http://localhost:8080/usuarios/login', this.loginData)
      .subscribe({
        next: (res: any) => {
          // Se o banco validar, salvamos o usuário na sessão
          localStorage.setItem('usuarioLogado', JSON.stringify(res));
          this.router.navigate(['/home']); // Vai para a tela principal
        },
        error: (err) => {
          // Caso o e-mail ou senha não existam no banco
          this.errorMessage = 'E-mail ou senha incorretos. Verifique seus dados.';
        }
      });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']); // Navega para a rota de cadastro (UC.002)
  }


}
