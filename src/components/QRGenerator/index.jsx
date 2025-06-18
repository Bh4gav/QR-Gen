import { useState } from "react";
import "./index.css";

const QRGenerator = () => {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQR = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const encoded = encodeURIComponent(url.trim());
      const domain = new URL(url).hostname;
      const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

      const qrApi = `https://quickchart.io/qr?text=${encoded}&size=300&dark=c6d0f5&light=303446&margin=0&centerImageUrl=${encodeURIComponent(
        favicon
      )}&centerImageWidth=48&centerImageHeight=48&centerImageBackgroundColor=292c3c&centerImageRadius=24`;

      setTimeout(() => {
        setQrUrl(qrApi);
        setLoading(false);
      }, 404);
    } catch {
      alert("Please enter a valid URL (with https://)");
      setLoading(false);
    }
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download QR code. Please try again.");
      console.error("Download error:", err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link");
    }
  };

  return (
    <div className="qr-wrapper">
      <h1 className="qr-title">QR Code Generator</h1>

      <form onSubmit={generateQR} className="qr-form">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
          className="qr-input"
        />
        <button type="submit" className="qr-button">
          Generate
        </button>
      </form>

      {loading ? (
        <div className="loader" />
      ) : (
        qrUrl && (
          <div className="qr-result">
            <img src={qrUrl} alt="QR Code" className="qr-image" />
            <div className="qr-actions">
              <button
                onClick={downloadQR}
                className="qr-small-button qr-download"
              >
                Download
              </button>
              <button onClick={copyLink} className="qr-small-button qr-copy">
                Copy Link
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default QRGenerator;
