import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { SymptomAnalysis } from '@/types'

export class MedicalReportPDF {
  private pdf: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 20
    this.currentY = this.margin
  }

  private addHeader() {
    // Medical gradient background for header
    this.pdf.setFillColor(14, 165, 233) // Medical blue
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F')
    
    // White text for header
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(24)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('DHANVANTRI AI - MEDICAL ANALYSIS REPORT', this.pageWidth / 2, 20, { align: 'center' })
    
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text('Confidential Medical Assessment', this.pageWidth / 2, 30, { align: 'center' })
    
    this.currentY = 50
  }

  private addReportInfo() {
    this.pdf.setTextColor(0, 0, 0)
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    this.pdf.text(`Report Generated: ${date}`, this.margin, this.currentY)
    this.pdf.text('Report ID: ' + Math.random().toString(36).substr(2, 9).toUpperCase(), this.margin, this.currentY + 5)
    this.currentY += 20
  }

  private addSection(title: string, color: [number, number, number] = [14, 165, 233]) {
    // Section header with colored background
    this.pdf.setFillColor(color[0], color[1], color[2])
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 8, 'F')
    
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(title, this.margin + 3, this.currentY + 5.5)
    
    this.currentY += 15
    this.pdf.setTextColor(0, 0, 0)
  }

  private addText(text: string, fontSize: number = 10, isBold: boolean = false) {
    this.pdf.setFontSize(fontSize)
    this.pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
    
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin)
    this.pdf.text(lines, this.margin, this.currentY)
    this.currentY += lines.length * (fontSize * 0.35) + 3
  }

  private addSpecialistBox(specialist: string) {
    // Highlighted specialist recommendation box
    this.pdf.setFillColor(240, 249, 255) // Light blue background
    this.pdf.setDrawColor(14, 165, 233) // Blue border
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 20, 'FD')
    
    this.pdf.setTextColor(14, 165, 233)
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('RECOMMENDED SPECIALIST', this.pageWidth / 2, this.currentY + 8, { align: 'center' })
    
    this.pdf.setFontSize(16)
    this.pdf.text(specialist, this.pageWidth / 2, this.currentY + 15, { align: 'center' })
    
    this.currentY += 25
    this.pdf.setTextColor(0, 0, 0)
  }

  private addCondition(condition: any, index: number) {
    const colors = {
      high: [239, 68, 68],    // Red
      medium: [245, 158, 11], // Orange
      low: [34, 197, 94]      // Green
    }
    
    const color = colors[condition.severity as keyof typeof colors] || [107, 114, 128]
    
    // Condition box
    this.pdf.setFillColor(color[0], color[1], color[2])
    this.pdf.rect(this.margin, this.currentY, 5, 8, 'F')
    
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(`${index + 1}. ${condition.name}`, this.margin + 8, this.currentY + 5)
    
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text(`Likelihood: ${condition.likelihood}% | Severity: ${condition.severity.toUpperCase()}`, 
                  this.pageWidth - this.margin - 50, this.currentY + 5, { align: 'right' })
    
    this.currentY += 10
    
    const description = this.pdf.splitTextToSize(condition.description, this.pageWidth - 2 * this.margin - 10)
    this.pdf.text(description, this.margin + 8, this.currentY)
    this.currentY += description.length * 3.5 + 5
  }

  private addConfidenceScore(score: any) {
    this.pdf.setFontSize(11)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(score.condition, this.margin, this.currentY)
    this.pdf.text(`${score.confidence}%`, this.pageWidth - this.margin - 20, this.currentY, { align: 'right' })
    
    // Progress bar
    const barWidth = 60
    const barHeight = 3
    const barX = this.pageWidth - this.margin - barWidth
    
    this.pdf.setFillColor(230, 230, 230)
    this.pdf.rect(barX, this.currentY + 2, barWidth, barHeight, 'F')
    
    const fillWidth = (score.confidence / 100) * barWidth
    const fillColor = score.confidence >= 80 ? [34, 197, 94] : 
                     score.confidence >= 60 ? [245, 158, 11] : [239, 68, 68]
    
    this.pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2])
    this.pdf.rect(barX, this.currentY + 2, fillWidth, barHeight, 'F')
    
    this.currentY += 8
    
    this.pdf.setFontSize(9)
    this.pdf.setFont('helvetica', 'normal')
    const reasoning = this.pdf.splitTextToSize(score.reasoning, this.pageWidth - 2 * this.margin)
    this.pdf.text(reasoning, this.margin, this.currentY)
    this.currentY += reasoning.length * 3 + 5
  }

  private addInsight(insight: any) {
    const icons = {
      red_flags: '[!]',
      lifestyle: '[♥]',
      prevention: '[+]',
      general: '[i]'
    }
    
    this.pdf.setFontSize(11)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(`${icons[insight.category as keyof typeof icons] || icons.general} ${insight.title}`, this.margin, this.currentY)
    this.currentY += 6
    
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    const content = this.pdf.splitTextToSize(insight.content, this.pageWidth - 2 * this.margin)
    this.pdf.text(content, this.margin, this.currentY)
    this.currentY += content.length * 3.5 + 8
  }

  private addFooter() {
    const footerY = this.pageHeight - 20
    
    // Footer line
    this.pdf.setDrawColor(14, 165, 233)
    this.pdf.line(this.margin, footerY, this.pageWidth - this.margin, footerY)
    
    this.pdf.setFontSize(8)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setTextColor(100, 100, 100)
    
    this.pdf.text('This report is generated by AI and is for informational purposes only.', this.margin, footerY + 5)
    this.pdf.text('Please consult with a qualified healthcare provider for proper medical advice.', this.margin, footerY + 10)
    this.pdf.text(`Page 1 of 1 | Generated on ${new Date().toLocaleDateString()}`, 
                  this.pageWidth - this.margin, footerY + 15, { align: 'right' })
  }

  private checkPageBreak(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - 40) {
      this.pdf.addPage()
      this.currentY = this.margin
    }
  }

  public generateReport(analysis: SymptomAnalysis, symptoms: string): string {
    // Header
    this.addHeader()
    this.addReportInfo()
    
    // Symptoms section
    this.addSection('REPORTED SYMPTOMS', [16, 185, 129])
    this.addText(symptoms, 10)
    this.currentY += 5
    
    // Specialist recommendation
    this.checkPageBreak(30)
    this.addSpecialistBox(analysis.recommendedSpecialist)
    
    // Conditions
    this.checkPageBreak(40)
    this.addSection('POSSIBLE CONDITIONS')
    analysis.conditions.forEach((condition, index) => {
      this.checkPageBreak(25)
      this.addCondition(condition, index)
    })
    
    // Confidence scores
    this.checkPageBreak(30)
    this.addSection('CONFIDENCE ANALYSIS', [245, 158, 11])
    analysis.confidenceScores.forEach(score => {
      this.checkPageBreak(15)
      this.addConfidenceScore(score)
    })
    
    // Insights
    this.checkPageBreak(30)
    this.addSection('MEDICAL INSIGHTS', [236, 72, 153])
    analysis.insights.forEach(insight => {
      this.checkPageBreak(20)
      this.addInsight(insight)
    })
    
    // Disclaimer
    this.checkPageBreak(40)
    this.addSection('IMPORTANT DISCLAIMER', [239, 68, 68])
    this.addText('This AI-generated analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this report. If you think you may have a medical emergency, call your doctor or emergency services immediately.', 9)
    
    // Footer
    this.addFooter()
    
    return this.pdf.output('datauristring')
  }

  public downloadReport(analysis: SymptomAnalysis, symptoms: string, filename?: string) {
    this.generateReport(analysis, symptoms)
    const defaultFilename = `Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`
    this.pdf.save(filename || defaultFilename)
  }
}

export const generateMedicalPDF = (analysis: SymptomAnalysis, symptoms: string) => {
  const pdfGenerator = new MedicalReportPDF()
  return pdfGenerator.downloadReport(analysis, symptoms)
}
