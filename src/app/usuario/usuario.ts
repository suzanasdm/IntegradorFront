import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../models/Usuario.model';
import { UsuarioService } from '../services/usuario.services';
@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class UsuarioComponent {
  novoUsuario: Usuario=  {

  nome: '',
  email: '',
  senha: '',


  };

}
