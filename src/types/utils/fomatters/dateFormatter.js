//yyyy-mm-ddT20:hh:mm => hh:mm - dd/mm/yyyy
const formatDateAndTime = (iso) => {
 const date = new Date(iso);
 const result =
 date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
 " - " +
 date.toLocaleDateString("vi-VN");

 return result;
};

//dd/mm/yyyy
const formatDateToView = (dateStr) => {
 if (!dateStr) return "";
 const [yyyy, mm, dd] = dateStr.split("-");
 return `${dd}/${mm}/${yyyy}`;
};

//yyyy//mm/dd
const convertDateToSubmit = (ddmmyyyy) => {
 if (!ddmmyyyy) return "";
 const [dd, mm, yyyy] = ddmmyyyy.split("/");
 return `${yyyy}-${mm}-${dd}`;
};

//Data => yyyy
const formatYear = (date) => {
 if (!date) return "-";
 const d = new Date(date);
 return isNaN(d) ? "-" : d.getFullYear();
};

//input min => hh:mm
const formatTime = (min) => {
 if (min == null) return "-";
 const h = Math.floor(min / 60);
 const m = min % 60;
 return `${h}h ${m}m`;
};

export {
 formatTime,
 formatDateAndTime,
 formatYear,
 formatDateToView,
 convertDateToSubmit,
};
