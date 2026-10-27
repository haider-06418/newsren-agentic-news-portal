import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateAccessibility,
  evaluateCost,
  evaluateLatency,
  evaluateTrust,
  evaluateUsefulness,
} from "../lib/evaluation.ts";

test("trust and usefulness release metrics pass from traceable story data", () => {
  const metrics = [...evaluateTrust(), ...evaluateUsefulness()];
  assert.ok(metrics.length >= 5);
  assert.ok(metrics.every((metric) => metric.passed));
});

test("accessibility evaluation requires every structural signal", () => {
  const passing = evaluateAccessibility({
    skipLink: true,
    mainLandmarks: true,
    labeledInputs: true,
    liveRegions: true,
    pressedState: true,
  });
  assert.equal(passing[0].passed, true);

  const missingLabel = evaluateAccessibility({
    skipLink: true,
    mainLandmarks: true,
    labeledInputs: false,
    liveRegions: true,
    pressedState: true,
  });
  assert.equal(missingLabel[0].passed, false);
});

test("the default release has no model inference cost", () => {
  assert.equal(evaluateCost(false)[0].passed, true);
  assert.equal(evaluateCost(false)[0].value, "$0.00 / answer");
  assert.equal(evaluateCost(true)[0].passed, false);
});

test("deterministic answer selection stays within the local latency budget", async () => {
  const metric = await evaluateLatency(50);
  assert.equal(metric.passed, true, metric.value);
});
