"use client"

import { useEffect, useRef, useState } from "react"
import { editImageWithAI, generateImages } from "../../lib/api"
import { toast, ToastContainer } from "react-toastify";
import { fileToBase64 } from "../../utils/utils";

const defaultSettings = {
  resolution: "1024",
  intensity: 60,
  background: "original",
  crop: false,
  filter: "none",
  prompt: "professional studio headshot, soft light"
}

export default function Generate() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [settings, setSettings] = useState(defaultSettings);
  const [processing, setProcessing] = useState(false);

  const [prompt, setPrompt] = useState("professional studio headshot, soft light");
  const [style, setStyle] = useState("default");
  const [count, setCount] = useState(4);
  const [size, setSize] = useState(1024);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [results, setResults] = useState([]);
  const [useAIPrompt, setUseAIPrompt] = useState(false);
  const resultsRef = useRef(null);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // 🖼️ Handle preview URL when file changes
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // 🧭 Render preview on canvas when preview or settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !previewUrl) return;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      const resolution = Number.parseInt(settings.resolution, 10) || 1024;
      canvas.width = resolution;
      canvas.height = resolution;

      // Square crop if enabled
      const minSide = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = settings.crop ? (img.naturalWidth - minSide) / 2 : 0;
      const sy = settings.crop ? (img.naturalHeight - minSide) / 2 : 0;
      const sw = settings.crop ? minSide : img.naturalWidth;
      const sh = settings.crop ? minSide : img.naturalHeight;

      // Apply filters
      const intensity = settings.intensity / 100;
      let filter = "none";
      switch (settings.filter) {
        case "grayscale":
          filter = `grayscale(${intensity})`;
          break;
        case "sepia":
          filter = `sepia(${intensity})`;
          break;
        case "contrast":
          filter = `contrast(${1 + intensity})`;
          break;
        case "blur":
          filter = `blur(${Math.round(intensity * 6)}px)`;
          break;
        default:
          filter = "none";
      }
      ctx.filter = filter;

      // Background
      if (settings.background === "transparent") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = settings.background === "black" ? "black" : "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    };

    // 👇 Important — force reload image for re-render
    img.src = previewUrl;
  }, [previewUrl, settings]);

  async function onGenerate(e) {
    e?.preventDefault?.(); // in case this comes from a form submit
    setProcessing(true);

    if (useAIPrompt) {
      try {
        await onGenerateViaApi(); // wait for API result
      } catch (err) {
        console.error(err);
      }
    } else {
      // Client-side canvas edits
      if (!file) {
        setProcessing(false);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    setProcessing(false);
  }

  useEffect(() => {
    if (results.length > 0 && !apiLoading) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [results, apiLoading]);


  useEffect(() => {
    if (!file) return setPreviewUrl("");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 🌐 AI Image Generation via API
  async function onGenerateViaApi(e) {
    e?.preventDefault?.();
    setApiError("");
    setApiLoading(true);
    let $file = null;
    if(file){
      $file = fileToBase64(file);
    }
    try {
      const images = await editImageWithAI({
        imageFile: $file,
        prompt: `${prompt}, ${settings.background ? settings.background + ' background' : ""}`,
        strength: 0.2,
        aspect_ratio: "1:1",
        output_format: "png",
        negative_prompt: "",
        style_preset: style,
      });
      console.log("return data :", images);

      // images is now an array of base64 strings
      setResults(images.map((img, index) => ({
        id: index,
        cdnUrl: img,
        prompt,
        style,
        width: size,
        height: size,
      })));

      toast.success("Image generated successfully", {
        position: "top-right",
      });
    } catch (err) {
      setApiError(err.message || "Something went wrong");
      toast.error("Image generation failed", {
        position: "top-right",
      });
    } finally {
      setApiLoading(false);
    }
  }

  const handleDownload = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  };
  console.log("result data :", results);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Generate</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload an image for client-side edits or generate CDN-backed results via API using your prompt and style.
      </p>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Preview */}
        <div className="rounded-xl border border-muted-foreground/10 p-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-white/5">
            {previewUrl ? (
              <>
                <img
                  ref={imgRef}
                  src={previewUrl || "/placeholder.svg?height=1024&width=1024&query=hidden-source-preview"}
                  crossOrigin="anonymous"
                  alt="Source"
                  className="hidden"
                />
                <canvas ref={canvasRef} className="h-full w-full" aria-label="Generated preview" />
              </>
            ) : (
              <img
                src="/upload-an-image-to-preview.jpg"
                alt="Placeholder preview"
                className="h-full w-full object-cover opacity-70"
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid gap-4 rounded-xl border border-muted-foreground/10 p-4 h-max">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-md border border-accent-foreground/10 bg-card file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-2 file:text-xs file:text-brand-foreground"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Resolution</span>
            <select
              value={settings.resolution}
              onChange={(e) => setSettings((s) => ({ ...s, resolution: e.target.value }))}
              className="rounded-md border border-accent-foreground/10 bg-card px-3 py-2"
            >
              <option value="512">512 x 512</option>
              <option value="768">768 x 768</option>
              <option value="1024">1024 x 1024</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={useAIPrompt}
              onChange={(e) => setUseAIPrompt(e.target.checked)}
            />
            <span className="text-muted-foreground">Use prompt for AI generation</span>
          </label>

          {/* Prompt input */}
          {useAIPrompt && (
            <>
              {/* Prompt input */}
              <div className="mt-2 px-2">
                <label className="grid gap-2 text-sm">
                  <span className="text-muted-foreground mx-2">Prompt</span>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="rounded-md border border-accent-foreground/10 bg-card px-3 py-2"
                    placeholder="e.g., professional studio headshot, soft light"
                  />
                </label>
              </div>

              {/* Style selection */}
              <div className="mt-2 px-2">
                <label className="grid gap-2 text-sm">
                  <span className="text-muted-foreground mx-2">Style Preset</span>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="rounded-md border border-muted-foreground/10 bg-card px-3 py-2"
                  >
                    <option value="">None (No Style)</option>
                    <option value="enhance">Enhance</option>
                    <option value="anime">Anime</option>
                    <option value="photographic">Photographic</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="comic-book">Comic Book</option>
                    <option value="fantasy-art">Fantasy Art</option>
                    <option value="line-art">Line Art</option>
                    <option value="analog-film">Analog Film</option>
                    <option value="neon-punk">Neon Punk</option>
                    <option value="isometric">Isometric</option>
                    <option value="low-poly">Low Poly</option>
                    <option value="origami">Origami</option>
                    <option value="modeling-compound">Modeling Compound</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="3d-model">3D Model</option>
                    <option value="pixel-art">Pixel Art</option>
                    <option value="tile-texture">Tile Texture</option>
                  </select>
                </label>
              </div>
            </>
          )}

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Style intensity</span>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.intensity}
              onChange={(e) => setSettings((s) => ({ ...s, intensity: Number(e.target.value) }))}
            />
            <span className="text-xs text-muted-foreground">{settings.intensity}%</span>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Background</span>
            <select
              value={settings.background}
              onChange={(e) => setSettings((s) => ({ ...s, background: e.target.value }))}
              className="rounded-md border border-accent-foreground/10 bg-card px-3 py-2"
            >
              <option value="original">Original (drawn over white)</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="transparent">Transparent (checkerboard not shown)</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.crop}
              onChange={(e) => setSettings((s) => ({ ...s, crop: e.target.checked }))}
            />
            <span className="text-muted-foreground">Square crop</span>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Filter</span>
            <select
              value={settings.filter}
              onChange={(e) => setSettings((s) => ({ ...s, filter: e.target.value }))}
              className="rounded-md border border-accent-foreground/10 bg-card px-3 py-2"
            >
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="contrast">High contrast</option>
              <option value="blur">Soft blur</option>
            </select>
          </label>

          <button
            onClick={onGenerate}
            disabled={!file || processing}
            className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition disabled:opacity-50"
          >
            {processing ? "Generating…" : "Generate HD"}
          </button>

          <a
            download="aurora-result.png"
            href={(() => {
              const c = canvasRef.current
              return c ? c.toDataURL("image/png") : undefined
            })()}
            className="rounded-lg border border-accent-foreground/10 px-4 py-2 text-center text-sm hover:bg-muted-foreground/5 transition"
          >
            Download
          </a>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-muted-foreground/10 p-4">
        <h2 className="text-lg font-semibold">Generate via API (CDN images)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a prompt and style, we’ll call the API and return CDN-backed image URLs for fast previews.
        </p>

        <form onSubmit={onGenerateViaApi} className="mt-4 grid gap-4 md:grid-cols-[1fr_200px_160px_160px]">
          <label className="grid gap-2 text-sm md:col-span-1">
            <span className="text-muted-foreground">Prompt</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="rounded-md border border-muted-foreground/10 bg-card px-3 py-2"
              placeholder="e.g., professional studio headshot, soft light"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Style</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="rounded-md border border-muted-foreground/10 bg-card px-3 py-2"
            >
              <option value="default">Default</option>
              <option value="anime">Anime</option>
              <option value="cartoon">Cartoon</option>
              <option value="fantasy">Fantasy</option>
              <option value="product">Product</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Count</span>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-md border border-muted-foreground/10 bg-card px-3 py-2"
            >
              {[1, 2].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Size</span>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="rounded-md border border-muted-foreground/10 bg-card px-3 py-2"
            >
              {[512, 768, 1024].map((n) => (
                <option key={n} value={n}>
                  {n} x {n}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={apiLoading}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition disabled:opacity-50"
            >
              {apiLoading ? "Generating…" : "Generate via API"}
            </button>
            {apiError ? <span className="text-sm text-red-400">{apiError}</span> : null}
          </div>
        </form>

        {/* Results grid */}
        {!apiLoading && (
          <>
            {results.length > 0 ? (
              <div ref={resultsRef} className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {results.map((img) => (
                  <figure key={img.id} className="group relative overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={img.cdnUrl || "/placeholder.svg"}
                      alt={`Result ${img.id} for ${img.prompt}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-black/40 p-2 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      {img.style} • {img.width}×{img.height}
                    </figcaption>
                    <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href={img.cdnUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/20"
                      >
                        Open
                      </a>
                      <a
                        href="javascript:void(0)"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(img.cdnUrl, `aurora-${img.id}.png`);
                        }}
                        className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/20"
                      >
                        Download
                      </a>
                    </div>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-400">
                No results found.
              </p>
            )}
          </>
        )}
      </div>
    </div >
  )
}
