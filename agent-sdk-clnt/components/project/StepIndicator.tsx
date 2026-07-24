interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  "Project",
  "Repository",
  "Deploy",
];

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">

      {steps.map((step, index) => {

        const active = index + 1 <= currentStep;

        return (
          <div
            key={step}
            className="flex flex-1 items-center"
          >
            <div className="flex flex-col items-center">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition

                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>

              <span className="mt-2 text-sm">
                {step}
              </span>

            </div>

            {index !== steps.length - 1 && (
              <div
                className={`mx-4 h-[2px] flex-1

                ${
                  active
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
            )}

          </div>
        );

      })}
    </div>
  );
}