import {
	Document,
	Page,
	pdf,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { normalizeSheetLayout, SHEET_MODULE_LABELS } from "@/lib/sheet-modules";
import type {
	Character,
	SheetModuleConfig,
	SheetModuleKind,
} from "@/lib/store";
import { systemLabel } from "@/lib/store";
import { SYSTEM_CONFIG } from "@/lib/systems";

const styles = StyleSheet.create({
	page: {
		padding: 32,
		backgroundColor: "#17131f",
		color: "#f4f0ea",
		fontFamily: "Helvetica",
		fontSize: 9,
	},
	header: {
		padding: 18,
		borderRadius: 16,
		backgroundColor: "#211a2c",
		border: "1 solid #3a3048",
		marginBottom: 16,
	},
	brandRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 18,
	},
	brand: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	brandMark: {
		width: 32,
		height: 32,
		borderRadius: 10,
		backgroundColor: "#d6b36a",
		color: "#17131f",
		alignItems: "center",
		justifyContent: "center",
		fontSize: 12,
		fontWeight: 700,
	},
	brandName: {
		fontSize: 10,
		textTransform: "uppercase",
		letterSpacing: 1.8,
		color: "#d6b36a",
		fontWeight: 700,
	},
	exportMeta: {
		fontSize: 8,
		color: "#a79bb8",
	},
	title: {
		fontSize: 26,
		fontWeight: 700,
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 10,
		color: "#c5b8d6",
	},
	statsGrid: {
		flexDirection: "row",
		gap: 8,
		marginTop: 16,
	},
	stat: {
		flexGrow: 1,
		padding: 10,
		borderRadius: 12,
		backgroundColor: "#17131f",
		border: "1 solid #3a3048",
	},
	statLabel: {
		fontSize: 7,
		textTransform: "uppercase",
		letterSpacing: 1.2,
		color: "#a79bb8",
		marginBottom: 4,
	},
	statValue: {
		fontSize: 13,
		fontWeight: 700,
		color: "#f4f0ea",
	},
	module: {
		padding: 14,
		borderRadius: 14,
		backgroundColor: "#211a2c",
		border: "1 solid #3a3048",
		marginBottom: 10,
	},
	moduleTitle: {
		fontSize: 11,
		textTransform: "uppercase",
		letterSpacing: 1.4,
		color: "#d6b36a",
		fontWeight: 700,
		marginBottom: 10,
	},
	fieldGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	field: {
		width: "48%",
		padding: 8,
		borderRadius: 10,
		backgroundColor: "#17131f",
		border: "1 solid #30273d",
	},
	fieldFull: {
		width: "100%",
		padding: 8,
		borderRadius: 10,
		backgroundColor: "#17131f",
		border: "1 solid #30273d",
	},
	fieldLabel: {
		fontSize: 7,
		textTransform: "uppercase",
		letterSpacing: 1,
		color: "#a79bb8",
		marginBottom: 4,
	},
	fieldValue: {
		fontSize: 9,
		color: "#f4f0ea",
		lineHeight: 1.35,
	},
	abilityValue: {
		fontSize: 14,
		fontWeight: 700,
		color: "#f4f0ea",
	},
	footer: {
		marginTop: 8,
		fontSize: 8,
		color: "#8f82a1",
		textAlign: "center",
	},
});

export async function downloadCharacterSheetPdf(character: Character) {
	const blob = await pdf(<CharacterSheetPdfDocument character={character} />).toBlob();
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `${safeFileName(character.characterName || "ficha")}.pdf`;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

function CharacterSheetPdfDocument({ character }: { character: Character }) {
	const config = SYSTEM_CONFIG[character.system] ?? SYSTEM_CONFIG.generic;
	const modules = normalizeSheetLayout(character).modules
		.filter((module) => module.enabled)
		.sort((a, b) => a.order - b.order);

	return (
		<Document title={`${character.characterName || "Ficha"} | Grimório`}>
			<Page size="A4" style={styles.page}>
				<View style={styles.header} wrap={false}>
					<View style={styles.brandRow}>
						<View style={styles.brand}>
							<View style={styles.brandMark}>
								<Text>G</Text>
							</View>
							<View>
								<Text style={styles.brandName}>Grimório</Text>
								<Text style={styles.exportMeta}>Ficha exportada</Text>
							</View>
						</View>
						<Text style={styles.exportMeta}>{new Date().toLocaleDateString("pt-BR")}</Text>
					</View>
					<Text style={styles.title}>{character.characterName || "Ficha sem nome"}</Text>
					<Text style={styles.subtitle}>
						{systemLabel(character.system)} ·{" "}
						{[character.race, character.class, character.subclass]
							.filter(Boolean)
							.join(" · ") || config.tagline}
					</Text>
					<View style={styles.statsGrid}>
						<QuickPdfStat label="PV" value={`${character.health}/${character.healthMax}`} />
						<QuickPdfStat label="CA" value={String(character.armorClass)} />
						<QuickPdfStat label="Iniciativa" value={formatSigned(character.initiative)} />
						<QuickPdfStat label="Movimento" value={`${character.speed}${config.speedUnit}`} />
					</View>
				</View>

				{modules.map((module) => (
					<PdfModule
						key={module.id}
						module={module}
						character={character}
						abilityLabels={config.abilityLabels}
					/>
				))}

				<Text style={styles.footer}>
					Gerado pelo Grimório · organize fichas, lore e campanha em um só lugar
				</Text>
			</Page>
		</Document>
	);
}

function QuickPdfStat({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.stat}>
			<Text style={styles.statLabel}>{label}</Text>
			<Text style={styles.statValue}>{value}</Text>
		</View>
	);
}

