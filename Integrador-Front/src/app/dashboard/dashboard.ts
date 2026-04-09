import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Propriedades para a Sidebar
  exibirSidebar: boolean = false;
  usuarioCompleto: any = {};
  contasBancarias: any[] = [];

  dadosDashboard: any = {
    saldoTotal: 0,
    receita: 0,
    despesa: 0,
    transacoes: []
  };

  usuarioNome: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuarioLogado');
      
      if (!userJson) {
        this.router.navigate(['/login']);
        return;
      }

      const user = JSON.parse(userJson);
      this.usuarioCompleto = user;
      this.usuarioNome = user.nome || 'Usuário';
      this.carregarDados(user.id);
      this.carregarContas(user.id); // Carrega as contas para exibir na sidebar
    }
  }

  // Função para abrir/fechar a sidebar
  toggleSidebar(): void {
    this.exibirSidebar = !this.exibirSidebar;
  }

  carregarContas(idUsuario: number) {
    this.http.get(`http://localhost:8080/api/contas/usuario/${idUsuario}`).subscribe({
      next: (res: any) => { this.contasBancarias = res; },
      error: (err) => console.error('Erro ao buscar contas', err)
    });
  }

  carregarDados(idUsuario: number) {
    this.http.get(`http://localhost:8080/api/dashboard/${idUsuario}`).subscribe({
      next: (res: any) => {
        this.dadosDashboard = res;
      },
      error: (err) => console.error('Erro ao conectar com o banco', err)
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogado');
      this.router.navigate(['/login']);
    }
  }
}