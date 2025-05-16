import { useEffect, useState } from "react";
import Image from "next/image";

interface User {
    id: number;
    name: string;
    email: string;
    image?: string;
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("userId");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser) {
                fetch(`/api/users/${parsedUser}`)
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

    const HeaderSkeleton = () => (
        <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-48 h-4 bg-gray-300 rounded mt-2"></div>
            </div>
        </div>
    );

    const PostsSkeleton = () => (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="mx-auto bg-white rounded shadow p-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full h-40 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 text-gray-700">
            <header className="bg-white shadow p-4">
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {user.image ? (
                                <Image
                                    src={`data:image/jpeg;base64,${user.image}`}
                                    alt="Foto do Usuário"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                            )}
                            <div>
                                <h1 className="text-lg font-semibold">{user.name}</h1>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </>
                    ) : (
                        <HeaderSkeleton />
                    )}
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </header>
            <main className="w-8/12 mx-auto p-4">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <PostsSkeleton />
            </main>
        </div>
    );
}
