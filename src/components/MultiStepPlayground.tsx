import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function MultiStepPlayground() {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		name: "",
		class: "",
		level: 1,
	});

	return (
		<Dialog>
			<form>
				<DialogTrigger asChild>
					<Button variant="default">
						<Plus />
						Adicionar Personagem
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						{currentStep === 0 && <DialogTitle>Edit profile</DialogTitle>}
						{currentStep === 1 && <DialogTitle>Edit profile</DialogTitle>}
						{currentStep === 2 && <DialogTitle>Edit profile</DialogTitle>}
						<DialogDescription>
							Make changes to your profile here. Click save when you&apos;re
							done.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name-1">Name</Label>
							<Input name="name" defaultValue="Pedro Duarte" />
						</div>
						<div className="grid gap-3">
							<Label htmlFor="username-1">Username</Label>
							<Input name="username" defaultValue="@peduarte" />
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								disabled={currentStep === 0}
								onClick={() => setCurrentStep((prev) => prev - 1)}
							>
								Previous
							</Button>
						</DialogClose>
						<Button
							disabled={currentStep === 2}
							onClick={() => setCurrentStep((prev) => prev + 1)}
						>
							Next
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
