import { useEffect, useState } from "react";

export default function Home() {
    const [user, setUser]: [any, any] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-700">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold">Bem-vindo!</h2>
                {user ? (
                    <div className="mt-4">
                        <p className="text-lg">Nome: {user.name}</p>
                        <p className="text-lg">E-mail: {user.email}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Nenhum usuário encontrado.</p>
                )}
            </div>
        </div>
    );
}
