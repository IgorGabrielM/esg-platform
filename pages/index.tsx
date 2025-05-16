import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    const response = await fetch(`/api/users/${userId}`);
                    if (response.ok) {
                        router.push("/home");
                        return;
                    } else {
                        localStorage.removeItem("user");
                    }
                } catch (error) {
                    console.error("Erro ao verificar o usuário:", error);
                }
            }
            router.push("/register");
        };

        checkUser();
    }, [router]);

    return null;
}
