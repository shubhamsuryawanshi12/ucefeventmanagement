import jsPDF from 'jspdf'

export const generateCertificate = (studentName: string, eventTitle: string, date: string, certificateId: string) => {
    // Create landscape PDF (A4: 297mm x 210mm)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    })

    const width = 297
    const height = 210

    // Colors
    const gold = '#cca43b'       // Muted Gold
    const darkNavy = '#0f172a'   // Very Dark Blue/Black
    const lightGray = '#f3f4f6'  // Light background gray
    const textDark = '#1f2937'   // Gray-900

    // --- BACKGROUND ---
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, width, height, 'F')

    // Subtle Pattern (Optional lines on right side)
    doc.setDrawColor(245, 245, 245)
    doc.setLineWidth(0.5)
    for (let i = 80; i < width; i += 10) {
        doc.line(i, 0, i, height) // Vertical lines background effect
    }

    // --- GEOMETRIC SHAPES (Left Side) ---

    // 1. Top Left Gold Block
    // Shape: Rectangle top left (0,0) to (70,0) -> Polygon down to (0,150)
    doc.setFillColor(gold)
    doc.path([
        { op: 'm', c: [0, 0] },
        { op: 'l', c: [90, 0] },
        { op: 'l', c: [60, 60] }, // Inner point
        { op: 'l', c: [0, 140] },
        { op: 'l', c: [0, 0] }
    ])
    doc.fill()

    // 2. Middle Gray/White Triangle
    // The angled slice between gold and dark
    doc.setFillColor(230, 230, 230) // Light Gray
    doc.path([
        { op: 'm', c: [0, 140] },
        { op: 'l', c: [60, 60] },
        { op: 'l', c: [100, 140] },
        { op: 'l', c: [0, 140] } // Doesnt matter much as it's covered by black below
    ])
    // Actually the image has a white/gray cut. Let's simplify:

    // 3. Bottom Left Dark Navy Block
    // Large dark triangle at bottom left
    doc.setFillColor(darkNavy)
    doc.path([
        { op: 'm', c: [0, 120] },   // Start partly up
        { op: 'l', c: [120, 210] }, // Bottom point shifted right
        { op: 'l', c: [0, 210] },   // Bottom Left corner
        { op: 'l', c: [0, 120] }
    ])
    doc.fill()

    // Add distinct "cut" effect (White overlay line) to separate shapes if needed
    // But filled shapes should work.


    // --- BADGE (Top Left in Gold Area) ---
    const badgeX = 50
    const badgeY = 60
    // Simplified Badge Circle
    doc.setFillColor(darkNavy) // Dark center
    doc.circle(badgeX, badgeY, 18, 'F')
    doc.setDrawColor(gold)
    doc.setLineWidth(1)
    doc.circle(badgeX, badgeY, 16, 'S') // Gold Ring

    doc.setTextColor(gold)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("AWARD", badgeX, badgeY, { align: "center" })
    doc.setFontSize(6)
    doc.text("2026", badgeX, badgeY + 4, { align: "center" })


    // --- CONTENT (Right Side) ---
    const contentX = 175 // Shifted right

    // Header: CERTIFICATE
    doc.setFont("times", "bold") // Serif
    doc.setFontSize(42)
    doc.setTextColor(textDark)
    doc.text("CERTIFICATE", contentX, 50, { align: "center" })

    // Subheader: OF APPRECIATION
    doc.setFont("helvetica", "normal") // Sans serif
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100) // Lighter gray
    doc.setCharSpace(3) // Spaced out letters
    doc.text("OF APPRECIATION", contentX, 60, { align: "center" })

    // Line under header
    doc.setLineWidth(0.5)
    doc.setDrawColor(textDark)
    doc.line(contentX - 40, 65, contentX + 40, 65)

    // "Proudly presented to"
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(textDark)
    doc.setCharSpace(1)
    doc.text("PROUDLY PRESENTED TO", contentX, 85, { align: "center" })

    // STUDENT NAME
    doc.setFont("times", "italic") // Script-like
    doc.setFontSize(48)
    doc.setTextColor(gold) // Gold Color
    doc.setCharSpace(0)
    doc.text(studentName, contentX, 105, { align: "center" })

    // Body Text
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const desc = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dignissim ` +
        `in the Leaders of the World Competition held ` +
        `for the event '${eventTitle}'.`

    const splitDesc = doc.splitTextToSize(desc, 130)
    doc.text(splitDesc, contentX, 125, { align: "center" })

    // --- FOOTER LINES ---
    const lineY = 170

    // DATE Line
    doc.setDrawColor(textDark)
    doc.line(125, lineY, 165, lineY)
    doc.setFontSize(8)
    doc.text("DATE", 145, lineY + 5, { align: "center" })
    doc.setFontSize(10)
    doc.text(new Date(date).toLocaleDateString(), 145, lineY - 2, { align: "center" })

    // SIGNATURE Line
    doc.line(205, lineY, 245, lineY)
    doc.setFontSize(8)
    doc.text("SIGNATURE", 225, lineY + 5, { align: "center" })

    // ID Bottom Right
    doc.setFontSize(8)
    doc.setTextColor(200, 200, 200)
    doc.text(`ID: ${certificateId}`, 280, 200, { align: "right" })

    // Save
    doc.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`)
}
