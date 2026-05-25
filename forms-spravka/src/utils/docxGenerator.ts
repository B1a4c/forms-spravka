import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, UnderlineType } from "docx";
import { calculateDays, formatRussianDate, getDaysPluralWords, getLeaveTypeClause, getLaborCodeArticle } from "./textUtils";
import { ReferenceCallData } from "../types";

export async function generateDocx(data: ReferenceCallData): Promise<Blob> {
  const daysNum = calculateDays(data.startDate, data.endDate);
  const daysFormatted = getDaysPluralWords(daysNum);
  const startDateFormatted = formatRussianDate(data.startDate);
  const endDateFormatted = formatRussianDate(data.endDate);
  const issueDateFormatted = formatRussianDate(data.issueDate);
  const articleStr = getLaborCodeArticle(data.educationLevel);
  const leaveClause = getLeaveTypeClause(data.leaveType);

  // Define Times New Roman throughout the document for authenticity
  const defaultFont = "Times New Roman";

  // Top info note (official document order source)
  const appNote = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: "Приложение № 1\nк приказу Министерства образования и науки\nРоссийской Федерации\nот 18 декабря 2013 г. № 1368",
        font: defaultFont,
        size: 16, // 8pt
        italics: true,
      })
    ]
  });

  // Stamp block - we can place this in a full-width layout using a borderless table
  const topTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: data.universityFullTitle, font: defaultFont, size: 16, bold: true }),
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 60 },
                children: [
                  new TextRun({ 
                    text: `Исх. № ${data.referenceNumber}\nот ${issueDateFormatted}\n\n${data.accreditationInfo}`, 
                    font: defaultFont, 
                    size: 14, 
                    italics: true 
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // Title section
  const titleP = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 60 },
    children: [
      new TextRun({ text: "СПРАВКА-ВЫЗОВ", font: defaultFont, size: 24, bold: true }),
    ]
  });

  const refNumberP = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 180 },
    children: [
      new TextRun({ text: `серия ________ № ${data.referenceNumber}`, font: defaultFont, size: 20, bold: true })
    ]
  });

  // Document body paragraphs
  const bodyParagraphs = [
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 280, after: 120 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({ text: "Выдана ", font: defaultFont, size: 24 }),
        new TextRun({ text: data.studentName, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` в том, что он (она) успешно обучается на `, font: defaultFont, size: 24 }),
        new TextRun({ text: `${data.course}-м`, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: " курсе по ", font: defaultFont, size: 24 }),
        new TextRun({ text: `${data.studyForm} форме`, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` обучения в `, font: defaultFont, size: 24 }),
        new TextRun({ text: data.universityFullTitle, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` по образовательной программе уровня `, font: defaultFont, size: 24 }),
        new TextRun({ text: data.educationLevel, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: `, по направлению подготовки (специальности) `, font: defaultFont, size: 24 }),
        new TextRun({ text: data.educationProgram, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: `.`, font: defaultFont, size: 24 }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 280, after: 240 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({ text: `На основании `, font: defaultFont, size: 24 }),
        new TextRun({ text: articleStr, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` Трудового кодекса Российской Федерации предоставляется дополнительный отпуск с сохранением среднего заработка (учебный отпуск) для `, font: defaultFont, size: 24 }),
        new TextRun({ text: leaveClause, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` продолжительностью `, font: defaultFont, size: 24 }),
        new TextRun({ text: daysFormatted, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` с `, font: defaultFont, size: 24 }),
        new TextRun({ text: startDateFormatted, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: ` по `, font: defaultFont, size: 24 }),
        new TextRun({ text: endDateFormatted, font: defaultFont, size: 24, bold: true }),
        new TextRun({ text: `.`, font: defaultFont, size: 24 })
      ]
    })
  ];

  // Signatory block
  const signatoryP = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 240, after: 480 },
    children: [
      new TextRun({ text: `${data.signatoryTitle}: `, font: defaultFont, size: 20, bold: true }),
      new TextRun({ text: "   _______________________   / ", font: defaultFont, size: 20 }),
      new TextRun({ text: data.signatoryName, font: defaultFont, size: 20, bold: true }),
    ]
  });

  const sealPlaceholderP = new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 360 },
    children: [
      new TextRun({ text: "М.П.", font: defaultFont, size: 16, bold: true, italics: true })
    ]
  });

  const sectionChildren = [
    appNote,
    topTable,
    titleP,
    refNumberP,
    ...bodyParagraphs,
    signatoryP,
    sealPlaceholderP
  ];

  // Optional detachable confirmation form
  if (data.includeConfirmation) {
    const dividerP = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({ text: "- - - - - - - - - - - - - - - - - - - Линия отреза - - - - - - - - - - - - - - - - - - -", font: defaultFont, size: 14, italics: true })
      ]
    });

    const confTitleP = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "СПРАВКА-ПОДТВЕРЖДЕНИЕ", font: defaultFont, size: 22, bold: true })
      ]
    });

    const confBodyP = new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 280, after: 240 },
      indent: { firstLine: 480 },
      children: [
        new TextRun({ text: "Выдана работодателю: ", font: defaultFont, size: 22 }),
        new TextRun({ text: data.employerName, font: defaultFont, size: 22, bold: true }),
        new TextRun({ text: " в том, что студент ", font: defaultFont, size: 22 }),
        new TextRun({ text: data.studentName, font: defaultFont, size: 22, bold: true }),
        new TextRun({ text: " действительно находился (находилась) в учебном заведении ", font: defaultFont, size: 22 }),
        new TextRun({ text: data.universityName, font: defaultFont, size: 22, bold: true }),
        new TextRun({ text: " в период с ", font: defaultFont, size: 22 }),
        new TextRun({ text: formatRussianDate(data.confirmationStartDate), font: defaultFont, size: 22, bold: true }),
        new TextRun({ text: " по ", font: defaultFont, size: 22 }),
        new TextRun({ text: formatRussianDate(data.confirmationEndDate), font: defaultFont, size: 22, bold: true }),
        new TextRun({ text: " в связи с выполнением учебного плана.", font: defaultFont, size: 22 }),
      ]
    });

    const confSignatoryP = new Paragraph({
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({ text: `${data.signatoryTitle}: `, font: defaultFont, size: 20, bold: true }),
        new TextRun({ text: "   _______________________   / ", font: defaultFont, size: 20 }),
        new TextRun({ text: data.signatoryName, font: defaultFont, size: 20, bold: true }),
      ]
    });

    sectionChildren.push(dividerP, confTitleP, confBodyP, confSignatoryP, sealPlaceholderP);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sectionChildren,
      }
    ],
  });

  return await Packer.toBlob(doc);
}