function PdfModule({
	module,
	character,
	abilityLabels,
}: {
	module: SheetModuleConfig;
	character: Character;
	abilityLabels: readonly string[];
}) {
	const title = module.title || SHEET_MODULE_LABELS[module.kind];
	const fields = moduleFields(module.kind, character, abilityLabels, module.content);
	if (fields.length === 0) return null;

	return (
		<View style={styles.module} wrap={false}>
			<Text style={styles.moduleTitle}>{title}</Text>
			<View style={styles.fieldGrid}>
				{fields.map((field) => (
					<View
						key={field.label}
						style={field.full ? styles.fieldFull : styles.field}
						wrap={false}
					>
						<Text style={styles.fieldLabel}>{field.label}</Text>
						<Text style={field.emphasis ? styles.abilityValue : styles.fieldValue}>
							{field.value || "—"}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

function moduleFields(
	kind: SheetModuleKind,
	character: Character,
	abilityLabels: readonly string[],
	content?: string,
) {
	const abilityValues = [
		character.strength,
		character.dexterity,
		character.constitution,
		character.intelligence,
		character.wisdom,
		character.charisma,
	];

	switch (kind) {
		case "identity":
			return [
				field("Nome", character.characterName),
				field("Jogador", character.playerName),
				field("Raça", character.race),
				field("Classe", character.class),
				field("Subclasse", character.subclass),
				field("Antecedente", character.background),
				field("Tendência", character.alignment),
				field("Nível", String(character.level)),
			];
		case "abilities":
			return abilityLabels.map((label, index) =>
				field(label, `${abilityValues[index]} (${formatSigned(modifier(abilityValues[index]))})`, {
					emphasis: true,
				}),
			);
		case "combat":
			return [
				field("Pontos de Vida", `${character.health}/${character.healthMax}`),
				field("PV Temporários", String(character.tempHealth)),
				field("Classe de Armadura", String(character.armorClass)),
				field("Iniciativa", formatSigned(character.initiative)),
				field("Movimento", String(character.speed)),
				field("Dados de Vida", character.hitDice),
				field("Proficiência", formatSigned(character.proficiencyBonus)),
				field("Salvaguardas", character.savingThrows, { full: true }),
			];
		case "sanity":
			return [
				field("Sanidade", `${character.sanity}/${character.sanityMax}`),
				field("Poder", String(character.power)),
				field("Tamanho", String(character.size)),
				field("Educação", String(character.education)),
			];
		case "magic":
			return [
				field("Classe conjuradora", character.spellcastingClass),
				field("Habilidade", character.spellAbility),
				field("CD", String(character.spellSaveDc)),
				field("Ataque mágico", formatSigned(character.spellAttackBonus)),
				field("Magias", character.spells, { full: true }),
				field("Espaços", character.spellSlots, { full: true }),
			];
		case "inventory":
			return [
				field("Equipamento", character.equipment, { full: true }),
				field("Moedas", character.currency, { full: true }),
			];
		case "personality":
			return [
				field("Traços", character.personalityTraits, { full: true }),
				field("Ideais", character.ideals, { full: true }),
				field("Vínculos", character.bonds, { full: true }),
				field("Defeitos", character.flaws, { full: true }),
			];
		case "notes":
			return [field("Notas", character.notes, { full: true })];
		case "customText":
		case "customStats":
			return [field("Conteúdo", content ?? "", { full: true })];
		default:
			return [];
	}
}

function field(
	label: string,
	value: string,
	options: { full?: boolean; emphasis?: boolean } = {},
) {
	return { label, value, ...options };
}

function modifier(score: number) {
	return Math.floor((score - 10) / 2);
}

function formatSigned(value: number) {
	return value >= 0 ? `+${value}` : String(value);
}

function safeFileName(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9-_]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();
}
