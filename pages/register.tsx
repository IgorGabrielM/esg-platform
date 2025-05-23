import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (file) {
            formData.append("image", file);
        }

        const response = await fetch("/api/registerWithImage", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            setMessage("Usuário cadastrado com sucesso!");
            const createdUser = await response.json();
            localStorage.setItem("userId", JSON.stringify(createdUser.id));
            router.push("/home");
        } else {
            const errorData = await response.json();
            setMessage(`Erro: ${errorData.error}`);
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-700">
                <div className="w-full max-w-md rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-semibold">Cadastrar Usuário</h2>
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="mt-4 space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFile(e.target.files ? e.target.files[0] : null)
                            }
                            className="w-full p-2 border border-slate-200 rounded-lg"
                        />
                        <button
                            type="submit"
                            className="w-full bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-800"
                        >
                            Cadastrar
                        </button>
                    </form>
                    {message && <p className="mt-4">{message}</p>}
                </div>
            </div>
            <div className="flex-1 hidden md:flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Natureza"
                    className="object-cover w-full h-screen"
                />
            </div>
        </div>
    );
}
