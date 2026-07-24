"use client";

import { useState } from "react";
import RepositoryStep from "./RepositoryStep";
import DeployStep from "./DeployStep";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import StepIndicator from "./StepIndicator";
import ProjectDetailsStep from "./ProjectDetailsStep";

export default function CreateProjectDialog({ open, setOpen }: any) {
  const [step, setStep] = useState(1);

  const [project, setProject] = useState({
    name: "",
    description: "",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <StepIndicator currentStep={step} />

        <div className="py-8">
          {step === 1 && (
            <ProjectDetailsStep project={project} setProject={setProject} />
          )}

          {step === 2 && (
            <RepositoryStep project={project} setProject={setProject} />
          )}

          {step === 3 && (
            <DeployStep project={project} setProject={setProject} />
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>

          {step !== 3 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button>Create Project</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
