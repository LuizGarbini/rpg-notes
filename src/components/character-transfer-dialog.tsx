import { ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/form-tabs";
import { Select } from "@/components/ui/select";
import type { Character } from "@/lib/store";
import { useRPGStore } from "@/lib/store";

interface CharacterTransferDialogProps {
	character: Character;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CharacterTransferDialog({
	character,
	open,
	onOpenChange,
}: CharacterTransferDialogProps) {
	const campaigns = useRPGStore((state) => state.campaigns);
	const activeCampaignId = useRPGStore((state) => state.activeCampaignId);
	const transferCharacterToCampaign = useRPGStore(
		(state) => state.transferCharacterToCampaign,
	);
	const targetCampaigns = useMemo(
		() => campaigns.filter((campaign) => campaign.id !== activeCampaignId),
		[campaigns, activeCampaignId],
	);
	const [targetCampaignId, setTargetCampaignId] = useState(
		targetCampaigns[0]?.id ?? "",
	);
	const [isTransferring, setIsTransferring] = useState(false);
	const [transferStatus, setTransferStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	const selectedCampaign = campaigns.find(
		(campaign) => campaign.id === targetCampaignId,
	);
	const canTransfer = targetCampaigns.length > 0 && !!targetCampaignId;

	async function handleTransfer() {
		if (!canTransfer) return;
		setIsTransferring(true);
		setTransferStatus("idle");
		try {
			await transferCharacterToCampaign(character.id, targetCampaignId);
			setTransferStatus("success");
		} catch {
			setTransferStatus("error");
		} finally {
			setIsTransferring(false);
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen);
		if (nextOpen) {
			setTargetCampaignId(targetCampaigns[0]?.id ?? "");
			setTransferStatus("idle");
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="font-display text-lg">
						Transferir personagem
					</DialogTitle>
					<DialogDescription>
						Cria uma copia completa da ficha em outra campanha. A ficha atual
						continua intacta.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Field label="Campanha de destino">
						<Select
							value={targetCampaignId}
							onChange={(event) => {
								setTargetCampaignId(event.target.value);
								setTransferStatus("idle");
							}}
							disabled={targetCampaigns.length === 0 || isTransferring}
						>
							{targetCampaigns.length === 0 ? (
								<option value="">Nenhuma outra campanha disponivel</option>
							) : (
								targetCampaigns.map((campaign) => (
									<option key={campaign.id} value={campaign.id}>
										{campaign.name}
									</option>
								))
							)}
						</Select>
					</Field>

					<div className="rounded-xl border border-border/70 bg-card/60 p-4 text-[13px] leading-relaxed text-muted-foreground">
						<p className="font-semibold text-foreground">
							O que sera levado para {selectedCampaign?.name ?? "a campanha"}:
						</p>
						<p className="mt-2">
							Dados basicos, atributos, combate, magia, inventario, notas,
							layout da ficha e imagem do personagem. Vinculos familiares e
							links com entidades da campanha atual ficam de fora para evitar
							referencias quebradas.
						</p>
						<p className="mt-2">
							Se a campanha de destino usar outro conjunto de regras no futuro,
							a copia mantem o sistema original da ficha e pode ser ajustada
							depois sem alterar a original.
						</p>
					</div>

					{transferStatus === "success" && (
						<div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-200">
							<CheckCircle2 className="h-4 w-4" />
							Personagem transferido com sucesso.
						</div>
					)}
					{transferStatus === "error" && (
						<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[13px] text-rose-200">
							Nao foi possivel transferir agora. Verifique a sincronizacao e
							tente novamente.
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="ghost"
						onClick={() => handleOpenChange(false)}
						disabled={isTransferring}
					>
						Fechar
					</Button>
					<Button
						type="button"
						onClick={handleTransfer}
						disabled={!canTransfer || isTransferring}
						className="gap-2"
					>
						<ArrowRightLeft className="h-4 w-4" />
						{isTransferring ? "Transferindo..." : "Transferir"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
