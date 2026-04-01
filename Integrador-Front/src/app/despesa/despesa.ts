import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-despesa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './despesa.html',
  styleUrl: './despesa.css',
})
export class Despesa implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  usuarioId: number = 0;
  exibirInputCategoria = false;
  novaCategoriaNome = '';

  // Inicia vazio para coerência com o banco
  dadosForm = { descricao: '', valor: 0, data: '', categoriaId: '' };
  categorias: any[] = [];
  listaDespesas: any[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
      this.usuarioId = user.id;
      if (!this.usuarioId) this.router.navigate(['/login']);

      this.carregarCategorias();
      this.carregarDespesas();
    }
  }

  carregarCategorias() {
    // Busca categorias do usuário
    this.http.get<any[]>(`http://localhost:8080/api/categorias/usuario/${this.usuarioId}`)
      .subscribe(res => this.categorias = res);
  }

  carregarDespesas() {
    this.http.get<any[]>(`http://localhost:8080/api/despesas/usuario/${this.usuarioId}`)
      .subscribe(res => this.listaDespesas = res);
  }

  salvarCategoria() {
    if (!this.novaCategoriaNome) return;
    const payload = { nome: this.novaCategoriaNome, usuarioId: this.usuarioId };
    this.http.post('http://localhost:8080/api/categorias', payload).subscribe((res: any) => {
      this.categorias.push(res);
      this.dadosForm.categoriaId = res.id;
      this.novaCategoriaNome = '';
      this.exibirInputCategoria = false;
    });
  }

  salvarDespesa() {
    const payload = { ...this.dadosForm, usuarioId: this.usuarioId };
    this.http.post('http://localhost:8080/api/despesas', payload).subscribe({
      next: () => {
        this.carregarDespesas();
        this.dadosForm = { descricao: '', valor: 0, data: '', categoriaId: '' };
      },
      error: (err) => console.error('Erro ao salvar despesa', err)
    });
  }
}