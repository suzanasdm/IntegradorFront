import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Receita } from './receita/receita';
import { Despesa } from './despesa/despesa';
import { UsuarioComponent } from './usuario/usuario';

export const routes: Routes = [
    {path: '', redirectTo: 'receitas', pathMatch: 'full'},
  /*   {path: 'login', component: Login }, */
    {path: 'dashboard', component: Dashboard },
    {path: 'receitas',component: Receita},
    {path: 'despesas', component: Despesa},
    {path: 'usuario', component: UsuarioComponent}
];
