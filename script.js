const SITE_CONFIG = {
    whatsappNumber: "9330000000"
};


const wa = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
const a = document.getElementById("waFloat");
const b = document.getElementById("waLink");

if (a) a.href = wa;
if (b) b.href = wa;