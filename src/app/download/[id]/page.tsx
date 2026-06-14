import { getFileWithLinks } from "@/app/actions/drive";
import { getSetting } from "@/app/actions/settings";
import { AdController } from "@/components/AdController";
import { AdBanner } from "@/components/AdBanner";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CopyButton } from "../../../components/CopyButton";
import { DownloadButtons } from "@/components/DownloadButtons";
import { WatchPlayer } from "@/components/WatchPlayer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  FileVideo, 
  Download, 
  Zap, 
  Play, 
  HardDriveDownload, 
  Share2, 
  Clock, 
  User, 
  Calendar, 
  HardDrive, 
  CheckCircle2, 
  Server, 
  Sliders,
  Check,
  ExternalLink,
  ChevronRight,
  Send,
  Terminal,
  CirclePlay,
  Rocket,
  Bolt,
  CloudDownload,
  ArrowUpRight,
  MonitorPlay
} from "lucide-react";

export default async function DownloadPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const file = await getFileWithLinks(id);

  if (!file) {
    notFound();
  }

  const adsPopunder = await getSetting("ads_popunder") || "";
  const adsSocialBar = await getSetting("ads_social_bar") || "";
  const adsNativeBanner = await getSetting("ads_native_banner") || "";
  const adsBanner728x90 = await getSetting("ads_banner_728x90") || "";
  const adsDirectLink = await getSetting("ads_direct_link") || "";

  const mediaInfoText = `General
  Complete name            : ${file.filename || "file.webm"}
  Format                   : Matroska
  Format version           : 4
  File size                : ${file.filesize || "Unknown"}
  Writing application      : Chrome
  Writing library          : Chrome

Video
  ID                       : 1
  Format                   : AVC
  Format/Info           : Advanced Video Codec
  Format profile        : Constrained Baseline
  Codec ID              : V_MPEG4/ISO/AVC
  Width                    : 1920
  Height                    : 1040
  Display aspect ratio     : 1.846
  Frame rate mode          : VFR
  Color space              : YUV
  Bit depth                : 8
  Scan type                : Progressive
  Language                 : en
  Default                  : Yes
  Forced                   : No
  Color range              : Limited
  Color primaries          : BT.709
  Transfer characteristics : BT.709
  Matrix coefficients      : BT.709`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700;800&display=swap');
        
        :root {
          --bg: oklch(0.21 0.035 256);
          --card: #f6f9ff;
          --tg: #1b89c7;
          --tg2: #229ED9;
          --glass: rgba(242,247,255,.72);
          --glass2: rgba(242,247,255,.78);
          --text: #0b1220;
          --muted: #586e8f;
          --blue: #2563eb;
          --blue2: #1d4ed8;
          --teal: #0f766e;
          --r: 10px;
          --shadow: 0 14px 28px rgba(2,6,23,.10);
          --shadow2: 0 10px 20px rgba(2,6,23,.08);
          --okBg: rgba(34,197,94,.88);
          --okSh: 0 10px 18px rgba(34,197,94,.18), 0 10px 18px rgba(2,6,23,.10);
        }

        .dl-wrapper {
          margin: 0;
          background-color: var(--bg);
          background-image: 
            radial-gradient(60% 50% at 20% 0%, oklch(0.32 0.08 240 / 0.5), transparent 60%),
            radial-gradient(50% 40% at 100% 100%, oklch(0.32 0.1 195 / 0.35), transparent 60%);
          background-attachment: fixed;
          color: oklch(0.97 0.01 250);
          font-family: "Baloo Da 2", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          min-height: 100vh;
        }

        .dl-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(246,249,255,.92);
          backdrop-filter: saturate(140%) blur(8px);
          box-shadow: 0 10px 22px rgba(2,6,23,.08);
        }

        .dl-nav .inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dl-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .dl-logo {
          width: 34px;
          height: 34px;
          border-radius: var(--r);
          background: #0b1220;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          box-shadow: 0 12px 18px rgba(2,6,23,.14);
        }

        .dl-brandname {
          font-size: 13px;
          font-weight: 800;
          color: #0b1220;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dl-navbtns {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dl-iconbtn {
          width: 42px;
          height: 42px;
          border-radius: var(--r);
          border: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--glass);
          color: var(--text);
          box-shadow: 0 10px 18px rgba(2,6,23,.07);
        }

        .dl-iconbtn.blue {
          background: var(--blue);
          color: #fff;
          box-shadow: 0 14px 22px rgba(37,99,235,.18);
        }

        .dl-container {
          max-width: 980px;
          margin: 14px auto;
          padding: 0 14px;
        }

        .dl-card {
          background: var(--card);
          border-radius: var(--r);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .dl-head {
          padding: 12px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .dl-fileicon {
          width: 40px;
          height: 40px;
          border-radius: var(--r);
          background: rgba(37,99,235,.10);
          color: var(--blue);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .dl-title {
          min-width: 0;
          flex: 1;
        }

        .dl-title h1 {
          margin: 0;
          font-size: clamp(18px, 3.5vw, 28px);
          line-height: 1.22;
          font-weight: 900;
          word-break: break-word;
        }

        .dl-chips {
          margin-top: 8px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }

        @media (min-width: 640px) {
          .dl-chips {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 8px;
          }
        }

        .dl-chip {
          min-width: 0;
          padding: 8px 9px;
          border-radius: var(--r);
          background: rgba(242,247,255,.74);
          box-shadow: 0 5px 10px rgba(2,6,23,.05);
          display: grid;
          grid-template-columns: 16px 1fr;
          grid-template-rows: auto auto;
          column-gap: 6px;
          row-gap: 1px;
        }

        .dl-chip svg {
          grid-column: 1;
          grid-row: 1 / span 2;
          align-self: center;
          justify-self: center;
          color: var(--blue);
        }

        .dl-chip .k {
          grid-column: 2;
          grid-row: 1;
          font-size: 11px;
          font-weight: 900;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dl-chip .v {
          grid-column: 2;
          grid-row: 2;
          font-size: 14px;
          font-weight: 900;
          color: var(--text);
          line-height: 1.15;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dl-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dl-box {
          background: var(--glass2);
          border-radius: var(--r);
          box-shadow: var(--shadow2);
          padding: 12px;
        }

        .dl-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dl-sectiontitle {
          margin: 0;
          font-size: 13px;
          font-weight: 900;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dl-sectiontitle .ico {
          width: 28px;
          height: 28px;
          border-radius: var(--r);
          background: rgba(37,99,235,.10);
          color: var(--blue);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .dl-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dl-btnbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px;
          border-radius: var(--r);
          color: #fff !important;
          font-weight: 900;
          box-shadow: 0 14px 22px rgba(2,6,23,.12);
          min-height: 54px;
          border: 0;
          cursor: pointer;
        }

        .dl-btnbar .l {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }

        .dl-btnbar .l .txt {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 1.12;
        }

        .dl-btnbar .r {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }

        .dl-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 9px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 900;
          background: rgba(255,255,255, 0.14);
          color: #fff;
          white-space: nowrap;
        }

        .dl-okTick {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--okBg);
          box-shadow: var(--okSh);
        }

        .dl-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border-radius: 8px;
          font-weight: 900;
          font-size: 11px;
          color: #fff;
          text-transform: uppercase;
        }

        .dl-pill.success {
          background: var(--teal);
        }
        
        .dl-pill.pending {
          background: rgba(245, 158, 11, 0.94);
        }

        .c-watch { background: #0f172a; }
        .c-instant { background: #dc2626; }
        .c-fsl { background: var(--teal); }

        .dl-share {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .dl-share input {
          width: 100%;
          padding: 11px 10px;
          border-radius: var(--r);
          border: 0;
          background: rgba(242,247,255,.72);
          box-shadow: 0 10px 18px rgba(2,6,23,.07);
          font-weight: 800;
          color: var(--text);
          outline: none;
        }

        .meta-section {
          padding: 12px;
          border-radius: 8px;
          background: rgba(242,247,255,.74);
          box-shadow: 0 5px 10px rgba(2,6,23,.05);
        }

        .meta-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 900;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .04em;
          margin: 0 0 12px;
        }

        .meta-kicker .bar {
          width: 28px;
          height: 8px;
          border-radius: 8px;
          background: linear-gradient(90deg, #84cc16, #22c55e, #2563eb, #7c3aed);
        }

        .tag-card {
          padding: 12px;
          border-radius: 8px;
          background: rgba(242,247,255,.74);
          box-shadow: 0 5px 10px rgba(2,6,23,.05);
        }

        .tag-card .tk {
          font-size: 12px;
          font-weight: 900;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .03em;
          margin-bottom: 6px;
        }

        .tag-card .tv {
          font-size: 14px;
          font-weight: 900;
          color: var(--text);
          line-height: 1.45;
          word-break: break-word;
        }

        .mini-table {
          display: grid;
          gap: 10px;
        }

        .mini-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          padding: 4px 0;
          border-bottom: 1px solid rgba(88,110,143,.12);
        }

        .mini-row:last-child { border-bottom: 0; }
        .mini-row .k { font-size: 12px; font-weight: 900; color: var(--muted); }
        .mini-row .v { font-size: 13px; font-weight: 900; color: var(--text); text-align: right; }

        .raw-json {
          margin-top: 6px;
          border-radius: 8px;
          background: #0f172a;
          color: #dbeafe;
          padding: 14px;
          overflow: auto;
          font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .dl-telegram {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          background: rgba(242,247,255,.72);
          border-radius: var(--r);
          padding: 10px 12px;
          box-shadow: 0 10px 18px rgba(2,6,23,.07);
        }

        .dl-tgtext {
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
        }

        @media (max-width: 640px) {
          .dl-container {
            margin: 0;
            padding: 0;
            max-width: none;
          }
          .dl-card {
            border-radius: 0;
            box-shadow: none;
          }
          .dl-share { flex-direction: column; align-items: stretch; }
          .dl-brandname { max-width: 52vw; }
          .dl-head { padding: 16px 12px; }
          .dl-body { padding: 8px; }
        }
      ` }} />

      <div className="dl-wrapper">
        <AdController popunderCode={adsPopunder} socialBarCode={adsSocialBar} directLink={adsDirectLink} />
        {/* Main Website Header (Responsive) */}
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0b1220] backdrop-blur-xl">
          <div className="h-16 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary glow flex items-center justify-center text-primary-foreground shadow-lg">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-lg tracking-tight">DriveLink Studio</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Direct Gateway</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button asChild className="gradient-primary text-primary-foreground font-black rounded-xl px-6 h-10 shadow-lg glow text-xs uppercase tracking-widest">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="dl-container">
          <AdBanner code={adsBanner728x90} placement="top" />
          <div className="dl-card">
            <div className="dl-head">
              <div className="dl-fileicon"><FileVideo className="w-5 h-5" /></div>
              <div className="dl-title">
                <h1>{file.filename || "Untitled File"}</h1>
                <div className="dl-chips">
                  <div className="dl-chip">
                    <Download className="w-3.5 h-3.5" />
                    <span className="k">Downloads</span>
                    <span className="v">642</span>
                  </div>
                  <div className="dl-chip">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span className="k">Size</span>
                    <span className="v">{file.filesize || "15.8 MB"}</span>
                  </div>
                  <div className="dl-chip">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="k">Uploaded</span>
                    <span className="v">12 hours ago</span>
                  </div>
                  <div className="dl-chip">
                    <User className="w-3.5 h-3.5" />
                    <span className="k">Shared by</span>
                    <span className="v">Admin</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dl-body">
              <div className="dl-box">
                <div className="dl-row">
                  <h3 className="dl-sectiontitle">
                    <span className="ico"><Server className="w-4 h-4" /></span>
                    Download Servers
                  </h3>
                  <span className="dl-pill success">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>success</span>
                    <span className="mx-1">•</span>
                    <span>Done</span>
                  </span>
                </div>

                <div className="h-[10px]" />

                <div className="dl-actions">
                  {/* Primary Instant Download (Direct Drive) */}
                  <a href={`https://drive.google.com/uc?export=download&id=${file.drive_id}`} className="dl-btnbar c-instant">
                    <span className="l">
                      <span className="dl-okTick"><Check className="w-3.5 h-3.5" /></span>
                      <Bolt className="w-5 h-5" />
                      <span className="txt">INSTANT DOWNLOAD (Direct)</span>
                    </span>
                    <span className="r">
                      <span className="dl-badge">High Speed</span>
                      <CloudDownload className="w-5 h-5" />
                    </span>
                  </a>

                  {/* Primary Watch Online (Dedicated Page) */}
                  {file.links && file.links.length > 0 && (
                    <a 
                      href={`/watch/${file.links[0].token}`} 
                      target="_blank"
                      className="dl-btnbar c-watch w-full text-left border-0 cursor-pointer no-underline"
                    >
                      <span className="l">
                        <span className="dl-okTick">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <MonitorPlay className="w-5 h-5" />
                        <span className="txt">WATCH ONLINE (Cinema Mode)</span>
                      </span>
                      <span className="r">
                        <span className="dl-badge">PLAY NOW</span>
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </a>
                  )}

                  {/* API Providers Links */}
                  <DownloadButtons links={file.links} />
                </div>
              </div>

              <AdBanner code={adsNativeBanner} placement="native" />

              <div className="dl-box">
                <div className="dl-row">
                  <h3 className="dl-sectiontitle">
                    <span className="ico"><Share2 className="w-4 h-4" /></span>
                    Share
                  </h3>
                  <span className="text-[12px] font-bold text-slate-500">Copy & share</span>
                </div>
                <div className="h-[10px]" />
                <div className="dl-share">
                  <input type="text" value={`${typeof window !== 'undefined' ? window.location.origin : ''}/download/${file.id}`} readOnly />
                  <CopyButton text={`${typeof window !== 'undefined' ? window.location.origin : ''}/download/${file.id}`} />
                </div>
              </div>

              <div className="dl-row px-2 mb-4">
                <h3 className="dl-sectiontitle !text-white">
                  <span className="ico"><Sliders className="w-4 h-4" /></span>
                  Detailed Media Information
                </h3>
              </div>

              <section className="meta-section">
                <div className="meta-kicker"><span className="bar"></span><span>File Summary</span></div>
                <div className="dl-chips">
                  <div className="dl-chip">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <div className="k">Quality</div>
                    <div className="v">FHD</div>
                  </div>
                  <div className="dl-chip">
                    <MonitorPlay className="w-3.5 h-3.5" />
                    <div className="k">Resolution</div>
                    <div className="v">1920×1040</div>
                  </div>
                  <div className="dl-chip">
                    <FileVideo className="w-3.5 h-3.5" />
                    <div className="k">Video</div>
                    <div className="v">H264</div>
                  </div>
                </div>

                <div className="h-[8px]" />
                <div className="tag-card">
                  <div className="tk">Encoder</div>
                  <div className="tv">Chrome</div>
                </div>

                <div className="h-[8px]" />
                <div className="meta-kicker"><span className="bar"></span><span>Video Stream</span></div>
                <div className="mini-table">
                  <div className="mini-row">
                    <div className="k">Codec</div>
                    <div className="v">H.264 / AVC / MPEG-4 AVC / MPEG-4 PART 10</div>
                  </div>
                  <div className="mini-row">
                    <div className="k">Resolution</div>
                    <div className="v">1920×1040</div>
                  </div>
                  <div className="mini-row">
                    <div className="k">Pixel Format</div>
                    <div className="v">YUV420P</div>
                  </div>
                  <div className="mini-row">
                    <div className="k">Aspect Ratio</div>
                    <div className="v">24:13</div>
                  </div>
                  <div className="mini-row">
                    <div className="k">Scan Type</div>
                    <div className="v">PROGRESSIVE</div>
                  </div>
                </div>

                <div className="h-[8px]" />
                <div className="meta-kicker"><span className="bar"></span><span>MediaInfo</span></div>
                <div className="flex justify-end mb-2">
                  <CopyButton text={mediaInfoText} />
                </div>
                <pre className="raw-json">
                  {mediaInfoText}
                </pre>
              </section>

              <div className="dl-telegram">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600 fill-blue-600" /> Join Telegram
                  </div>
                  <div className="dl-tgtext">Latest updates & announcements</div>
                </div>
                <Button asChild className="bg-[#1b89c7] hover:bg-[#229ED9] text-white font-bold rounded-lg border-0 px-6">
                  <a href="https://t.me/drivecloudtg" target="_blank" rel="noreferrer">Join</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
