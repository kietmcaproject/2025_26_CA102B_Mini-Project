// flightValidatorWorker.js
self.onmessage = (e) => {
  const { type, payload } = e.data;

  if (type === "validateDate") {
    postMessage({ date: validateDate(payload.date) });
  }

  if (type === "validateRoute") {
    postMessage({ route: validateRoute(payload.source, payload.destination) });
  }

  if (type === "validatePhone") {
    postMessage({ phone: validatePhoneNumber(payload.phone) });
  }

  if (type === "validateAadhar") {
    postMessage({ aadhar: validateAadharNumber(payload.aadhar) });
  }
};

// ✅ Validate Date
function validateDate(dateInput) {
  if (!dateInput)
    return { valid: false, message: "Please select a travel date." };

  const inputDate = new Date(dateInput);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime()))
    return { valid: false, message: "Invalid date format." };

  if (inputDate < today)
    return { valid: false, message: "Travel date cannot be in the past." };

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 6);

  if (inputDate > maxDate)
    return {
      valid: false,
      message: "Travel date cannot be more than 6 months from today.",
    };

  return { valid: true, message: "" };
}

// ✅ Validate Route
function validateRoute(source, destination) {
  if (!source || !destination)
    return { valid: false, message: "Select both source and destination." };

  if (source === destination)
    return {
      valid: false,
      message: "Source and destination cannot be the same.",
    };

  return { valid: true, message: "Valid route." };
}

// ✅ Validate Phone Number
function validatePhoneNumber(phone) {
  if (!phone) return { valid: false, message: "Phone number is required." };

  // Remove whitespace and dashes
  phone = phone.trim().replace(/[\s-]/g, "");

  // If starts with 0, trim it
  if (phone.startsWith("0")) phone = phone.slice(1);

  // Must be digits only
  if (!/^\d+$/.test(phone))
    return { valid: false, message: "Phone number must contain only digits." };

  // Must be exactly 10 digits
  if (phone.length !== 10)
    return { valid: false, message: "Phone number must be exactly 10 digits." };

  // Must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(phone))
    return {
      valid: false,
      message: "Invalid Number.",
    };

  return { valid: true, message: "", normalized: phone };
}

// ✅ Validate Aadhar Number
function validateAadharNumber(aadhar) {
  if (!aadhar) return { valid: false, message: "Aadhaar number is required." };

  // Remove spaces or dashes
  aadhar = aadhar.replace(/\s|-/g, "");

  // Must be exactly 12 digits
  if (!/^\d{12}$/.test(aadhar))
    return { valid: false, message: "Aadhaar must be exactly 12 digits." };

  // Cannot start with 0 or 1
  if (/^[0-1]/.test(aadhar))
    return { valid: false, message: "Aadhaar cannot start with 0 or 1." };

  // Check Verhoeff checksum
  if (!verhoeffCheck(aadhar))
    return { valid: false, message: "Invalid Aadhaar checksum." };

  return { valid: true, message: "", normalized: aadhar };
}
