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
    const deepBlue = '#1a237e'   // Deep Indigo/Blue
    const gold = '#ffd700'       // Gold
    const goldShadow = '#c5a000' // Darker Gold for depth
    const textDark = '#1f2937'   // Gray-900

    // --- BACKGROUND ---
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, width, height, 'F')

    // --- LEFT SIDEBAR DESIGN (Geometric) ---

    // 1. Main Blue Polygon (Left side)
    // Coords: (0,0) -> (80,0) -> (50, 210) -> (0, 210)
    doc.setFillColor(deepBlue)
    doc.triangle(0, 0, 100, 0, 0, 210, 'F')
    doc.rect(0, 0, 60, 210, 'F') // Fill logic fix, let's just draw a complex shape

    // Let's draw the Blue Shape utilizing a path or multiple triangles
    doc.setFillColor(deepBlue)
    doc.setGState(new (doc as any).GState({ opacity: 1 }))
    // Left Blue Block covering left 25% but angled
    doc.lines([[80, 0], [-30, 210], [-50, 0]], 0, 0, [1, 1], 'F', true)

    // Actually, distinct shapes are easier in jsPDF primitive
    // Big Blue Triangle Top Left
    doc.setFillColor(deepBlue)
    doc.path([
        { op: 'm', c: [0, 0] },
        { op: 'l', c: [90, 0] }, // Top point
        { op: 'l', c: [50, 210] }, // Bottom Angle point
        { op: 'l', c: [0, 210] },
        { op: 'l', c: [0, 0] }
    ])
    doc.fill(deepBlue)

    // Gold Diagonal Strip (The border between blue and white)
    doc.setFillColor(gold)
    doc.path([
        { op: 'm', c: [90, 0] },
        { op: 'l', c: [100, 0] },
        { op: 'l', c: [60, 210] },
        { op: 'l', c: [50, 210] },
        { op: 'l', c: [90, 0] }
    ])
    doc.fill(gold)

    // Bottom Left Gold Corner (Triangle)
    doc.setFillColor(gold)
    doc.triangle(0, 150, 30, 210, 0, 210, 'F')


    // --- BADGE / SEAL (Simulated) ---
    // Top Left Badge
    const badgeX = 40
    const badgeY = 50
    doc.setFillColor(gold)
    doc.circle(badgeX, badgeY, 18, 'F')
    doc.setFillColor(deepBlue)
    doc.circle(badgeX, badgeY, 15, 'F')
    doc.setTextColor(gold)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("BEST", badgeX, badgeY - 2, { align: "center" })
    doc.text("AWARD", badgeX, badgeY + 4, { align: "center" })

    // Ribbons for Badge
    doc.setFillColor(gold)
    doc.triangle(badgeX - 10, badgeY + 15, badgeX - 15, badgeY + 40, badgeX - 5, badgeY + 30, 'F') // Left Ribbon
    doc.triangle(badgeX + 10, badgeY + 15, badgeX + 15, badgeY + 40, badgeX + 5, badgeY + 30, 'F') // Right Ribbon


    // --- CONTENT (Right Side) ---
    const contentX = 160 // Center of right side roughly

    // Title: CERTIFICATE
    doc.setFont("times", "bold")
    doc.setFontSize(48)
    doc.setTextColor(deepBlue)
    doc.text("CERTIFICATE", contentX, 50, { align: "center" })

    // Subtitle: OF AWARD
    doc.setFontSize(24)
    doc.setTextColor(deepBlue)
    doc.text("OF AWARD", contentX, 62, { align: "center" })

    // "We hereby present..."
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(textDark)
    doc.text("We hereby present this certificate to", contentX, 85, { align: "center" })

    // Student Name (Simulated Handwritting/Cursive using Italic Serif)
    doc.setFont("times", "italic")
    doc.setFontSize(48)
    doc.setTextColor(textDark)
    doc.text(studentName, contentX, 110, { align: "center" })

    // Line under name
    doc.setDrawColor(156, 163, 175) // Gray-400
    doc.setLineWidth(0.5)
    doc.line(contentX - 60, 115, contentX + 60, 115)

    // Description Body
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(textDark)
    const desc = `For his/her exceptional participation and successful completion of the event '${eventTitle}'.` +
        ` Held on ${new Date(date).toLocaleDateString()}.`

    const splitDesc = doc.splitTextToSize(desc, 140)
    doc.text(splitDesc, contentX, 135, { align: "center" })

    // --- FOOTER SECTION ---

    // Certificate ID
    doc.setFontSize(9)
    doc.setTextColor(156, 163, 175) // Gray - 400
    doc.text(`ID: ${certificateId}`, 20, 205, { align: "left" }) // Bottom Left on Blue (Need white text?)

    // Move ID to right side bottom for visibility or change color if on blue
    doc.setTextColor(deepBlue)
    doc.text(`Certificate ID: ${certificateId}`, 105, 200, { align: "left" }) // Bottom area


    // Signature Line
    const sigY = 180
    doc.setDrawColor(textDark)
    doc.line(210, sigY, 270, sigY)

    doc.setFont("times", "italic")
    doc.setFontSize(14)
    doc.text("Pr. Organizer", 240, sigY - 5, { align: "center" }) // Mock Signature

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text("Authorized Signature", 240, sigY + 5, { align: "center" })


    // Save
    doc.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`)
}
