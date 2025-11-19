"""
PDF Generator for Career Recommendations
Premium design with professional styling and visual appeal
"""
from datetime import datetime
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.flowables import HRFlowable


class NumberedCanvas(canvas.Canvas):
    """Custom canvas for page numbers and header/footer"""
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        page_count = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_page_number(page_count)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor('#94A3B8'))
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(7.5 * inch, 0.5 * inch, page_text)
        self.restoreState()


def generate_recommendation_pdf(recommendation, student):
    """
    Generate a premium, visually stunning PDF for career recommendation
    
    Args:
        recommendation: CareerRecommendation instance
        student: User instance (student)
    
    Returns:
        BytesIO buffer containing PDF data
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        topMargin=0.6 * inch,
        bottomMargin=0.6 * inch,
    )
    
    # Use custom canvas for page numbers
    doc.canvmaker = NumberedCanvas
    
    elements = []
    styles = getSampleStyleSheet()
    
    # ========== PREMIUM TYPOGRAPHY STYLES ==========
    
    # Hero Title Style - Large, bold, elegant
    hero_title_style = ParagraphStyle(
        'HeroTitle',
        parent=styles['Heading1'],
        fontSize=42,
        textColor=colors.HexColor('#0F172A'),  # Deep slate
        spaceAfter=8,
        alignment=1,  # Center
        fontName='Helvetica-Bold',
        leading=48,
    )
    
    # Subtitle Style - Elegant and refined
    hero_subtitle_style = ParagraphStyle(
        'HeroSubtitle',
        parent=styles['Normal'],
        fontSize=13,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=40,
        alignment=1,
        fontName='Helvetica',
        letterSpacing=2,
        textTransform='uppercase',
    )
    
    # Section Title - Bold and prominent
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=20,
        spaceBefore=30,
        fontName='Helvetica-Bold',
        leading=28,
    )
    
    # Career Name - Large, impactful
    career_name_style = ParagraphStyle(
        'CareerName',
        parent=styles['Heading1'],
        fontSize=36,
        textColor=colors.HexColor('#4F46E5'),  # Brand indigo
        spaceAfter=25,
        fontName='Helvetica-Bold',
        leading=42,
        alignment=1,
    )
    
    # Subsection Header
    subsection_style = ParagraphStyle(
        'Subsection',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#334155'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold',
        leading=20,
    )
    
    # Body Text - Readable and elegant
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14,
        leading=18,
        fontName='Helvetica',
        alignment=4,  # Justify
    )
    
    # Info Label Style
    label_style = ParagraphStyle(
        'Label',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=4,
        fontName='Helvetica',
        textTransform='uppercase',
        letterSpacing=1,
    )
    
    # Info Value Style
    value_style = ParagraphStyle(
        'Value',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=16,
        fontName='Helvetica-Bold',
        leading=16,
    )
    
    # Step Number Style
    step_number_style = ParagraphStyle(
        'StepNumber',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.white,
        fontName='Helvetica-Bold',
        alignment=1,
    )
    
    # Step Title Style
    step_title_style = ParagraphStyle(
        'StepTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=8,
        fontName='Helvetica-Bold',
        leading=20,
    )
    
    # Step Description Style
    step_desc_style = ParagraphStyle(
        'StepDesc',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=0,
        leading=16,
        fontName='Helvetica',
    )
    
    # Footer Style
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#94A3B8'),
        alignment=1,
        fontName='Helvetica-Oblique',
    )
    
    # ========== PREMIUM HEADER DESIGN ==========
    
    # Decorative top border
    top_border = Table(
        [[Paragraph('', ParagraphStyle('Empty', fontSize=1))]],
        colWidths=[7 * inch],
        rowHeights=[0.15 * inch]
    )
    top_border.setStyle(
        TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#4F46E5')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ])
    )
    elements.append(top_border)
    elements.append(Spacer(1, 0.4 * inch))
    
    # Hero Section with elegant typography
    hero_data = [
        [Paragraph('CAREERPATH', hero_subtitle_style)],
        [Paragraph('Career Recommendation Report', hero_title_style)],
    ]
    hero_table = Table(hero_data, colWidths=[7 * inch])
    hero_table.setStyle(
        TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
        ])
    )
    elements.append(hero_table)
    elements.append(Spacer(1, 0.5 * inch))
    
    # ========== STUDENT INFORMATION CARD ==========
    
    student_name = student.get_full_name() or student.email.split('@')[0].title()
    
    # Elegant info card with modern design
    student_card_data = [
        [
            Paragraph('STUDENT INFORMATION', label_style),
            '',
        ],
        [
            Paragraph('Full Name', label_style),
            Paragraph(student_name, value_style),
        ],
        [
            Paragraph('Email Address', label_style),
            Paragraph(student.email, value_style),
        ],
    ]
    
    if student.qualification:
        student_card_data.append([
            Paragraph('Qualification', label_style),
            Paragraph(student.qualification, value_style),
        ])
    
    student_card_data.append([
        Paragraph('Report Generated', label_style),
        Paragraph(
            datetime.now().strftime("%B %d, %Y"),
            value_style
        ),
    ])
    
    student_card = Table(student_card_data, colWidths=[2.2 * inch, 4.8 * inch])
    student_card.setStyle(
        TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 14),
            ('TOPPADDING', (0, 0), (-1, 0), 14),
            ('LEFTPADDING', (0, 0), (-1, 0), 20),
            ('RIGHTPADDING', (0, 0), (-1, 0), 20),
            # Data rows
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#F8FAFC')),
            ('BACKGROUND', (1, 1), (1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#0F172A')),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 1), (-1, -1), 20),
            ('RIGHTPADDING', (0, 1), (-1, -1), 20),
            ('TOPPADDING', (0, 1), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
            # Borders
            ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor('#E2E8F0')),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#4F46E5')),
            ('LINEBELOW', (0, 1), (-1, -2), 0.5, colors.HexColor('#F1F5F9')),
        ])
    )
    elements.append(student_card)
    elements.append(Spacer(1, 0.5 * inch))
    
    # ========== CAREER RECOMMENDATION HERO SECTION ==========
    
    # Decorative divider
    divider = HRFlowable(
        width="100%",
        thickness=1,
        color=colors.HexColor('#E2E8F0'),
        spaceBefore=10,
        spaceAfter=30,
    )
    elements.append(divider)
    
    # Career name in a premium card
    career_hero_data = [
        [Paragraph('YOUR RECOMMENDED CAREER', hero_subtitle_style)],
        [Paragraph(recommendation.career_name.upper(), career_name_style)],
    ]
    career_hero_table = Table(career_hero_data, colWidths=[7 * inch])
    career_hero_table.setStyle(
        TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8FAFC')),
            ('LEFTPADDING', (0, 0), (-1, -1), 30),
            ('RIGHTPADDING', (0, 0), (-1, -1), 30),
            ('TOPPADDING', (0, 1), (-1, -1), 25),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 25),
            ('BOX', (0, 0), (-1, -1), 0, colors.HexColor('#E2E8F0')),
        ])
    )
    elements.append(career_hero_table)
    elements.append(Spacer(1, 0.4 * inch))
    
    # ========== WHY THIS CAREER SECTION ==========
    
    why_section_data = [
        [
            Paragraph('WHY THIS CAREER?', subsection_style),
        ],
        [
            Paragraph(recommendation.summary, body_style),
        ],
    ]
    why_section_table = Table(why_section_data, colWidths=[7 * inch])
    why_section_table.setStyle(
        TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFFFFF')),
            ('LEFTPADDING', (0, 0), (-1, -1), 25),
            ('RIGHTPADDING', (0, 0), (-1, -1), 25),
            ('TOPPADDING', (0, 0), (-1, -1), 20),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 25),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
            ('LINEBELOW', (0, 0), (-1, 0), 3, colors.HexColor('#4F46E5')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F8FAFC')),
        ])
    )
    elements.append(why_section_table)
    elements.append(Spacer(1, 0.5 * inch))
    
    # ========== ROADMAP SECTION ==========
    
    steps = recommendation.steps.all().order_by('order')
    if steps:
        # Section header
        roadmap_header = Paragraph('YOUR CAREER ROADMAP', section_title_style)
        elements.append(roadmap_header)
        elements.append(Spacer(1, 0.3 * inch))
        
        for idx, step in enumerate(steps, 1):
            # Premium step card design
            step_number_cell = Table(
                [[Paragraph(str(step.order), step_number_style)]],
                colWidths=[0.8 * inch],
                rowHeights=[0.8 * inch]
            )
            step_number_cell.setStyle(
                TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#4F46E5')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('BOX', (0, 0), (-1, -1), 0, colors.HexColor('#4F46E5')),
                ])
            )
            
            step_content_data = [
                [Paragraph(step.title, step_title_style)],
            ]
            if step.description:
                step_content_data.append([
                    Paragraph(step.description, step_desc_style)
                ])
            
            step_content = Table(step_content_data, colWidths=[6.2 * inch])
            step_content.setStyle(
                TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 20),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 20),
                    ('TOPPADDING', (0, 0), (-1, -1), 15),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
                ])
            )
            
            # Combine number and content
            step_row_data = [
                [step_number_cell, step_content]
            ]
            step_row = Table(step_row_data, colWidths=[0.8 * inch, 6.2 * inch])
            step_row.setStyle(
                TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('BACKGROUND', (1, 0), (1, -1), colors.white),
                    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
                    ('LINELEFT', (1, 0), (1, -1), 2, colors.HexColor('#4F46E5')),
                ])
            )
            
            elements.append(step_row)
            
            # Add elegant connector between steps
            if idx < len(steps):
                elements.append(Spacer(1, 0.15 * inch))
                # Vertical connector line
                connector = Table(
                    [[Paragraph('', ParagraphStyle('Empty', fontSize=1))]],
                    colWidths=[0.4 * inch],
                    rowHeights=[0.3 * inch]
                )
                connector.setStyle(
                    TableStyle([
                        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#4F46E5')),
                        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ])
                )
                elements.append(connector)
                elements.append(Spacer(1, 0.15 * inch))
    
    elements.append(Spacer(1, 0.4 * inch))
    
    # ========== PREMIUM FOOTER ==========
    
    footer_divider = HRFlowable(
        width="100%",
        thickness=0.5,
        color=colors.HexColor('#E2E8F0'),
        spaceBefore=20,
        spaceAfter=15,
    )
    elements.append(footer_divider)
    
    footer_text = f"Generated by CareerPath • {datetime.now().strftime('%B %d, %Y at %I:%M %p')} • Confidential Career Guidance Document"
    footer = Paragraph(footer_text, footer_style)
    elements.append(footer)
    elements.append(Spacer(1, 0.2 * inch))
    
    # ========== BUILD PDF ==========
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
