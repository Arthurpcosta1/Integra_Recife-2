import React, { useState, useEffect } from 'react';
import { Users, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  tipo: 'admin' | 'cidadao';
  dataCriacao: string;
}

interface UserManagementProps {
  accessToken: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ accessToken }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2afcbce1/usuarios`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.sucesso) {
        setUsuarios(data.usuarios);
      } else {
        console.error('Erro ao carregar usuários:', data.erro);
        alert('Erro ao carregar usuários: ' + (data.erro || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  const excluirUsuario = async (usuarioId: string, nomeUsuario: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${nomeUsuario}"?\n\nEsta ação não pode ser desfeita e todos os dados do usuário serão permanentemente removidos.`)) {
      return;
    }

    try {
      setExcluindo(usuarioId);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2afcbce1/usuarios/${usuarioId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.sucesso) {
        alert('Usuário excluído com sucesso!');
        carregarUsuarios();
      } else {
        console.error('Erro ao excluir usuário:', data.erro);
        alert('Erro ao excluir usuário: ' + (data.erro || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setExcluindo(null);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <div>
          <h2 className="management-title">
            <Users size={24} />
            Gerenciamento de Usuários
          </h2>
          <p className="management-subtitle">
            Visualize e gerencie todos os usuários cadastrados na plataforma
          </p>
        </div>
        <button 
          className="refresh-btn"
          onClick={carregarUsuarios}
          disabled={carregando}
        >
          <RefreshCw size={18} className={carregando ? 'spinning' : ''} />
          Atualizar
        </button>
      </div>

      {carregando ? (
        <div className="loading-message">
          <RefreshCw size={32} className="spinning" />
          <p>Carregando usuários...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="empty-message">
          Nenhum usuário cadastrado ainda.
        </div>
      ) : (
        <>
          <div className="users-stats">
            <div className="stat-item">
              <span className="stat-label">Total de usuários:</span>
              <span className="stat-value">{usuarios.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Administradores:</span>
              <span className="stat-value">{usuarios.filter(u => u.tipo === 'admin').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cidadãos:</span>
              <span className="stat-value">{usuarios.filter(u => u.tipo === 'cidadao').length}</span>
            </div>
          </div>

          <div className="alert-warning">
            <AlertTriangle size={20} />
            <div>
              <strong>Atenção:</strong> A exclusão de um usuário é permanente e irá remover todos os seus dados, incluindo avaliações e comentários.
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Tipo</th>
                  <th>Data de Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`tipo-badge ${usuario.tipo}`}>
                        {usuario.tipo === 'admin' ? 'Administrador' : 'Cidadão'}
                      </span>
                    </td>
                    <td>{formatarData(usuario.dataCriacao)}</td>
                    <td>
                      <button
                        className="delete-user-btn"
                        onClick={() => excluirUsuario(usuario.id, usuario.nome)}
                        disabled={excluindo === usuario.id}
                      >
                        {excluindo === usuario.id ? (
                          <>
                            <RefreshCw size={16} className="spinning" />
                            Excluindo...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            Excluir
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
