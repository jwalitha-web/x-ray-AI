// ================================================================
//  Shared App Utilities
//  – Toast notifications
//  – Session helpers (store user profile in sessionStorage)
//  – PDF report generator (using jsPDF from CDN)
// ================================================================

// ── Toast ────────────────────────────────────────────────────────
function getToastContainer() {
    let el = document.getElementById("toast-container");
    if (!el) {
        el = document.createElement("div");
        el.id = "toast-container";
        document.body.appendChild(el);
    }
    return el;
}

export function toast(message, type = "info", duration = 3500) {
    const container = getToastContainer();
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), duration);
}

// ── Session ──────────────────────────────────────────────────────
export function saveSession(profile) {
    sessionStorage.setItem("xray_user", JSON.stringify(profile));
}

export function getSession() {
    try {
        const sess = sessionStorage.getItem("xray_user");
        if (sess) return JSON.parse(sess);
        // Fallback to guest doctor session for sign-in-free access
        return {
            uid: "guest_chief_medical_officer",
            name: "Chief Medical Officer",
            email: "cmo@xray-ai.agency",
            role: "doctor",
            isGuest: true
        };
    } catch { return null; }
}

export function clearSession() {
    sessionStorage.removeItem("xray_user");
    sessionStorage.removeItem("xray_scan_result");
}

export function saveScanResult(data) {
    sessionStorage.setItem("xray_scan_result", JSON.stringify(data));
}

export function getScanResult() {
    try {
        return JSON.parse(sessionStorage.getItem("xray_scan_result"));
    } catch { return null; }
}

// ── Redirect guards ──────────────────────────────────────────────
export function requireAuth(allowedRole) {
    const user = getSession();
    if (!user) {
        window.location.href = "../index.html";
        return false;
    }
    // Doctor-only restriction: block non-doctors from results
    if (allowedRole === "doctor" && user.role !== "doctor") {
        window.location.href = "/xray-ai/pages/dashboard.html";
        return false;
    }
    return user;
}

// ── Date formatter ───────────────────────────────────────────────
export function fmtDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds ? ts.seconds * 1000 : ts);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Risk helpers ─────────────────────────────────────────────────
export function riskLevel(p) {
    if (p >= 0.6) return "high";
    if (p >= 0.3) return "moderate";
    return "low";
}
export function riskLabel(p) {
    return riskLevel(p).toUpperCase().replace("MODERATE", "MODERATE");
}

// ── PDF Report ───────────────────────────────────────────────────
export function downloadReport(scan, userProfile) {
    // jsPDF is loaded from CDN in the HTML; access the global
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth();

    // Header gradient area
    doc.setFillColor(15, 39, 68);
    doc.rect(0, 0, W, 36, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("X-Ray AI Screening Report", 14, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("X-Ray AI Screening Assistant  |  Confidential Medical Document", 14, 26);

    // Patient info
    let y = 48;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Patient / Session Details", 14, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Doctor: ${userProfile?.name || "—"}`, 14, y); y += 5;
    doc.text(`Email:  ${userProfile?.email || "—"}`, 14, y); y += 5;
    const dateStr = scan.createdAt
        ? new Date(scan.createdAt.seconds ? scan.createdAt.seconds * 1000 : scan.createdAt).toLocaleString()
        : new Date().toLocaleString();
    doc.text(`Date:   ${dateStr}`, 14, y); y += 5;
    doc.text(`Scan ID: ${scan.id || "—"}`, 14, y); y += 10;

    // Risk level
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Overall Risk Level", 14, y); y += 7;
    const risk = (scan.highestRisk || 0);
    const rl = riskLevel(risk);
    const rColor = rl === "high" ? [239, 68, 68] : rl === "moderate" ? [245, 158, 11] : [16, 185, 129];
    doc.setFillColor(...rColor);
    doc.roundedRect(14, y, 50, 10, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`${riskLabel(risk)}  (${(risk * 100).toFixed(1)}%)`, 18, y + 6.5);
    doc.setTextColor(30, 41, 59);
    y += 18;

    // Disease table
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Disease Probability Analysis", 14, y); y += 2;

    const tableData = (scan.predictions || []).map(p => [
        p.disease,
        `${(p.probability * 100).toFixed(1)}%`,
        riskLabel(p.probability),
    ]);

    doc.autoTable({
        startY: y + 4,
        head: [["Disease", "Probability", "Risk Level"]],
        body: tableData,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [15, 39, 68], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 246, 255] },
        columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 } },
        margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;

    // Disclaimer
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.rect(14, y, W - 28, 18, "FD");
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("⚠  DISCLAIMER", 18, y + 6);
    doc.setFont("helvetica", "normal");
    doc.text(
        "This report is generated by an AI screening tool and does NOT constitute a medical diagnosis.",
        18, y + 11,
        { maxWidth: W - 36 }
    );
    doc.text("Always consult a qualified medical professional for clinical decisions.", 18, y + 15.5);

    doc.save(`xray-report-${scan.id || Date.now()}.pdf`);
}
