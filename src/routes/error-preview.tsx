import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error-preview")({
	component: ErrorPreview,
});

function ErrorPreview() {
	const searchParams = new URLSearchParams(window.location.search);
	const errorCase = searchParams.get("case");

	switch (errorCase) {
		case "string":
			throw "Falha textual usada para validar erro lançado como string.";
		case "object":
			throw {
				code: "PREVIEW_OBJECT_ERROR",
				message: "Falha simulada com objeto simples.",
				source: "error-preview",
			};
		case "empty":
			throw new Error("");
		case "aggregate":
			throw new AggregateError(
				[
					new Error("Primeira falha simulada."),
					"Segunda falha simulada como texto.",
				],
				"Falhas combinadas no preview global.",
			);
		case "long":
			throw new Error(
				`Falha extensa simulada. ${"Detalhe repetido para validar quebra e truncamento. ".repeat(40)}`,
			);
		default:
			throw new Error("Falha simulada para validar a página global de erro.");
	}
}
