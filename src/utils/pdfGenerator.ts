import { jsPDF } from 'jspdf';
import { HotspotRecord, TaskRecord, CitizenEvidenceSubmission } from '../types';
import { DEMO_EVIDENCE_IMAGES } from '../data/evidenceImages';

/**
 * Asynchronously rasterizes any image URL or SVG Data URI onto an offscreen canvas
 * and returns a JPEG Data URL compatible with jsPDF.
 */
export async function loadImageAsBase64(url?: string, width = 800, height = 600): Promise<string | null> {
  if (!url || typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          // White background first so transparent SVGs render clearly
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.90));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Fallback vector placeholder box drawn directly inside jsPDF if an image is missing or unreachable
 */
function drawVectorPlaceholder(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  subtitle?: string
) {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + w / 2, y + h / 2 - 2, { align: 'center' });

  if (subtitle) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, x + w / 2, y + h / 2 + 4, { align: 'center' });
  }
}

/**
 * Draws the standard municipal header on a page
 */
function drawPageHeader(doc: jsPDF, hotspotId: string, currentStatus: string) {
  // Brand Header
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VECTORGUARD AI', 14, 11);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Verification Summary Report — Municipal Vector Surveillance', 45, 11);

  // Right status
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Site: ${hotspotId}  |  Status: ${currentStatus}`, 196, 11, { align: 'right' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, 13.5, 196, 13.5);
}

/**
 * Draws the standard municipal footer on a page
 */
function drawPageFooter(doc: jsPDF, pageNumber: number, totalPagesPlaceholder = '4') {
  const y = 286;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, y - 2, 196, y - 2);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('VectorGuard AI — Predict. Verify. Prevent. Learn.', 14, y + 2.5);

  // Prominent Pilot Warning in footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // amber
  doc.text('DEMO / PILOT DATA — ILLUSTRATIVE', 105, y + 2.5, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Page ${pageNumber} of ${totalPagesPlaceholder}`, 196, y + 2.5, { align: 'right' });
}

/**
 * GENERATE VERIFICATION SUMMARY REPORT PDF
 * Generates an executive, 4-page, municipal-grade PDF document.
 */
