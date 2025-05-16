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
            // Opcionalmente, armazene os dados do usuário no localStorage
            const createdUser = await response.json();
            localStorage.setItem("userId", JSON.stringify(createdUser.id));
            router.push("/home");
        } else {
            const errorData = await response.json();
            setMessage(`Erro: ${errorData.error}`);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Cadastrar Usuário</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border rounded-lg"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Cadastrar
                    </button>
                </form>
                {message && <p className="mt-4">{message}</p>}
            </div>
        </div>
    );
}
