"use client";
import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyEmailAction, resendCodeAction } from "@/actions/Verify.action";

interface Props {
  email: string;
  messages: Record<string, Record<string, string>>;
  locale: string;
}

export default function VerifyEmailClient({ email, locale }: Props) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError("");

    if (clean && index < 5) {
      setActiveIndex(index + 1);
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (clean && index === 5) {
      const code = next.join("");
      if (code.length === 6) submitCode(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      submitCode(pasted);
    }
  };

  const submitCode = (code: string) => {
    startTransition(async () => {
      const result = await verifyEmailAction(email, code);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        setDigits(["", "", "", "", "", ""]);
        setActiveIndex(0);
        inputsRef.current[0]?.focus();
        return;
      }
      toast.success(isAr ? "تم التحقق بنجاح!" : "Verified successfully!");
setTimeout(() => {
  window.location.href = "/";
}, 800);
    });
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    startTransition(async () => {
      const result = await resendCodeAction(email);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isAr ? "تم إرسال كود جديد" : "New code sent!");
      setResendTimer(60);
    });
  };

  return (
    <div className="verify-root" dir={isAr ? "rtl" : "ltr"}>
      <style>{`
        .verify-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 20% 10%, rgba(216,143,101,0.18), transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(196,122,82,0.16), transparent 50%),
            linear-gradient(135deg, #18120d 0%, #241a12 45%, #1a130d 100%);
          font-family: var(--font-cormorant), Georgia, serif;
        }
        /* Floating golden particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #f4d9a8, #d4af6a 60%, transparent);
          box-shadow: 0 0 12px rgba(212,175,106,0.7);
          animation: floatUp linear infinite;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes floatUp {
          0%   { transform: translateY(20px) scale(0.6); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
        }
        /* 3D floating envelope */
        .envelope-stage {
          perspective: 800px;
          margin-bottom: 28px;
          display: flex;
          justify-content: center;
        }
        .envelope {
          width: 110px;
          height: 78px;
          position: relative;
          transform-style: preserve-3d;
          animation: floaty 4s ease-in-out infinite;
        }
        @keyframes floaty {
          0%,100% { transform: translateY(0) rotateX(12deg) rotateY(-14deg); }
          50%     { transform: translateY(-14px) rotateX(12deg) rotateY(-14deg); }
        }
        .env-body {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, #e9c98f, #d4af6a 55%, #b8924f);
          border-radius: 8px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,255,255,0.5);
        }
        .env-flap {
          position: absolute; top: 0; left: 0; right: 0;
          height: 0; width: 0;
          border-left: 55px solid transparent;
          border-right: 55px solid transparent;
          border-top: 40px solid #c79f5c;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
          transform-origin: top;
        }
        .env-seal {
          position: absolute;
          top: 30px; left: 50%;
          width: 26px; height: 26px;
          margin-left: -13px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #f6e7c4, #d4af6a 60%, #a87f3f);
          box-shadow: 0 0 18px rgba(244,217,168,0.9);
          z-index: 3;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #6b4f22; font-weight: bold;
          animation: pulse 2.4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 14px rgba(244,217,168,0.6); }
          50%     { box-shadow: 0 0 26px rgba(244,217,168,1); }
        }
        /* Glass card */
        .glass {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 440px;
          padding: 44px 34px 36px;
          border-radius: 24px;
          background: linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
          border: 1px solid rgba(212,175,106,0.35);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.18);
          text-align: center;
        }
        .glass h1 {
          color: #f4e6cf;
          font-size: 30px;
          font-weight: 600;
          margin: 0 0 8px;
          letter-spacing: 0.5px;
        }
        .glass .sub {
          color: rgba(244,230,207,0.65);
          font-size: 14px;
          margin: 0 0 4px;
          font-family: system-ui, sans-serif;
        }
        .glass .mail {
          color: #e0b878;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 28px;
          font-family: system-ui, sans-serif;
          word-break: break-all;
        }
        /* Code boxes */
        .code-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 26px;
          direction: ltr;
        }
        .code-box {
          width: 48px; height: 58px;
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          color: #f8edd8;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(212,175,106,0.4);
          border-radius: 14px;
          outline: none;
          transition: all 0.22s ease;
          font-family: system-ui, sans-serif;
          caret-color: #e0b878;
        }
        .code-box:focus, .code-box.filled {
          border-color: #e0b878;
          background: rgba(224,184,120,0.12);
          box-shadow: 0 0 0 3px rgba(224,184,120,0.18), 0 0 22px rgba(224,184,120,0.45);
          transform: translateY(-2px);
        }
        .code-box.err {
          border-color: #e06a5a;
          box-shadow: 0 0 0 3px rgba(224,106,90,0.18), 0 0 20px rgba(224,106,90,0.4);
        }
        .verify-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #2a1e10;
          cursor: pointer;
          font-family: system-ui, sans-serif;
          background: linear-gradient(135deg, #f4d9a8, #d4af6a 60%, #c79f5c);
          box-shadow: 0 10px 26px rgba(212,175,106,0.4);
          transition: opacity 0.2s, transform 0.2s;
        }
        .verify-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .verify-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .resend {
          margin-top: 20px;
          font-size: 13px;
          color: rgba(244,230,207,0.6);
          font-family: system-ui, sans-serif;
        }
        .resend button {
          background: none; border: none;
          color: #e0b878; font-weight: 600;
          cursor: pointer; font-size: 13px;
          font-family: system-ui, sans-serif;
        }
        .resend button:disabled { color: rgba(244,230,207,0.3); cursor: not-allowed; }
      `}</style>

      {/* Golden particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const size = 4 + (i % 4) * 3;
        const left = (i * 5.5 + 3) % 100;
        const dur = 8 + (i % 6) * 2;
        const delay = (i % 9) * 0.9;
        return (
          <span
            key={i}
            className="particle"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-20px",
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      <div className="glass">
        {/* 3D Envelope */}
        <div className="envelope-stage">
          <div className="envelope">
            <div className="env-body" />
            <div className="env-flap" />
            <div className="env-seal">✦</div>
          </div>
        </div>

        <h1>{isAr ? "تحقق من بريدك" : "Verify Your Email"}</h1>
        <p className="sub">
          {isAr
            ? "أدخلنا كوداً مكوناً من 6 أرقام إلى"
            : "We sent a 6-digit code to"}
        </p>
        <p className="mail">{email}</p>

        <div className="code-row" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => setActiveIndex(i)}
              className={`code-box ${d ? "filled" : ""} ${error ? "err" : ""}`}
            />
          ))}
        </div>

        <button
          className="verify-btn"
          disabled={isPending || digits.join("").length !== 6}
          onClick={() => submitCode(digits.join(""))}
        >
          {isPending
            ? isAr
              ? "جاري التحقق..."
              : "Verifying..."
            : isAr
              ? "تحقق"
              : "Verify"}
        </button>

        <div className="resend">
          {isAr ? "لم يصلك الكود؟ " : "Didn't receive it? "}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0 || isPending}
          >
            {resendTimer > 0
              ? `${isAr ? "إعادة الإرسال خلال" : "Resend in"} ${resendTimer}s`
              : isAr
                ? "إعادة الإرسال"
                : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