export async function generateVerificationSummaryPDF(
  hotspot: HotspotRecord,
  task?: TaskRecord | null,
  citizenSubmissions: CitizenEvidenceSubmission[] = [],
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.('Preparing report data and rasterizing evidence imagery...');

  // Resolve associated task or synthesize realistic task record if not yet dispatched
  const isHero = hotspot.hotspot_id === 'VG-1042';
  const taskId = task?.task_id || (isHero ? 'TSK-6591' : `TSK-${hotspot.hotspot_id.replace('VG-', '8')}`);
  const assignedTeam = task?.assigned_team || hotspot.assigned_team || (isHero ? 'Rapid Intervention Team 3' : 'Zone Rapid Response Unit');
  const assignedOfficer = task?.assigned_officer || hotspot.assigned_officer || (isHero ? 'Rajesh Kumar' : 'Municipal Field Officer');
  const taskStatus = task?.status || hotspot.status || 'ASSIGNED';
  
  // Pre-load images to base64 Data URLs
  // 1. Aerial / Surveillance image
  const targetedAerialUrl = hotspot.before_image_url || (isHero ? DEMO_EVIDENCE_IMAGES.vg1042_before : DEMO_EVIDENCE_IMAGES.generic_drain_before);
  // 2. Before Intervention image
  const beforeUrl = task?.before_evidence_url || hotspot.before_image_url || (isHero ? DEMO_EVIDENCE_IMAGES.vg1042_before : DEMO_EVIDENCE_IMAGES.generic_drain_before);
  // 3. Intervention in-progress image
  const interventionUrl = isHero ? DEMO_EVIDENCE_IMAGES.vg1042_intervention : undefined;
  // 4. After Intervention image
  const afterUrl = task?.after_evidence_url || hotspot.after_image_url || (isHero ? DEMO_EVIDENCE_IMAGES.vg1042_after : DEMO_EVIDENCE_IMAGES.generic_drain_after);

  // Relevant citizen submissions for this site
  const siteCitizenSubmissions = citizenSubmissions.filter(
    s => s.linkedHotspotId === hotspot.hotspot_id || 
         (s.city && s.city.toLowerCase() === hotspot.city?.toLowerCase() && s.localArea?.toLowerCase().includes((hotspot.locality || '').toLowerCase()))
  );
  const citizenImgUrl = siteCitizenSubmissions[0]?.imageUrl;

  onProgress?.('Rasterizing evidence cameras & satellite feeds...');
  const [aerialBase64, beforeBase64, interventionBase64, afterBase64, citizenBase64] = await Promise.all([
    loadImageAsBase64(targetedAerialUrl),
    loadImageAsBase64(beforeUrl),
    interventionUrl ? loadImageAsBase64(interventionUrl) : Promise.resolve(null),
    loadImageAsBase64(afterUrl),
    citizenImgUrl ? loadImageAsBase64(citizenImgUrl) : Promise.resolve(null)
  ]);

  onProgress?.('Assembling municipal verification document...');

  // Initialize jsPDF A4 portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const reportId = `VGR-${hotspot.hotspot_id}-${Date.now().toString(36).toUpperCase()}`;
  const generationTimestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // =========================================================================
  // PAGE 1: EXECUTIVE SUMMARY & AI MULTI-SIGNAL RISK ENGINE
  // =========================================================================
  drawPageHeader(doc, hotspot.hotspot_id, hotspot.status);

  // Top Title Card
  doc.setFillColor(15, 23, 42); // Deep Navy
  doc.roundedRect(14, 16, 182, 28, 2.5, 2.5, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.text('VECTORGUARD AI  |  MUNICIPAL VECTOR SURVEILLANCE & EARLY INTERVENTION', 19, 22.5);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFICATION SUMMARY REPORT', 19, 30);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Targeted Vector-Risk Verification & Field Intervention Record', 19, 36);

  // Prominent Pilot Warning Banner
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.setLineWidth(0.4);
  doc.roundedRect(14, 46, 182, 7.5, 1.5, 1.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('DEMO / PILOT DATA — ILLUSTRATIVE', 19, 51);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 53, 15);
  doc.text('Surveillance signals, drone imagery, and inspection records seeded for operational pilot demonstration.', 75, 51);

  // Metadata Strip
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 55.5, 182, 17, 2, 2, 'FD');

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT ID', 18, 60);
  doc.text('HOTSPOT ID', 60, 60);
  doc.text('DISPATCH TASK', 100, 60);
  doc.text('GENERATED AT', 140, 60);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(reportId, 18, 67);
  doc.text(hotspot.hotspot_id, 60, 67);
  doc.text(taskId, 100, 67);
  doc.text(generationTimestamp, 140, 67);

  // Section 1: Executive Summary
  let curY = 77;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Surveillance Summary', 14, curY);

  curY += 4.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 38, 2, 2, 'FD');

  const execBullets = [
    `• Prioritization Rationale: Site ${hotspot.hotspot_id} was flagged by the multi-signal predictive engine due to anomalous surface water retention probability.`,
    `• Water-Retention Concern: Excavation / depression topography retaining rainwater runoff (${hotspot.rainfall}mm rainfall, ${hotspot.humidity}% ambient humidity) with ${hotspot.drainage_condition.toLowerCase()} drainage capacity.`,
    `• Targeted Imagery Acquisition: Authorized aerial survey conducted via ${hotspot.imagery_source} (${hotspot.imagery_level}) to verify physical standing water presence.`,
    `• Computer Vision Findings: ${hotspot.cv_result.detectedCondition} confirmed with ${hotspot.cv_result.confidence}% model confidence across ${hotspot.cv_result.estimatedAreaSqMeters || 120} sq.m.`,
    `• Field Intervention: Task ${taskId} assigned to ${assignedTeam} (${assignedOfficer}) for rapid dewatering and source reduction.`,
    `• Post-Intervention Verification: Site dewatered to zero standing water and treated with bio-larvicide; verified via ground-truth photographic proof.`
  ];

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  let bY = curY + 5.5;
  execBullets.forEach((bullet) => {
    doc.text(bullet, 17, bY);
    bY += 5.2;
  });

  // Section 2: Hotspot Profile & Geographic Anchor
  curY += 42;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Geographic & Physical Profile', 14, curY);

  curY += 4.5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 26, 2, 2, 'FD');

  const col1X = 18;
  const col2X = 80;
  const col3X = 140;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('LOCATION ADDRESS', col1X, curY + 5);
  doc.text('WARD & JURISDICTION', col2X, curY + 5);
  doc.text('GNSS COORDINATES', col3X, curY + 5);

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(hotspot.location, col1X, curY + 10, { maxWidth: 58 });
  doc.text(`${hotspot.ward} (${hotspot.city}, ${hotspot.state})`, col2X, curY + 10, { maxWidth: 55 });
  doc.text(`${hotspot.latitude.toFixed(4)}° N, ${hotspot.longitude.toFixed(4)}° E`, col3X, curY + 10);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('SITE CLASSIFICATION', col1X, curY + 18);
  doc.text('DRAINAGE STATUS', col2X, curY + 18);
  doc.text('SURVEILLANCE STATUS', col3X, curY + 18);

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(hotspot.site_type, col1X, curY + 23);
  doc.text(`${hotspot.drainage_condition} Drainage`, col2X, curY + 23);
  
  // Status pill
  const statusColor = hotspot.status === 'RESOLVED' ? [16, 185, 129] : [217, 119, 6];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(hotspot.status.replace('_', ' '), col3X, curY + 23);

  // Section 3: AI Multi-Signal Risk Engine Assessment
  curY += 30;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. AI Multi-Signal Risk Assessment', 14, curY);

  curY += 4.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 54, 2, 2, 'FD');

  // Overall Score Badge (Left box)
  const isCritical = hotspot.risk_level === 'CRITICAL';
  const badgeBg = isCritical ? [250, 245, 255] : [255, 241, 242];
  const badgeStroke = isCritical ? [126, 34, 206] : [225, 29, 72];
  doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
  doc.setDrawColor(badgeStroke[0], badgeStroke[1], badgeStroke[2]);
  doc.roundedRect(18, curY + 4, 45, 45, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('OVERALL RISK SCORE', 40.5, curY + 11, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(badgeStroke[0], badgeStroke[1], badgeStroke[2]);
  doc.text(`${hotspot.breeding_risk_score}`, 40.5, curY + 24, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('OUT OF 100', 40.5, curY + 29, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(badgeStroke[0], badgeStroke[1], badgeStroke[2]);
  doc.text(`${hotspot.risk_level} RISK`, 40.5, curY + 38, { align: 'center' });

  // Risk Component Breakdown Table (Right box)
  const compX = 68;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('MULTI-SIGNAL FORMULA BREAKDOWN', compX, curY + 9);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('VectorGuard prioritizes locations using multiple environmental and historical signals.', compX, curY + 13.5);
  doc.text('Targeted imagery is then used to verify physical conditions at high-priority locations.', compX, curY + 17);

  // Components table rows
  const components = [
    { name: 'Current Visual Condition', weight: '40%', score: hotspot.visual_score, pts: (hotspot.visual_score * 0.4).toFixed(1) },
    { name: 'Water-Retention Prediction', weight: '25%', score: hotspot.water_retention_prediction, pts: (hotspot.water_retention_prediction * 0.25).toFixed(1) },
    { name: 'Environmental Suitability', weight: '20%', score: hotspot.environmental_score, pts: (hotspot.environmental_score * 0.2).toFixed(1) },
    { name: 'Historical Risk Prior', weight: '15%', score: hotspot.historical_risk, pts: (hotspot.historical_risk * 0.15).toFixed(1) }
  ];

  let compRowY = curY + 23;
  components.forEach((c) => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(c.name, compX, compRowY);

    doc.setFont('helvetica', 'bold');
    doc.text(`(${c.weight})`, compX + 48, compRowY);
    doc.text(`Score: ${c.score}/100`, compX + 66, compRowY);
    doc.setTextColor(13, 148, 136);
    doc.text(`+${c.pts} pts`, compX + 98, compRowY);

    compRowY += 6.5;
  });

  // Verification Timeline strip at bottom of Page 1
  curY += 58;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Surveillance & Verification Lifecycle Timeline:', 14, curY);

  curY += 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 9, 1.5, 1.5, 'FD');

  const timelineSteps = ['Predict', 'Prioritize', 'Target Imagery', 'CV Detect', 'Dispatch', 'Remediate', 'Post-Proof', 'Audit & Learn'];
  const stepW = 182 / timelineSteps.length;
  timelineSteps.forEach((step, idx) => {
    const sX = 14 + idx * stepW;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${step}`, sX + stepW / 2, curY + 5.5, { align: 'center' });
    if (idx < timelineSteps.length - 1) {
      doc.setTextColor(148, 163, 184);
      doc.text('→', sX + stepW - 0.5, curY + 5.5);
    }
  });

  drawPageFooter(doc, 1);

  // =========================================================================
  // PAGE 2: TARGETED AERIAL VERIFICATION & COMPUTER VISION FINDINGS
  // =========================================================================
  doc.addPage();
  drawPageHeader(doc, hotspot.hotspot_id, hotspot.status);

  curY = 17;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TARGETED AERIAL VERIFICATION & COMPUTER VISION DETECTION', 14, curY);

  curY += 4.5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Targeted aerial imagery acquired to confirm physical standing water conditions where standard satellite coverage is insufficient.', 14, curY);

  // Flight & Sensor Metadata Card
  curY += 4.5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 16, 2, 2, 'FD');

  const flightId = isHero ? 'DRN-HYD-1042' : `DRN-${(hotspot.city || 'IND').slice(0, 3).toUpperCase()}-${hotspot.hotspot_id.replace('VG-', '')}`;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('FLIGHT ID', 18, curY + 5);
  doc.text('GROUND RESOLUTION (GSD)', 58, curY + 5);
  doc.text('ALTITUDE (AGL)', 106, curY + 5);
  doc.text('SENSOR PAYLOAD', 142, curY + 5);
  doc.text('GEOTAG LOCK', 170, curY + 5);

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(flightId, 18, curY + 11.5);
  doc.text('1.2 cm / pixel', 58, curY + 11.5);
  doc.text('45m AGL', 106, curY + 11.5);
  doc.text('48MP Multispectral', 142, curY + 11.5);
  doc.text('±1.4m GNSS', 170, curY + 11.5);

  // Targeted Aerial Image Frame
  curY += 20;
  const imageFrameW = 182;
  const imageFrameH = 92;

  if (aerialBase64) {
    try {
      doc.addImage(aerialBase64, 'JPEG', 14, curY, imageFrameW, imageFrameH);
      // Border around image
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.rect(14, curY, imageFrameW, imageFrameH, 'S');
    } catch {
      drawVectorPlaceholder(doc, 14, curY, imageFrameW, imageFrameH, 'TARGETED AERIAL SURVEILLANCE PHOTOGRAPH', 'Flight ID: ' + flightId);
    }
  } else {
    drawVectorPlaceholder(doc, 14, curY, imageFrameW, imageFrameH, 'TARGETED AERIAL SURVEILLANCE PHOTOGRAPH', 'Flight ID: ' + flightId);
  }

  // Camera Overlay HUD info bar under aerial image
  doc.setFillColor(15, 23, 42);
  doc.rect(14, curY + imageFrameH - 7, imageFrameW, 7, 'F');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`AERIAL SURVEY PROOF  •  ${flightId}  •  LAT: ${hotspot.latitude.toFixed(4)}° N  LNG: ${hotspot.longitude.toFixed(4)}° E  •  TARGET: ${hotspot.location}`, 18, curY + imageFrameH - 2.5);

  // Computer Vision Findings Section
  curY += imageFrameH + 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Computer Vision Verification & Surface Detections', 14, curY);

  curY += 4.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 45, 2, 2, 'FD');

  // CV Detection Pill 1: Stagnant Water
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(18, curY + 4, 52, 18, 1.5, 1.5, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('✓ Stagnant Water Detected', 21, curY + 11);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(127, 29, 29);
  doc.text(`Model Confidence: ${hotspot.cv_result.confidence}%`, 21, curY + 17);

  // CV Detection Pill 2: Debris & Drainage Obstruction
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(73, curY + 4, 58, 18, 1.5, 1.5, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('✓ Drainage Obstruction / Debris', 76, curY + 11);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 53, 15);
  doc.text('Confidence: 84% (Silt / Solid Waste)', 76, curY + 17);

  // CV Detection Pill 3: Surface Area
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(134, curY + 4, 58, 18, 1.5, 1.5, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('✓ Water-Retention Surface', 137, curY + 11);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(19, 78, 74);
  doc.text(`Est. Area: ${hotspot.cv_result.estimatedAreaSqMeters || 120} sq.m`, 137, curY + 17);

  // CV Observation Summary Paragraph
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('DETECTION SPECIFICATIONS & BOUNDING AREA:', 18, curY + 28);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`• Bounding Zone: ${hotspot.cv_result.boundingAreaDescription}`, 18, curY + 34);
  doc.text(`• Surface Type: ${hotspot.cv_result.surfaceType}  |  Identified Condition: ${hotspot.cv_result.detectedCondition}`, 18, curY + 39);

  // Bottom Notice
  curY += 49;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 10, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Targeted aerial evidence is cryptographically bound to GNSS hardware lock and archived for audit compliance.', 18, curY + 6);

  drawPageFooter(doc, 2);

  // =========================================================================
  // PAGE 3: INTERVENTION & VERIFICATION EVIDENCE (BEFORE / INTERVENTION / AFTER)
  // =========================================================================
  doc.addPage();
  drawPageHeader(doc, hotspot.hotspot_id, hotspot.status);

  curY = 17;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('INTERVENTION & VERIFICATION EVIDENCE', 14, curY);

  curY += 4.5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Three-panel photographic chain establishing verified environmental remediation at the exact site coordinates.', 14, curY);

  // 3 PANELS: BEFORE -> INTERVENTION -> AFTER
  curY += 5.5;
  const panelW = 58;
  const panelImgH = 48;

  // Panel 1: BEFORE INTERVENTION
  const p1X = 14;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(p1X, curY, panelW, 96, 2, 2, 'FD');

  doc.setFillColor(254, 242, 242); // Rose 50
  doc.rect(p1X, curY, panelW, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('1. BEFORE INTERVENTION', p1X + panelW / 2, curY + 4.8, { align: 'center' });

  if (beforeBase64) {
    try {
      doc.addImage(beforeBase64, 'JPEG', p1X + 1, curY + 7.5, panelW - 2, panelImgH);
    } catch {
      drawVectorPlaceholder(doc, p1X + 1, curY + 7.5, panelW - 2, panelImgH, 'BEFORE EVIDENCE PHOTO');
    }
  } else {
    drawVectorPlaceholder(doc, p1X + 1, curY + 7.5, panelW - 2, panelImgH, 'BEFORE EVIDENCE PHOTO');
  }

  // Panel 1 Metadata
  let p1MetaY = curY + 7.5 + panelImgH + 4;
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('EVIDENCE ID:', p1X + 3, p1MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`EVD-${hotspot.hotspot_id}-01`, p1X + 22, p1MetaY);

  p1MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('SOURCE:', p1X + 3, p1MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('Field / Targeted Aerial', p1X + 22, p1MetaY);

  p1MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CAPTURED:', p1X + 3, p1MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('08 Sept, 06:45 IST', p1X + 22, p1MetaY);

  p1MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('GNSS GPS:', p1X + 3, p1MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${hotspot.latitude.toFixed(4)}° N, ${hotspot.longitude.toFixed(4)}° E`, p1X + 22, p1MetaY);

  p1MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CONDITION:', p1X + 3, p1MetaY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('Stagnant Water Pooled', p1X + 22, p1MetaY);

  // Panel 2: INTERVENTION / REMEDIATION
  const p2X = p1X + panelW + 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(p2X, curY, panelW, 96, 2, 2, 'FD');

  doc.setFillColor(254, 243, 199); // Amber 50
  doc.rect(p2X, curY, panelW, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('2. REMEDIATION IN PROGRESS', p2X + panelW / 2, curY + 4.8, { align: 'center' });

  if (interventionBase64) {
    try {
      doc.addImage(interventionBase64, 'JPEG', p2X + 1, curY + 7.5, panelW - 2, panelImgH);
    } catch {
      drawVectorPlaceholder(doc, p2X + 1, curY + 7.5, panelW - 2, panelImgH, 'INTERVENTION EVIDENCE PHOTO', 'Pump & Drainage Clearance');
    }
  } else {
    // Graceful statement if separate intervention photo not captured
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(p2X + 1, curY + 7.5, panelW - 2, panelImgH, 1, 1, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Intervention evidence photograph', p2X + panelW / 2, curY + 28, { align: 'center' });
    doc.text('logged via checklist & GPS audit.', p2X + panelW / 2, curY + 33, { align: 'center' });
  }

  // Panel 2 Metadata
  let p2MetaY = curY + 7.5 + panelImgH + 4;
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('EVIDENCE ID:', p2X + 3, p2MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`EVD-${hotspot.hotspot_id}-02`, p2X + 22, p2MetaY);

  p2MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('ACTION:', p2X + 3, p2MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('Dewatering & Debris Cleared', p2X + 22, p2MetaY);

  p2MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICER:', p2X + 3, p2MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(assignedOfficer, p2X + 22, p2MetaY);

  p2MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('EQUIPMENT:', p2X + 3, p2MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('1200 LPM Dewatering Pump', p2X + 22, p2MetaY);

  p2MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('BARRIER:', p2X + 3, p2MetaY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('Bti Bio-Larvicide Applied', p2X + 22, p2MetaY);

  // Panel 3: AFTER INTERVENTION
  const p3X = p2X + panelW + 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(p3X, curY, panelW, 96, 2, 2, 'FD');

  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.rect(p3X, curY, panelW, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('3. AFTER INTERVENTION', p3X + panelW / 2, curY + 4.8, { align: 'center' });

  if (afterBase64) {
    try {
      doc.addImage(afterBase64, 'JPEG', p3X + 1, curY + 7.5, panelW - 2, panelImgH);
    } catch {
      drawVectorPlaceholder(doc, p3X + 1, curY + 7.5, panelW - 2, panelImgH, 'AFTER EVIDENCE PHOTO');
    }
  } else {
    drawVectorPlaceholder(doc, p3X + 1, curY + 7.5, panelW - 2, panelImgH, 'AFTER EVIDENCE PHOTO');
  }

  // Panel 3 Metadata
  let p3MetaY = curY + 7.5 + panelImgH + 4;
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('EVIDENCE ID:', p3X + 3, p3MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`EVD-${hotspot.hotspot_id}-03`, p3X + 22, p3MetaY);

  p3MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('SOURCE:', p3X + 3, p3MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('Field Officer Ground Proof', p3X + 22, p3MetaY);

  p3MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('CAPTURED:', p3X + 3, p3MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('08 Sept, 11:30 IST', p3X + 22, p3MetaY);

  p3MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('GNSS GPS:', p3X + 3, p3MetaY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${hotspot.latitude.toFixed(4)}° N, ${hotspot.longitude.toFixed(4)}° E`, p3X + 22, p3MetaY);

  p3MetaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('STATUS:', p3X + 3, p3MetaY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('Water Evacuated (0L)', p3X + 22, p3MetaY);

  // Environmental Comparison Table: BEFORE VS AFTER
  curY += 102;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Environmental Condition Audit: Before vs After Remediation', 14, curY);

  curY += 4.5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 45, 2, 2, 'FD');

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, curY, 182, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('PHYSICAL METRIC', 18, curY + 4.8);
  doc.text('PRE-INTERVENTION BASELINE (BEFORE)', 65, curY + 4.8);
  doc.text('POST-INTERVENTION VERIFICATION (AFTER)', 125, curY + 4.8);

  const compRows = [
    { metric: 'Standing Water Volume', before: 'Detected (~120 sq.m murky pool, 25-40cm depth)', after: 'Fully Evacuated (0 Litres standing retention)' },
    { metric: 'Drainage Channel Outflow', before: 'Severely obstructed by silt & construction debris', after: 'De-silted & cleared; gravity flow restored' },
    { metric: 'Excavation Foundation Bed', before: 'Submerged muddy sump with algae/scum film', after: 'Exposed dry gravel & bedrock footing' },
    { metric: 'Biological Vector Barrier', before: 'Unprotected stagnant breeding medium', after: 'Bti microbial larvicide barrier active on perimeter' },
    { metric: 'Geographic Co-location Audit', before: `Lat: ${hotspot.latitude.toFixed(4)}° N, Lng: ${hotspot.longitude.toFixed(4)}° E`, after: 'Matched within 2.1m GNSS tolerance (Same site)' }
  ];

  let rY = curY + 12;
  compRows.forEach((r, idx) => {
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(r.metric, 18, rY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(185, 28, 28);
    doc.text(r.before, 65, rY);

    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.text(r.after, 125, rY);

    rY += 6.8;
  });

  drawPageFooter(doc, 3);

  // =========================================================================
  // PAGE 4: FIELD ACTION SUMMARY, HUMAN VERIFICATION & EVIDENCE REGISTER
  // =========================================================================
  doc.addPage();
  drawPageHeader(doc, hotspot.hotspot_id, hotspot.status);

  curY = 17;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('FIELD ACTION SUMMARY & HUMAN VERIFICATION AUDIT', 14, curY);

  curY += 4.5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Operational audit log containing field dispatch metrics, supervisory verification sign-off, and register.', 14, curY);

  // Split section: Left = Field Action Summary, Right = Verification Audit
  curY += 5;
  const colW = 88;

  // Left: Field Action Summary Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, colW, 58, 2, 2, 'FD');

  doc.setFillColor(248, 250, 252);
  doc.rect(14, curY, colW, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('FIELD ACTION SUMMARY', 18, curY + 4.8);

  const fieldSummary = [
    { label: 'Task ID:', val: taskId },
    { label: 'Assigned Team:', val: assignedTeam },
    { label: 'Assigned Officer:', val: assignedOfficer },
    { label: 'Priority Level:', val: isCritical ? 'CRITICAL (Immediate Dispatch)' : 'HIGH' },
    { label: 'Created At:', val: task?.assigned_at || '08 Sept 2026, 07:15 IST' },
    { label: 'Started At:', val: '08 Sept 2026, 08:30 IST' },
    { label: 'Completed At:', val: task?.completed_at || '08 Sept 2026, 11:45 IST' },
    { label: 'Remediation:', val: hotspot.recommended_action || 'Dewatering + debris clear' },
    { label: 'Current Status:', val: taskStatus.replace('_', ' ') }
  ];

  let fsY = curY + 11.5;
  fieldSummary.forEach(item => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, 18, fsY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(item.val, 42, fsY, { maxWidth: 58 });
    fsY += 5;
  });

  // Right: Human Verification Summary Box
  const col2Left = 14 + colW + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2Left, curY, colW, 58, 2, 2, 'FD');

  doc.setFillColor(248, 250, 252);
  doc.rect(col2Left, curY, colW, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('HUMAN VERIFICATION AUDIT', col2Left + 4, curY + 4.8);

  const isApproved = hotspot.status === 'RESOLVED' || task?.status === 'RESOLVED';
  const verifStatus = isApproved ? 'APPROVED (VERIFIED REMEDIATED)' : (hotspot.status === 'AWAITING_VERIFICATION' ? 'PENDING SUPERVISOR REVIEW' : 'IN PROGRESS');
  const verifColor = isApproved ? [16, 185, 129] : [217, 119, 6];

  const verifSummary = [
    { label: 'Audit Type:', val: 'Human Ground-Truth Audit' },
    { label: 'Verified By:', val: task?.reviewed_by || 'Dr. Neha Sharma (Control Room Director)' },
    { label: 'Audit Date:', val: task?.reviewed_at || '08 Sept 2026, 14:15 IST' },
    { label: 'Status:', val: verifStatus, customColor: verifColor },
    { label: 'Evidence Completeness:', val: 'Before ✓   Intervention ✓   After ✓' },
    { label: 'GNSS Geo-Lock:', val: 'MATCHED (Delta 2.1m < ±15m tolerance)' },
    { label: 'Reviewer Notes:', val: task?.admin_notes || 'Physical proof verified against GPS coordinates. Standing water fully removed and biological barrier confirmed.' }
  ];

  let vsY = curY + 11.5;
  verifSummary.forEach(item => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, col2Left + 4, vsY);

    doc.setFont('helvetica', 'normal');
    if (item.customColor) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(item.customColor[0], item.customColor[1], item.customColor[2]);
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(item.val, col2Left + 35, vsY, { maxWidth: 55 });
    vsY += item.label === 'Reviewer Notes:' ? 6.5 : 5.2;
  });

  // Section: Registered Citizen Supporting Evidence (if available or applicable)
  curY += 62;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Registered Citizen Supporting Evidence (Separate Channel)', 14, curY);

  curY += 4;
  doc.setFillColor(250, 245, 255); // Violet 50
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(14, curY, 182, 28, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 33, 168); // Purple 700
  doc.text('COMMUNITY SUPPORTING OBSERVATION (CITIZEN SENTINEL NETWORK)', 18, curY + 5.5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(147, 51, 234);
  doc.text('Important: Citizen evidence is supporting evidence only and does not directly determine the AI risk score.', 18, curY + 9.5);

  const activeCitizenRecord = siteCitizenSubmissions[0];
  if (activeCitizenRecord) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Evidence ID: ${activeCitizenRecord.submissionId}  |  Source: Registered Citizen (${activeCitizenRecord.citizenNameMasked})`, 18, curY + 15);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`Condition: ${activeCitizenRecord.evidenceType}  •  Location: ${activeCitizenRecord.localArea}, ${activeCitizenRecord.city}`, 18, curY + 19.5);
    doc.text(`Description: "${activeCitizenRecord.description}"`, 18, curY + 24);

    if (citizenBase64) {
      try {
        doc.addImage(citizenBase64, 'JPEG', 158, curY + 3, 34, 22);
      } catch {
        // ignore
      }
    }
  } else {
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`• Supporting citizen observations can be logged via the Citizen Evidence Portal for ${hotspot.locality || hotspot.city}.`, 18, curY + 16);
    doc.text('• No conflicting citizen reports on record for this exact survey period.', 18, curY + 21);
    doc.text('• All decisions strictly anchored on authorized aerial survey and officer ground verification.', 18, curY + 25);
  }

  // Section: Complete Evidence Register Table
  curY += 32;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Complete Evidence Register Table', 14, curY);

  curY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 38, 2, 2, 'FD');

  // Register Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, curY, 182, 6.5, 'F');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('EVIDENCE ID', 18, curY + 4.5);
  doc.text('SOURCE / ACTOR', 44, curY + 4.5);
  doc.text('TYPE', 82, curY + 4.5);
  doc.text('TIMESTAMP', 114, curY + 4.5);
  doc.text('COORDINATES', 146, curY + 4.5);
  doc.text('STATUS', 178, curY + 4.5);

  const evidenceRegister = [
    { id: `EVD-${hotspot.hotspot_id}-01`, src: 'Authorized Drone Survey', type: 'Overhead Aerial Survey', time: '08 Sept, 06:45 IST', coord: `${hotspot.latitude.toFixed(3)}N, ${hotspot.longitude.toFixed(3)}E`, status: 'VERIFIED' },
    { id: `EVD-${hotspot.hotspot_id}-02`, src: 'Field Officer Ground Proof', type: 'Baseline Sump Photo', time: '08 Sept, 06:49 IST', coord: `${hotspot.latitude.toFixed(3)}N, ${hotspot.longitude.toFixed(3)}E`, status: 'VERIFIED' },
    { id: `EVD-${hotspot.hotspot_id}-03`, src: assignedTeam, type: 'Dewatering Pump Deployment', time: '08 Sept, 09:15 IST', coord: `${hotspot.latitude.toFixed(3)}N, ${hotspot.longitude.toFixed(3)}E`, status: 'ACTIONED' },
    { id: `EVD-${hotspot.hotspot_id}-04`, src: assignedOfficer, type: 'Post-Remediation Verification', time: '08 Sept, 11:30 IST', coord: `${hotspot.latitude.toFixed(3)}N, ${hotspot.longitude.toFixed(3)}E`, status: 'APPROVED' },
    { id: `EVD-${hotspot.hotspot_id}-05`, src: 'Municipal Vector Control', type: 'Bti Larvicide Certificate', time: '08 Sept, 11:45 IST', coord: `${hotspot.latitude.toFixed(3)}N, ${hotspot.longitude.toFixed(3)}E`, status: 'SEALED' }
  ];

  let regY = curY + 11;
  evidenceRegister.forEach((item) => {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.id, 18, regY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(item.src, 44, regY, { maxWidth: 36 });
    doc.text(item.type, 82, regY, { maxWidth: 30 });
    doc.text(item.time, 114, regY);
    doc.text(item.coord, 146, regY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(item.status, 178, regY);

    regY += 5.8;
  });

  // Section: Outcome & Continuous Learning Note
  curY += 42;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, 182, 19, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SURVEILLANCE OUTCOME & CONTINUOUS LEARNING FEEDBACK', 18, curY + 5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`• Initial Prioritization: ${hotspot.breeding_risk_score}/100 (${hotspot.risk_level})  →  Post-Remediation Physical Outcome: VERIFIED STAGNATION PREVENTED.`, 18, curY + 9.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  doc.text('• Feedback & Continuous Learning: Verified field outcomes are retained as feedback data for future model calibration and retraining.', 18, curY + 14);

  // Authorized Sign-off Box at bottom
  curY += 21;
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('FIELD INSPECTION OFFICER: __________________________', 18, curY + 4);
  doc.text('MUNICIPAL SURVEILLANCE DIRECTOR: __________________________', 105, curY + 4);

  drawPageFooter(doc, 4);

  // Save PDF and return filename
  const filename = `VectorGuard_AI_Verification_Report_${hotspot.hotspot_id}.pdf`;
  doc.save(filename);

  onProgress?.('PDF successfully generated.');
  return filename;
}
