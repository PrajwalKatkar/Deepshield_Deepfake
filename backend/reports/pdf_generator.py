import os
import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from backend.config import REPORTS_DIR, BASE_DIR

def generate_forensic_pdf_report(analysis_data: dict) -> str:
    pdf_filename = f"DeepShield_Forensic_Report_{analysis_data['id']}.pdf"
    pdf_path = REPORTS_DIR / pdf_filename
    
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )
    
    elements = []
    
    # 1. Header Banner
    header_table_data = [
        [
            Paragraph("<b>DEEPSHIELD</b><br/><font size=8 color='#64748B'>AI Media Forensics & Deepfake Detection</font>", title_style),
            Paragraph(f"<b>EVIDENCE ID:</b> {analysis_data['evidence_id']}<br/><b>DATE:</b> {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}<br/><b>STATUS:</b> {analysis_data['risk_level'].upper()}", ParagraphStyle('RightMeta', parent=body_style, alignment=2))
        ]
    ]
    header_table = Table(header_table_data, colWidths=[300, 240])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(header_table)
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0EA5E9'), spaceBefore=2, spaceAfter=15))
    
    # 2. Executive Summary Box
    score = analysis_data['authenticity_score']
    risk = analysis_data['risk_level']
    if score <= 40:
        score_color = colors.HexColor('#EF4444')
    elif score <= 60:
        score_color = colors.HexColor('#F59E0B')
    else:
        score_color = colors.HexColor('#10B981')
        
    summary_data = [
        [
            Paragraph(f"<font size=11 color='#64748B'>OVERALL AUTHENTICITY SCORE</font><br/><font size=28 color='{score_color.hexval()}'><b>{score} / 100</b></font><br/><b>CLASSIFICATION: {risk.upper()}</b>", body_style),
            Paragraph(f"<b>Manipulation Probability:</b> {analysis_data['manipulation_probability']}%<br/>"
                      f"<b>Detection Confidence:</b> {analysis_data['confidence']}<br/>"
                      f"<b>Likely Technique:</b> {analysis_data['likely_technique']} ({analysis_data['technique_confidence']}% conf)<br/>"
                      f"<b>Analysis Engine:</b> DeepShield Ensemble v1.0 ({'DEMO MODE' if analysis_data.get('is_demo') else 'LIVE MODEL'})", body_style)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[240, 300])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 15))
    
    # 3. File & Integrity Attributes
    elements.append(Paragraph("1. File & Forensic Integrity Metadata", section_heading))
    file_info_data = [
        [Paragraph("<b>Filename:</b>", body_style), Paragraph(analysis_data['original_filename'], body_style),
         Paragraph("<b>Media Type:</b>", body_style), Paragraph(analysis_data['media_type'], body_style)],
        [Paragraph("<b>Resolution:</b>", body_style), Paragraph(analysis_data['resolution'], body_style),
         Paragraph("<b>Duration / Size:</b>", body_style), Paragraph(f"{analysis_data['duration_seconds']}s / {analysis_data['file_size_bytes']} bytes", body_style)],
        [Paragraph("<b>Codec:</b>", body_style), Paragraph(analysis_data['codec'], body_style),
         Paragraph("<b>SHA-256 Hash:</b>", body_style), Paragraph(f"<font size=7>{analysis_data['sha256']}</font>", body_style)],
    ]
    file_table = Table(file_info_data, colWidths=[90, 180, 90, 180])
    file_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
    ]))
    elements.append(file_table)
    elements.append(Spacer(1, 15))
    
    # 4. Multi-Model Score Breakdown
    elements.append(Paragraph("2. Multi-Model Detection Breakdown", section_heading))
    scores = analysis_data.get('detector_scores', {})
    model_rows = [
        [Paragraph("<b>Detector Category</b>", body_style), Paragraph("<b>Authenticity Score</b>", body_style), Paragraph("<b>Status</b>", body_style)]
    ]
    for cat_key, cat_name in [("face", "Facial Artifact Detector"), ("temporal", "Temporal Consistency Model"), ("audio", "Audio & Voice Clone Detector"), ("lip_sync", "Lip-Sync Alignment Model"), ("metadata", "Metadata & EXIF Integrity")]:
        sc = scores.get(cat_key, 90.0)
        st = "CRITICAL ANOMALY" if sc < 40 else ("SUSPICIOUS" if sc < 60 else "NOMINAL")
        model_rows.append([
            Paragraph(cat_name, body_style),
            Paragraph(f"{sc}%", body_style),
            Paragraph(f"<font color='{'#EF4444' if sc<40 else ('#F59E0B' if sc<60 else '#10B981')}'><b>{st}</b></font>", body_style)
        ])
    model_table = Table(model_rows, colWidths=[240, 150, 150])
    model_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(model_table)
    elements.append(Spacer(1, 15))
    
    # 5. Explainable AI Forensic Evidence
    elements.append(Paragraph("3. Explainable AI Forensic Findings", section_heading))
    exp_list = analysis_data.get('explanations', [])
    if exp_list:
        for idx, exp in enumerate(exp_list, 1):
            elements.append(Paragraph(f"<b>{idx}. {exp.get('title', 'Forensic Artifact')}</b> (Confidence: {exp.get('confidence', 'High')})", bullet_style))
            elements.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;{exp.get('description', '')}", body_style))
            elements.append(Spacer(1, 4))
    else:
        elements.append(Paragraph("No significant manipulation artifacts were detected across extracted feature vectors.", body_style))
        
    elements.append(Spacer(1, 15))
    
    # 6. Scientific Disclaimer
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=10, spaceAfter=10))
    disclaimer = (
        "<b>FORENSIC DISCLAIMER:</b> This report is generated by the DeepShield AI & Digital Forensics System. "
        "The calculated scores represent probabilistic statistical estimates produced by ensemble neural network detectors and heuristic feature extractors. "
        "These results are designed for digital forensic investigation assistance and should not be treated as absolute legal proof without independent expert human verification."
    )
    elements.append(Paragraph(disclaimer, ParagraphStyle('Disclaimer', parent=body_style, fontSize=7, leading=9, textColor=colors.HexColor('#64748B'))))
    
    doc.build(elements)
    return f"/static/reports/{pdf_filename}"
