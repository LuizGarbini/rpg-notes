import type { Session, User } from "@supabase/supabase-js";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { getSupabase } from "./supabase";

interface AuthContextValue {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<string | null>;
	signUp: (
		name: string,
		email: string,
		password: string,
	) => Promise<string | null>;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Promise<string | null>;
	updatePassword: (password: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const supabase = getSupabase();
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!supabase) {
			setLoading(false);
			return;
		}

		let mounted = true;

		supabase.auth.getSession().then(({ data }) => {
			if (!mounted) return;
			setSession(data.session);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession);
			setLoading(false);
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [supabase]);

	const value = useMemo<AuthContextValue>(
		() => ({
			user: session?.user ?? null,
			session,
			loading,
			signIn: async (email, password) => {
				if (!supabase) return "Supabase não está configurado.";
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				return error?.message ?? null;
			},
			signUp: async (name, email, password) => {
				if (!supabase) return "Supabase não está configurado.";
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { name },
					},
				});
				return error?.message ?? null;
			},
			signOut: async () => {
				console.log("Executando supabase.auth.signOut()...");
				if (!supabase) return;
				await supabase.auth.signOut();
			},
			resetPassword: async (email) => {
				if (!supabase) return "Supabase não está configurado.";
				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: `${window.location.origin}/auth?mode=reset`,
				});
				return error?.message ?? null;
			},
			updatePassword: async (password) => {
				if (!supabase) return "Supabase não está configurado.";
				const { error } = await supabase.auth.updateUser({
					password,
				});
				return error?.message ?? null;
			},
		}),
		[loading, session, supabase],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error("useAuth deve ser usado dentro de AuthProvider.");
	}
	return value;
}
