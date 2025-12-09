// hotelValidatorWorker.js

self.onmessage = (e) => {
  const { type, payload } = e.data;

  if (type === "validatePhone") {
    postMessage({ phone: validatePhone(payload.phone) });
  }

  if (type === "validateStayDates") {
    postMessage({ date: validateStayDates(payload.checkIn, payload.checkOut) });
  }
};

// ✅ Validate Phone (6–9 start, 10 digits, trims 0)
function validatePhone(phone) {
  if (!phone) return { valid: false, message: "Phone number required." };
  phone = phone.trim().replace(/[\s-]/g, "");
  if (phone.startsWith("0")) phone = phone.slice(1);
  if (!/^\d+$/.test(phone)) return { valid: false, message: "Digits only." };
  if (phone.length !== 10)
    return { valid: false, message: "Must be 10 digits." };
  if (!/^[6-9]/.test(phone))
    return { valid: false, message: "Invalid starting digit." };
  return { valid: true, message: "" };
}

// ✅ Validate Stay Dates (Check-in ≥ today, Check-out ≥ Check-in)
function validateStayDates(checkIn, checkOut) {
  if (!checkIn || !checkOut)
    return { valid: false, message: "Select both dates." };

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const today = new Date();

  // Zero-out time to compare only date
  today.setHours(0, 0, 0, 0);
  inDate.setHours(0, 0, 0, 0);
  outDate.setHours(0, 0, 0, 0);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()))
    return { valid: false, message: "Invalid date format." };

  if (inDate < today)
    return {
      valid: false,
      message: "Check-in date cannot be in the past. It must be today or later.",
    };

  if (outDate < inDate)
    return {
      valid: false,
      message: "Check-out must be the same day or after check-in.",
    };

  return { valid: true, message: "" };
}

