import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getSpotifyToken, getUserProfile } from "@/lib/spotify";
import { useRPGStore } from "@/lib/store";

export const Route = createFileRoute("/spotify-callback")({
	component: SpotifyCallback,
});

function SpotifyCallback() {
	const navigate = useNavigate();
	const setSpotifyAuth = useRPGStore((s) => s.setSpotifyAuth);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		const state = urlParams.get("state");
		const authError = urlParams.get("error");
		const storedState = window.localStorage.getItem("spotify_auth_state");

		if (authError) {
			console.error("Spotify recusou a autorização:", authError);
			void navigate({ to: "/dashboard" });
			return;
		}

		if (!code || state !== storedState) {
			console.error("Callback Spotify inválido ou origem diferente.", {
				hasCode: Boolean(code),
				hasState: Boolean(state),
				hasStoredState: Boolean(storedState),
			});
			void navigate({ to: "/dashboard" });
			return;
		}

		async function handleAuth() {
			try {
				const data = await getSpotifyToken(code!);
				const profile = await getUserProfile(data.access_token);

				setSpotifyAuth(data.access_token, {
					name: profile.display_name,
					email: profile.email,
					image: profile.images?.[0]?.url,
				});

				window.localStorage.removeItem("spotify_auth_state");
				window.localStorage.removeItem("spotify_code_verifier");
				void navigate({ to: "/dashboard" });
			} catch (error) {
				console.error("Erro no fluxo de auth Spotify:", error);
				void navigate({ to: "/dashboard" });
			}
		}
		void handleAuth();
	}, [navigate, setSpotifyAuth]);

	return (
		<div className="flex h-screen w-full items-center justify-center bg-background">
			<div className="flex flex-col items-center gap-4">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
				<p className="text-sm font-medium text-muted-foreground">
					Sincronizando com seu Grimório Musical...
				</p>
			</div>
		</div>
	);
}
