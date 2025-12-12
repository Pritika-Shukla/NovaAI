"use client";
import VapiWidget  from "../components/VapiWidget";

export default function VapiPage() {
  return (
    <div>
      <h1>Talk to AI</h1>
      <VapiWidget 
        apiKey={process.env.NEXT_PUBLIC_VAPI_KEY!}
        assistantId={process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!}
      />
    </div>
  );
}
