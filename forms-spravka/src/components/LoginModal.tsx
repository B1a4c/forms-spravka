import React, { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onLogin: (username: string) => void;
  onShowRegister?: () => void;
};

export default function LoginModal({ open, onLogin, onShowRegister }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(open);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVisible(open);
    setError(null);
  }, [open]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const name = username.trim();
    if (!name) return setError("Введите имя пользователя");
    // Проверяем сохраненных пользователей в localStorage
    try {
      const raw = localStorage.getItem("spravka_users");
      const users = raw ? JSON.parse(raw) as Array<{ username: string; password: string }> : [];
      const found = users.find(u => u.username === name && u.password === password);
      if (!found) {
        setError("Пользователь не найден или пароль неверен. Зарегистрируйтесь.");
        return;
      }
      onLogin(name);
      setPassword("");
    } catch (e) {
      console.error(e);
      setError("Ошибка авторизации");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold mb-3">Вход в приложение</h2>
        <p className="text-sm text-slate-500 mb-4">Пожалуйста, войдите под своим именем.</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Имя пользователя</label>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between gap-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Войти</button>
            <button type="button" onClick={() => onShowRegister && onShowRegister()} className="text-sm text-blue-600 underline">Регистрация</button>
          </div>
        </form>
      </div>
    </div>
  );
}
