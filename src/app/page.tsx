"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  cidade: string;
};

export default function Home() {
  // 🔹 Estados principais
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [editando, setEditando] = useState<number | null>(null);

  // 🔹 Carregar usuários salvos ao iniciar
  useEffect(() => {
    const salvos = localStorage.getItem("usuarios");
    if (salvos) setUsuarios(JSON.parse(salvos));
  }, []);

  // 🔹 Atualiza localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // 🔹 Adicionar ou editar usuário
  const salvarUsuario = () => {
    if (!nome || !email || !cidade) return alert("Preencha todos os campos!");

    if (editando !== null) {
      // Se estiver editando
      const atualizados = usuarios.map((u) =>
        u.id === editando ? { ...u, nome, email, cidade } : u
      );
      setUsuarios(atualizados);
      setEditando(null);
    } else {
      // Se for novo usuário
      const novo: Usuario = {
        id: Date.now(),
        nome,
        email,
        cidade,
      };
      setUsuarios([...usuarios, novo]);
    }

    // Limpar campos após salvar
    setNome("");
    setEmail("");
    setCidade("");
  };

  // 🔹 Deletar usuário
  const deletarUsuario = (id: number) => {
    if (confirm("Deseja realmente excluir?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  // 🔹 Preencher os campos para edição
  const editarUsuario = (usuario: Usuario) => {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setCidade(usuario.cidade);
    setEditando(usuario.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 flex flex-col items-center py-10 text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserPlus className="w-6 h-6" /> Cadastro de Usuários
      </h1>

      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-md w-80 sm:w-[450px] mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 rounded-md text-black mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-md text-black mb-3"
        />
        <input
          type="text"
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="w-full p-2 rounded-md text-black mb-3"
        />
        <button
          onClick={salvarUsuario}
          className="bg-green-500 hover:bg-green-600 w-full py-2 rounded-md font-semibold transition-transform hover:scale-105"
        >
          {editando ? "Salvar alterações" : "Adicionar usuário"}
        </button>
      </div>

      <div className="w-80 sm:w-[450px] bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg">
        {usuarios.length === 0 ? (
          <p className="text-center text-sm opacity-80">
            Nenhum usuário cadastrado ainda.
          </p>
        ) : (
          usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="flex justify-between items-center bg-white/10 p-3 rounded-lg mb-3"
            >
              <div>
                <p className="font-bold">{usuario.nome}</p>
                <p className="text-sm">{usuario.email}</p>
                <p className="text-sm opacity-80">{usuario.cidade}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => editarUsuario(usuario)}
                  className="hover:text-yellow-300 transition"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deletarUsuario(usuario.id)}
                  className="hover:text-red-400 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
