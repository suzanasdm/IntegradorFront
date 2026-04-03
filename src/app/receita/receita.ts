import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-receita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './receita.html',
  styleUrl: './receita.css',
})
export class Receita implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  usuarioId: number = 0;
  exibirInputCategoria = false;
  novaCategoriaNome = '';

  // Dados iniciais vazios para puxar do banco
  dadosForm = { descricao: '', valor: 0, data: '', categoriaId: '' };
  categorias: any[] = [];
  listaReceitas: any[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
      this.usuarioId = user.id;
      if (!this.usuarioId) this.router.navigate(['/login']);

      this.carregarCategorias();
      this.carregarReceitas();
    }
  }

  carregarCategorias() {
    this.http.get<any[]>(`http://localhost:8080/api/categorias/usuario/${this.usuarioId}`)
      .subscribe(res => this.categorias = res);
  }

  carregarReceitas() {
    this.http.get<any[]>(`http://localhost:8080/api/receitas/usuario/${this.usuarioId}`)
      .subscribe(res => this.listaReceitas = res);
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

  salvarReceita() {
    const payload = { ...this.dadosForm, usuarioId: this.usuarioId };
    this.http.post('http://localhost:8080/api/receitas', payload).subscribe(() => {
      this.carregarReceitas();
      this.dadosForm = { descricao: '', valor: 0, data: '', categoriaId: '' };
    });
  }
}