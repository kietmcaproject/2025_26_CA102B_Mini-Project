// src/workers/generalWorker.js

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case "validatePassword":
      postMessage(validatePassword(payload.password, payload.minLength || 6));
      break;

    case "validateEmail":
      postMessage(validateEmail(payload.email));
      break;

    case "heavyComputation":
      postMessage(heavyComputation(payload.iterations || 1e7));
      break;

    default:
      postMessage({ valid: false, message: "Unknown worker task type." });
  }
};

/* ========== VALIDATORS ========== */

function validatePassword(password, minLength = 6) {
  if (!password) return { valid: false, message: "Password is required." };

  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters long.`,
    };
  }

  for (let i = 0; i < 1e7; i++) {}

  return { valid: true, message: "Password length is strong enough." };
}

function validateEmail(email) {
  if (!email) return { valid: false, message: "Email is required." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email address." };
  }

  return { valid: true, message: "Email format is valid." };
}

/* ========== GENERIC HEAVY COMPUTATION ========== */

function heavyComputation(iterations) {
  let total = 0;
  for (let i = 0; i < iterations; i++) total += i;
  return { valid: true, message: "Computation complete.", total };
}
