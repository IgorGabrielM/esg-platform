import { useEffect, useState } from "react";

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("userId");
        if (storedUser) {
            if (storedUser) {
                fetch(`/api/users/${storedUser}`)
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error("Erro ao buscar usuário");
                        }
                        return res.json();
                    })
                    .then((data) => setUser(data))
                    .catch((err) => {
                        console.error("Erro:", err);
                        setError("Erro ao buscar usuário");
                    });
            }
        } else {
            setError("Nenhum usuário salvo no localStorage.");
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-700">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold">Bem-vindo!</h2>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {user ? (
                    <div className="mt-4">
                        <p className="text-lg">Nome: {user.name}</p>
                        <p className="text-lg">E-mail: {user.email}</p>
                    </div>
                ) : (
                    !error && <p className="text-gray-500 mt-2">Carregando usuário...</p>
                )}
            </div>
        </div>
    );
}
