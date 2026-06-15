import React, { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onRegister: (username: string) => void;
  onClose?: () => void;
};

export default function RegisterModal({ open, onRegister, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (password.length < 4) return setError("Пароль должен быть не менее 4 символов");
    if (password !== confirm) return setError("Пароли не совпадают");

    try {
      const raw = localStorage.getItem("spravka_users");
      const users = raw ? JSON.parse(raw) as Array<{ username: string; password: string }> : [];
      if (users.find(u => u.username === name)) {
        return setError("Пользователь с таким именем уже существует");
      }
      users.push({ username: name, password });
      localStorage.setItem("spravka_users", JSON.stringify(users));
      onRegister(name);
      setUsername("");
      setPassword("");
      setConfirm("");
      onClose && onClose();
    } catch (e) {
      console.error(e);
      setError("Ошибка регистрации");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold mb-3">Регистрация</h2>
        <p className="text-sm text-slate-500 mb-4">Создайте новый аккаунт.</p>
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

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Подтвердите пароль</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between gap-3">
            <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold">Зарегистрироваться</button>
            <button type="button" onClick={() => onClose && onClose()} className="text-sm text-slate-600">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}
