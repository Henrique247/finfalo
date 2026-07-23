import jsPDF from 'jspdf';
import { FinancialState, Transaction } from '../types';

/**
 * Utility to generate professional PDF documents for FinFalo
 */

const LOGO_URL = 'https://i.postimg.cc/Y01cWMGN/Fin-Falo.png';

// Helper to load image as base64 for jsPDF
async function getLogoBase64(): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = LOGO_URL;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
  });
}

export async function generateFinancialReportPDF(state: FinancialState, title: string = 'Relatório Financeiro Geral') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const logoBase64 = await getLogoBase64();

  // Primary Header Colors
  const primaryColor = [8, 105, 166]; // #0869A6
  const greenAccent = [81, 166, 41];  // #51a629
  const darkBg = [3, 28, 51];         // #031c33

  // Header Banner
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line
  doc.setFillColor(greenAccent[0], greenAccent[1], greenAccent[2]);
  doc.rect(0, 42, 210, 2, 'F');

  // Draw Logo if loaded, otherwise styled text fallback
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 8, 26, 26);
    } catch (e) {
      console.warn('Could not render logo image in PDF', e);
    }
  }

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FinFalo', logoBase64 ? 45 : 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(81, 166, 41);
  doc.text('FINTECH & GESTÃO FINANCEIRA INTELIGENTE', logoBase64 ? 45 : 14, 26);

  doc.setFontSize(11);
  doc.setTextColor(200, 220, 240);
  doc.text(title.toUpperCase(), 196, 20, { align: 'right' });

  doc.setFontSize(9);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 196, 26, { align: 'right' });

  // Account Context Block
  doc.setFillColor(245, 248, 252);
  doc.rect(14, 50, 182, 28, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.rect(14, 50, 182, 28, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 40, 55);
  doc.text(`Titular: ${state.userName || 'Utilizador FinFalo'}`, 20, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 90, 105);
  doc.text(`Email: ${state.email || 'N/A'}`, 20, 65);
  doc.text(`Tipo de Conta: ${(state.accountType || 'personal').toUpperCase()}`, 20, 71);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(81, 166, 41);
  doc.text(`Score de Saúde: ${state.healthScore || 100}/100`, 190, 58, { align: 'right' });
  doc.setTextColor(8, 105, 166);
  doc.text(`Saldo Atual: ${(state.balance || 0).toLocaleString()} ${state.currency || 'Kz'}`, 190, 65, { align: 'right' });

  // Summary Metrics Grid
  let y = 86;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 40, 55);
  doc.text('Resumo Executivo do Mês', 14, y);

  y += 6;
  // Receitas Box
  doc.setFillColor(235, 248, 240);
  doc.rect(14, y, 58, 20, 'F');
  doc.setFontSize(9);
  doc.setTextColor(40, 120, 70);
  doc.text('TOTAL RECEITAS', 18, y + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`+${(state.incomes || 0).toLocaleString()} ${state.currency}`, 18, y + 14);

  // Despesas Box
  doc.setFillColor(254, 242, 242);
  doc.rect(76, y, 58, 20, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 40, 40);
  doc.text('TOTAL DESPESAS', 80, y + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`-${(state.expenses || 0).toLocaleString()} ${state.currency}`, 80, y + 14);

  // Cofre / Poupança Box
  doc.setFillColor(240, 246, 255);
  doc.rect(138, y, 58, 20, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(8, 105, 166);
  doc.text('SALDO NO COFRE', 142, y + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(state.safeBalance || 0).toLocaleString()} ${state.currency}`, 142, y + 14);

  // Transactions Table
  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 40, 55);
  doc.text('Histórico de Transações Recentes', 14, y);

  y += 6;
  // Table Header
  doc.setFillColor(8, 105, 166);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Data', 18, y + 5.5);
  doc.text('Descrição', 48, y + 5.5);
  doc.text('Categoria', 115, y + 5.5);
  doc.text('Tipo', 155, y + 5.5);
  doc.text('Montante', 192, y + 5.5, { align: 'right' });

  y += 8;
  doc.setFont('helvetica', 'normal');
  const txs = state.transactions || [];

  if (txs.length === 0) {
    doc.setFillColor(250, 250, 250);
    doc.rect(14, y, 182, 10, 'F');
    doc.setTextColor(120, 120, 120);
    doc.text('Nenhuma transação registada até ao momento.', 105, y + 6.5, { align: 'center' });
    y += 10;
  } else {
    txs.slice(0, 18).forEach((tx, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, 182, 8, 'F');
      }
      doc.setFontSize(8.5);
      doc.setTextColor(50, 60, 75);
      doc.text(tx.date || '---', 18, y + 5.5);
      
      const desc = tx.description.length > 32 ? tx.description.substring(0, 30) + '...' : tx.description;
      doc.text(desc, 48, y + 5.5);
      doc.text(tx.category || 'Outros', 115, y + 5.5);

      if (tx.type === 'income') {
        doc.setTextColor(40, 140, 70);
        doc.text('ENTRADA', 155, y + 5.5);
        doc.text(`+${tx.amount.toLocaleString()} ${state.currency}`, 192, y + 5.5, { align: 'right' });
      } else {
        doc.setTextColor(180, 40, 40);
        doc.text('SAÍDA', 155, y + 5.5);
        doc.text(`-${tx.amount.toLocaleString()} ${state.currency}`, 192, y + 5.5, { align: 'right' });
      }

      y += 8;
    });
  }

  // Footer stamp & authentication note
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(240, 244, 248);
  doc.rect(0, pageHeight - 16, 210, 16, 'F');

  doc.setFontSize(8);
  doc.setTextColor(100, 110, 125);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento oficial emitido e autenticado digitalmente pela plataforma FinFalo FinTech.', 14, pageHeight - 8);
  doc.text('Página 1 de 1', 196, pageHeight - 8, { align: 'right' });

  // Save PDF file
  doc.save(`FinFalo_Relatorio_${state.userName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

/**
 * Generate Invoice/Receipt PDF for Companies & Small Businesses
 */
export async function generateInvoicePDF(
  state: FinancialState, 
  invoiceData: {
    invoiceNumber: string;
    clientName: string;
    clientPhone?: string;
    clientEmail?: string;
    items: { description: string; qty: number; unitPrice: number }[];
    taxRate: number; // e.g. 14% IVA
    notes?: string;
  }
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const logoBase64 = await getLogoBase64();

  const primaryColor = [8, 105, 166];
  const greenAccent = [81, 166, 41];
  const darkBg = [3, 28, 51];

  // Top header banner
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setFillColor(greenAccent[0], greenAccent[1], greenAccent[2]);
  doc.rect(0, 42, 210, 2, 'F');

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 8, 26, 26);
    } catch (e) {
      console.warn(e);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(state.userName || 'FinFalo Empresa', logoBase64 ? 45 : 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(81, 166, 41);
  doc.text('FATURA / RECIBO COMERCIAL PROCURADA', logoBase64 ? 45 : 14, 26);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`FATURA Nº ${invoiceData.invoiceNumber}`, 196, 20, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 240);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-PT')}`, 196, 26, { align: 'right' });

  // Issuer & Client Cards
  let y = 52;
  // Issuer
  doc.setFillColor(245, 248, 252);
  doc.rect(14, y, 88, 30, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.rect(14, y, 88, 30, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(8, 105, 166);
  doc.text('EMISSOR:', 18, y + 6);
  doc.setTextColor(30, 40, 55);
  doc.text(state.userName || 'Empresa Lda.', 18, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 90, 105);
  doc.text(`Email: ${state.email || 'contacto@empresa.ao'}`, 18, y + 19);
  doc.text(`Telefone: ${state.userPhone || state.phone || '+244 923 000 000'}`, 18, y + 25);

  // Client
  doc.setFillColor(245, 248, 252);
  doc.rect(108, y, 88, 30, 'F');
  doc.rect(108, y, 88, 30, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(81, 166, 41);
  doc.text('CLIENTE / DESTINATÁRIO:', 112, y + 6);
  doc.setTextColor(30, 40, 55);
  doc.text(invoiceData.clientName || 'Cliente Geral', 112, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 90, 105);
  doc.text(`Email: ${invoiceData.clientEmail || 'N/A'}`, 112, y + 19);
  doc.text(`Telefone: ${invoiceData.clientPhone || 'N/A'}`, 112, y + 25);

  // Items Table
  y += 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 40, 55);
  doc.text('Discriminação dos Serviços / Produtos', 14, y);

  y += 6;
  doc.setFillColor(8, 105, 166);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Descrição do Item', 18, y + 5.5);
  doc.text('Qtd.', 118, y + 5.5, { align: 'center' });
  doc.text('Preço Unit.', 150, y + 5.5, { align: 'right' });
  doc.text('Subtotal', 192, y + 5.5, { align: 'right' });

  y += 8;
  let subtotal = 0;
  doc.setFont('helvetica', 'normal');

  invoiceData.items.forEach((item, index) => {
    const itemSubtotal = item.qty * item.unitPrice;
    subtotal += itemSubtotal;

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 8, 'F');
    }
    doc.setFontSize(8.5);
    doc.setTextColor(50, 60, 75);
    doc.text(item.description, 18, y + 5.5);
    doc.text(item.qty.toString(), 118, y + 5.5, { align: 'center' });
    doc.text(`${item.unitPrice.toLocaleString()} ${state.currency}`, 150, y + 5.5, { align: 'right' });
    doc.text(`${itemSubtotal.toLocaleString()} ${state.currency}`, 192, y + 5.5, { align: 'right' });

    y += 8;
  });

  // Totals Breakdown
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  y += 4;
  doc.setFillColor(245, 248, 252);
  doc.rect(118, y, 78, 28, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.rect(118, y, 78, 28, 'S');

  doc.setFontSize(9);
  doc.setTextColor(80, 90, 105);
  doc.text('Subtotal:', 122, y + 7);
  doc.text(`${subtotal.toLocaleString()} ${state.currency}`, 192, y + 7, { align: 'right' });

  doc.text(`Imposto IVA (${invoiceData.taxRate}%):`, 122, y + 14);
  doc.text(`${taxAmount.toLocaleString()} ${state.currency}`, 192, y + 14, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(81, 166, 41);
  doc.text('TOTAL A PAGAR:', 122, y + 23);
  doc.text(`${totalAmount.toLocaleString()} ${state.currency}`, 192, y + 23, { align: 'right' });

  // Notes
  if (invoiceData.notes) {
    y += 34;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 40, 55);
    doc.text('Observações e Instruções de Pagamento:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 100, 115);
    doc.text(invoiceData.notes, 14, y + 6);
  }

  // Footer stamp
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(240, 244, 248);
  doc.rect(0, pageHeight - 16, 210, 16, 'F');

  doc.setFontSize(8);
  doc.setTextColor(100, 110, 125);
  doc.setFont('helvetica', 'normal');
  doc.text('Fatura processada por programa certificado FinFalo FinTech v2.6.', 14, pageHeight - 8);
  doc.text('Página 1 de 1', 196, pageHeight - 8, { align: 'right' });

  doc.save(`Fatura_${invoiceData.invoiceNumber}_FinFalo.pdf`);
}
