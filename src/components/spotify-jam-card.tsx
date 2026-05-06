import { useState, useEffect } from "react";
import { Music, QrCode, ExternalLink, Trash2, Check, Copy, Play } from "lucide-react";
import { useRPGStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SpotifyConnect } from "./spotify-connect";
import { getCurrentlyPlaying } from "@/lib/spotify";
import { cn } from "@/lib/utils";

import { Skeleton } from "./ui/skeleton";

import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "./ui/avatar";

// Usaremos uma API externa para gerar o QR Code e evitar erros de dependência não instalada
function QRCodePlaceholder({ value, size }: { value: string; size: number }) {
	const [loading, setLoading] = useState(true);
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
	
	return (
		<div className="relative" style={{ width: size, height: size }}>
			{loading && <Skeleton className="absolute inset-0 rounded-sm" />}
			<img 
				src={qrUrl} 
				alt="QR Code" 
				width={size} 
				height={size} 
				className={cn("rounded-sm transition-opacity duration-300", loading ? "opacity-0" : "opacity-100")}
				onLoad={() => setLoading(false)}
			/>
		</div>
	);
}

interface SpotifyJamCardProps {
	isDM?: boolean;
}

export function SpotifyJamCard({ isDM = false }: SpotifyJamCardProps) {
	const jamLink = useRPGStore((s) => s.spotifyJamLink);
	const setSpotifyJam = useRPGStore((s) => s.setSpotifyJam);
	const clearSpotifyJam = useRPGStore((s) => s.clearSpotifyJam);
	
	const spotifyToken = useRPGStore((s) => s.spotifyToken);
	const currentTrack = useRPGStore((s) => s.currentTrack);
	const setCurrentTrack = useRPGStore((s) => s.setCurrentTrack);
	const logoutSpotify = useRPGStore((s) => s.logoutSpotify);

	const jamParticipants = useRPGStore((s) => s.jamParticipants);

	const [inputLink, setInputLink] = useState("");
	const [copied, setCopied] = useState(false);
	const [isLoadingTrack, setIsLoadingTrack] = useState(true);

	// Polling para a música atual
	useEffect(() => {
		if (!spotifyToken) {
			setIsLoadingTrack(false);
			return;
		}

		async function fetchTrack() {
			try {
				const response = await fetch("https://api.spotify.com/v1/me/player", {
					headers: { Authorization: `Bearer ${spotifyToken}` }
				});
				
				if (response.status === 401) {
					logoutSpotify();
					return;
				}

				if (response.status === 204) {
					setCurrentTrack(null);
					setIsLoadingTrack(false);
					return;
				}

				const data = await response.json();
				if (data && data.item) {
					setCurrentTrack({
						title: data.item.name,
						artist: data.item.artists.map((a: any) => a.name).join(", "),
						albumArt: data.item.album.images[0]?.url,
						isPlaying: data.is_playing
					});
				} else {
					setCurrentTrack(null);
				}
			} catch (e) {
				console.error("Erro ao buscar música:", e);
			} finally {
				setIsLoadingTrack(false);
			}
		}

		fetchTrack();
		const interval = setInterval(fetchTrack, 10000); // Polling a cada 10s
		return () => clearInterval(interval);
	}, [spotifyToken, setCurrentTrack]);

	function handleSaveJam() {
		if (inputLink.trim()) {
			setSpotifyJam(inputLink.trim());
			setInputLink("");
		}
	}

	function handleCopy() {
		if (jamLink) {
			navigator.clipboard.writeText(jamLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}

	return (
		<div className="rounded-xl border border-border bg-card-elevated overflow-hidden transition-colors hover:border-border-hover">
			<div className="flex items-center justify-between bg-muted/30 px-4 py-3 border-b border-border">
				<div className="flex items-center gap-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
						<Music className="h-4 w-4" />
					</div>
					<h3 className="font-display text-sm font-bold text-foreground">Spotify Jam</h3>
				</div>
				<SpotifyConnect />
			</div>

			{/* Now Playing Display / Skeleton */}
			{(isLoadingTrack && spotifyToken) ? (
				<div className="px-4 py-3 border-b border-border bg-emerald-500/5 flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded shadow-md" />
					<div className="min-w-0 flex-1 space-y-2">
						<Skeleton className="h-2 w-20" />
						<Skeleton className="h-3 w-32" />
						<Skeleton className="h-2 w-24" />
					</div>
					<div className="flex -space-x-2">
						<Skeleton className="h-7 w-7 rounded-full border-2 border-background" />
						<Skeleton className="h-7 w-7 rounded-full border-2 border-background" />
					</div>
				</div>
			) : currentTrack ? (
				<div className="px-4 py-3 border-b border-border bg-emerald-500/5 flex items-center gap-3">
					{currentTrack.albumArt && (
						<img 
							src={currentTrack.albumArt} 
							alt="Album Art" 
							className="h-10 w-10 rounded shadow-md animate-pulse-slow"
						/>
					)}
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-1.5">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</span>
							<span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500/80">Tocando agora</span>
						</div>
						<h4 className="text-[12px] font-bold text-foreground truncate leading-tight mt-0.5">
							{currentTrack.title}
						</h4>
						<p className="text-[10px] text-muted-foreground truncate">
							{currentTrack.artist}
						</p>
					</div>

					{/* Jam Participants Real-time */}
					<AvatarGroup className="shrink-0">
						{jamParticipants.map((p) => (
							<Avatar key={p.id} size="sm" title={p.name}>
								<AvatarImage src={p.image} alt={p.name} />
								<AvatarFallback className="bg-zinc-800 text-[8px] font-bold text-muted-foreground">
									{p.name ? p.name.charAt(0).toUpperCase() : "?"}
								</AvatarFallback>
							</Avatar>
						))}
						{jamParticipants.length === 0 && (
							<div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-muted-foreground shadow-sm">
								-
							</div>
						)}
					</AvatarGroup>
				</div>
			) : null}

			<div className="p-4">
				{!jamLink ? (
					<div className="space-y-4">
						<p className="text-[12px] text-muted-foreground leading-relaxed [text-wrap:balance]">
							{isDM 
								? "Inicie uma Jam no seu Spotify e cole o link abaixo para compartilhar a vibe com seus jogadores."
								: "Nenhuma Jam ativa no momento. Aguarde o Mestre iniciar uma sessão musical."}
						</p>
						
						{isDM && (
							<div className="flex gap-2">
								<Input
									placeholder="https://spotify.link/jam/..."
									value={inputLink}
									onChange={(e) => setInputLink(e.target.value)}
									className="text-xs h-9"
								/>
								<Button size="sm" onClick={handleSaveJam} className="shrink-0">
									Salvar
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-5">
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Jam Ativa</span>
								<span className="text-xs text-muted-foreground truncate max-w-[200px]">{jamLink}</span>
							</div>
							{isDM && (
								<Button variant="ghost" size="icon" onClick={clearSpotifyJam} className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>

						<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50 border border-border/50">
							<div className="p-3 bg-white rounded-lg mb-3 shadow-xl flex items-center justify-center">
								<QRCodePlaceholder value={jamLink} size={140} />
							</div>
							<p className="text-[11px] text-muted-foreground text-center mb-4 px-2 leading-tight">
								Escaneie para entrar na Jam e sincronizar o áudio
							</p>
							
							<div className="flex gap-2 w-full">
								<Button 
									variant="outline" 
									size="sm" 
									className="flex-1 gap-2 text-[11px]"
									onClick={handleCopy}
								>
									{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
									{copied ? "Copiado!" : "Copiar Link"}
								</Button>
								<a 
									href={jamLink} 
									target="_blank" 
									rel="noopener noreferrer" 
									className="flex-1"
								>
									<Button variant="secondary" size="sm" className="w-full gap-2 text-[11px]">
										<ExternalLink className="h-3.5 w-3.5" />
										Abrir Spotify
									</Button>
								</a>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
