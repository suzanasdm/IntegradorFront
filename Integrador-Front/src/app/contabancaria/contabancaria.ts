import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Definição do Enum conforme seu código
export enum BancoEnum {
    ITAU = 'ITAU',
    NUBANK = 'NUBANK'
}

@Component({
  selector: 'app-contabancaria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contabancaria.html',
  styleUrl: './contabancaria.css',
})
export class Contabancaria implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  usuarioId: number = 0;

  // Objeto seguindo exatamente a interface ContaBancaria
  dadosForm = {
    banco: '' as BancoEnum, // Cast inicial para o Enum
    agencia: '',
    numeroConta: '',
    saldo: 0, // Nome corrigido de saldoInicial para saldo conforme sua interface
    usuarioId: 0
  };

  // Mapeamento para o Select exibir nomes amigáveis
  opcoesBancos = [
    { label: 'Itaú', value: BancoEnum.ITAU },
    { label: 'Nubank', value: BancoEnum.NUBANK }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
      this.usuarioId = user.id;
      
      if (!this.usuarioId) {
        this.router.navigate(['/login']);
      } else {
        this.dadosForm.usuarioId = this.usuarioId;
      }
    }
  }

  cadastrar(): void {
    // Como o objeto já está no formato da interface, enviamos diretamente
    this.http.post('http://localhost:8080/api/contas', this.dadosForm).subscribe({
      next: () => {
        alert('Conta cadastrada com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Erro ao salvar conta:', err)
    });
  }
}