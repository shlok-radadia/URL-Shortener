import { use, useState } from "react"
import axios from "axios"
import QRCode from "react-qr-code"
import QRCodeGenerator from "qrcode"

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if(!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (error) {
      console.log(error);
      alert("Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-base-100 rounded-3xl shadow-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            URL Shortener
          </h1>
          <p className="mt-2 text-base-content/70">
            Shorten your links instantly and generate QR codes
          </p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste your long URL here"
            className="input input-bordered input-primary w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleShorten}
            className={`btn btn-primary sm:w-40 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            Shorten
          </button>
        </div>

        {/* Result Section */}
        {shortUrl && (
          <div className="mt-10 border-t pt-8">
            <div className="flex flex-col gap-4">
              <div className="bg-base-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-base-content/70">
                    Your short link
                  </p>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary break-all font-semibold"
                  >
                    {shortUrl}
                  </a>
                </div>
                <button
                  onClick={handleCopy}
                  className={`btn ${copied ? "btn-success" : "btn-secondary"}`}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* QR Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div className="bg-white p-5 rounded-2xl shadow-md">
                  <QRCode value={shortUrl} size={160} />
                </div>
                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <p className="font-semibold text-center sm:text-left">
                    QR Code
                  </p>
                  <a
                    href={qrImage}
                    download="qr-code.png"
                    className="btn btn-accent"
                  >
                    Download QR
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    // <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
    //   <h1 className="text-4xl font-bold mb-4 text-center">URL SHORTENER</h1>
    //   <div className="flex flex-col gap-3 w-full max-w-3xl">
    //     <input type="text" className="input input-success w-full" placeholder="Enter Long URL" value={url} onChange={(e) => setUrl(e.target.value)} />
    //     <button onClick={handleShorten} className="btn btn-primary w-full sm:auto" disabled={loading}>Shorten</button>
    //   </div>
    //   {shortUrl && (
    //     <div className="flex flex-col items-center max-w-3xl w-full">
    //       <p className="font-medium mb-2">Your Short Link:</p>
    //       <a className="link link-primary break-all" target="_blank" href={shortUrl}>{shortUrl}</a>
    //       <button onClick={handleCopy} className={`btn mt-2 w-full ${copied ? "btn-success" : "btn-secondary"}`}>
    //         {copied ? "Copied!" : "Copy"}
    //       </button>

    //       <div className="bg-white p-4 rounded-lg shadow mt-6">
    //         <p className="mb-2 text-center font-semibold text-gray-800">Scan QR Code:</p>
    //         <QRCode value={shortUrl} size={180} />
    //       </div>
    //       {qrImage && (
    //         <a className="btn btn-accent mt-3 w-full" download="qr-code.png" href={qrImage}>Download QR Code</a>
    //       )}
    //     </div>
    //   )}
    // </div>
  )
}

export default App